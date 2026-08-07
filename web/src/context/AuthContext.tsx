import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  clearLocalSession,
  getLocalDisplayName,
  getLocalSession,
  localSignIn,
  localSignUp,
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
  loading: boolean;
  signIn: (email: string, password: string) => { error: string | null };
  signUp: (email: string, password: string, displayName: string) => { error: string | null };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getLocalSession();
    if (session) {
      setUser({ id: session.userId, email: session.email });
      setProfile({ displayName: getLocalDisplayName(session.userId) });
    }
    setLoading(false);
  }, []);

  const signIn = (email: string, password: string) => {
    const { error, session } = localSignIn(email, password);
    if (error || !session) return { error: error ?? 'Sign in failed.' };
    setUser({ id: session.userId, email: session.email });
    setProfile({ displayName: getLocalDisplayName(session.userId) });
    return { error: null };
  };

  const signUp = (email: string, password: string, displayName: string) => {
    const { error, session } = localSignUp(email, password, displayName);
    if (error || !session) return { error: error ?? 'Sign up failed.' };
    setUser({ id: session.userId, email: session.email });
    setProfile({ displayName: displayName.trim() });
    return { error: null };
  };

  const signOut = () => {
    clearLocalSession();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
