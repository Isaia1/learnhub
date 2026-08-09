import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AnimatedScreen from '../components/AnimatedScreen';
import FadeInView from '../components/FadeInView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import Logo from '../components/Logo';
import AuthTextInput from '../components/AuthTextInput';
import { AuthStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) setError(signInError);
  };

  return (
    <AnimatedScreen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FadeInView>
          <Logo />
          </FadeInView>
          <FadeInView delay={100}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to continue learning</Text>
          </FadeInView>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <AuthTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="Your password"
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotRow}>
            <Text style={styles.linkAction}>Forgot password?</Text>
          </TouchableOpacity>

          <FadeInView delay={200}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          </FadeInView>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkRow}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <Text style={styles.linkAction}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  errorBanner: {
    backgroundColor: colors.error + '15',
    color: colors.error,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkAction: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
});
