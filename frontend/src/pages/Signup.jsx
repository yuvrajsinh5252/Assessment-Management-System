import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import TextField from '../components/TextField.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Set up your workspace to request assessment reports"
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <TextField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Jamie Doe"
        />
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
          placeholder="Create a strong password"
        />
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </PrimaryButton>
      </form>
      <p className="mt-6 text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="font-semibold" to="/login">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
