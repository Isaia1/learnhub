import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBackground from '../components/AppBackground';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: signInError } = signIn(email.trim(), password);
    setLoading(false);
    if (signInError) setError(signInError);
  };

  return (
    <>
      <AppBackground />
      <div className="page page-narrow page-scroll">
        <form onSubmit={handleLogin} className="fade-in" style={{ paddingTop: 48 }}>
          <Logo />
          <h1 className="h2" style={{ textAlign: 'center', marginTop: 32, marginBottom: 6 }}>Welcome back</h1>
          <p className="subtitle" style={{ textAlign: 'center', marginBottom: 28 }}>Sign in to continue learning</p>

          {error && <div className="banner-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.78)' }}>
            Don&apos;t have an account? <Link to="/signup" className="btn-link">Sign Up</Link>
          </p>
        </form>
      </div>
    </>
  );
}
