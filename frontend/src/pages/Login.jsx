import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import TextField from '../components/TextField.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to generate assessment reports"
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
        />
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </PrimaryButton>
      </form>
      <p className="mt-6 text-sm text-slate-300">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold" to="/signup">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
