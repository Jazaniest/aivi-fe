import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
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
      toast.success('Selamat datang kembali!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <circle cx="12" cy="12" r="4" fill="#06b6d4" opacity="0.9" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Masuk ke AIVI</h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Peringatan Bencana Berbasis AI</p>
        </div>

        {/* Form card */}
        <div className="card p-6">
          {/* Error alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-mono animate-fade-in">
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
                placeholder="nama@email.com"
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
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-border text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Guest access */}
        <div className="text-center mt-4">
          <Link to="/disasters" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Lihat informasi bencana tanpa login →
          </Link>
        </div>
      </div>
    </div>
  );
}