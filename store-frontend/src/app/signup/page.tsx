"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to register with:', formData);

      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Server response:', { status: res.status, data });

      if (res.ok) {
        alert('Registration successful! Please login.');
        router.push('/login');
      } else {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Registration failed';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="card">
          <h1 className="text-3xl font-bold mb-8 text-center text-text-primary">Sign Up</h1>
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <select
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            <button 
              type="submit" 
              disabled={loading}
              className={`btn-primary w-full py-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <Link 
              href="/login" 
              className="block text-center text-primary hover:text-accent transition-colors font-medium"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
