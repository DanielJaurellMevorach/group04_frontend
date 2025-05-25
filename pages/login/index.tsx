import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import authService from '../../services/user.service';
import Navbar from '@/components/navbar';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(username, password);

      // Store token, username, and role in sessionStorage
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('username', response.username);
      sessionStorage.setItem('role', response.role);

      // Redirect to home or dashboard page
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 py-2 md:py-2"></div>

      </section>
    <div className="max-w-screen-lg mx-auto p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-semibold mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#c9a895] text-white rounded-full hover:bg-[#b58c7a] focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>


          </div>
        </form>

        <div className="mt-8 text-center">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#c9a895] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
