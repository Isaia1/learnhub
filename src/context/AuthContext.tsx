import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/config';
import {
  clearLocalSession,
  getLocalDisplayName,
  getLocalSession,
  localSignIn,
  localSignUp,
  localResetPassword,
} from '../lib/localAuth';

export interface AuthUser {
  id: string;
  email: string;
}

interface Profile {
  displayName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  usesCloudSync: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ error: string | null; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const displayName = await getLocalDisplayName(userId);
    return { displayName };
  }

  const { data } = await supabase.from('profiles').select('display_name').eq('id', userId).maybeSingle();
  return { displayName: data?.display_name ?? null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const supabase = getSupabase();

      if (supabase) {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (!active) return;

        setSession(s);
        setUser(s?.user ? { id: s.user.id, email: s.user.email ?? '' } : null);
        if (s?.user) {
          fetchProfile(s.user.id).then((p) => active && setProfile(p));
        }
        setLoading(false);

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setUser(nextSession?.user ? { id: nextSession.user.id, email: nextSession.user.email ?? '' } : null);
          if (nextSession?.user) {
            fetchProfile(nextSession.user.id).then(setProfile);
          } else {
            setProfile(null);
          }
        });

        return () => listener.subscription.unsubscribe();
      }

      const localSession = await getLocalSession();
      if (!active) return;

      if (localSession) {
        setUser({ id: localSession.userId, email: localSession.email });
        fetchProfile(localSession.userId).then((p) => active && setProfile(p));
      }
      setLoading(false);
    }

    const cleanupPromise = bootstrap();
    return () => {
      active = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();

    if (!supabase) {
      const { error, session: localSession } = await localSignIn(email, password);
      if (error || !localSession) return { error: error ?? 'Sign in failed.' };

      setUser({ id: localSession.userId, email: localSession.email });
      const p = await fetchProfile(localSession.userId);
      setProfile(p);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    } catch {
      return { error: 'Could not reach the server. Check your internet and try again.' };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const supabase = getSupabase();

    if (!supabase) {
      const { error, session: localSession } = await localSignUp(email, password, displayName);
      if (error || !localSession) return { error: error ?? 'Sign up failed.' };

      setUser({ id: localSession.userId, email: localSession.email });
      setProfile({ displayName: displayName.trim() });
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error: error.message };

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          display_name: displayName,
        });
        setProfile({ displayName });
      }

      return { error: null };
    } catch {
      return { error: 'Could not reach the server. Check your internet and try again.' };
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    await clearLocalSession();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    const supabase = getSupabase();

    if (!supabase) {
      const { error } = await localResetPassword(email, newPassword);
      if (error) return { error };
      return { error: null, message: 'Password updated! You can sign in with your new password.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'learnhub://reset-password',
      });
      if (error) return { error: error.message };
      return { error: null, message: 'Check your email for a password reset link.' };
    } catch {
      return { error: 'Could not reach the server. Check your internet and try again.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        usesCloudSync: isSupabaseConfigured,
        signIn,
        signUp,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
