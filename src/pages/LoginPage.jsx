import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-cyan-500/5 blur-3xl" />
        <div className="absolute w-48 h-48 rounded-full bottom-1/3 right-1/4 bg-blue-500/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border rounded-xl bg-cyan-500/10 border-cyan-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <circle cx="12" cy="12" r="4" fill="#06b6d4" opacity="0.9" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Sign in to AIVI</h1>
          <p className="mt-1 text-sm text-slate-500">AI-Based Disaster Alert System</p>
        </div>

        {/* Form card */}
        <div className="p-6 card">
          {/* Error alert */}
          {error && (
            <div className="p-3 mb-4 font-mono text-xs text-red-400 border rounded bg-red-500/10 border-red-500/30 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@email.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 rounded-full border-navy-900 border-t-transparent animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 mt-5 text-center border-t border-border">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium transition-colors text-cyan-400 hover:text-cyan-300">
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Guest access */}
        <div className="mt-4 text-center">
          <Link to="/disasters" className="text-xs transition-colors text-slate-600 hover:text-slate-400">
            View disaster information without login →
          </Link>
        </div>
      </div>
    </div>
  );
}