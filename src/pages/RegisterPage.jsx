import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
// Import static data
import { countries as staticCountries, regions as staticRegions, zones as staticZones } from '../utils/regionData';

// Schema with conditional validation for province
const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  negara_id: z.string().min(1, 'Select country'),
  provinsi_id: z.string().optional(), // optional, will be validated manually
  kabupaten_id: z.string().min(1, 'Select district/city'),
}).refine((data) => {
  // If country is not Singapore, provinsi_id must be filled
  if (data.negara_id !== 'SG' && !data.provinsi_id) {
    return false;
  }
  return true;
}, {
  message: 'Select province',
  path: ['provinsi_id'],
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

function SelectField({ label, placeholder, disabled, loading, children, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          disabled={disabled || loading}
          className={`input-field appearance-none pr-8 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          {...props}
        >
          <option value="">{loading ? 'Loading...' : placeholder}</option>
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <span className="block w-3 h-3 border rounded-full border-slate-500 border-t-cyan-500 animate-spin" />
          ) : (
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path d="M2 4l4 4 4-4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      {error && <p className="text-[11px] text-red-400 font-mono mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register: doRegister, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [negaraList] = useState(staticCountries); // directly from static data
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [loadingRegion, setLoadingRegion] = useState({ negara: false, provinsi: false, kabupaten: false });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  //eslint-disable-next-line 
  const watchedNegara = watch('negara_id');
  const watchedProvinsi = watch('provinsi_id');

  // Simulate loading (can be removed because data is static, but keep for effect)
  useEffect(() => {
    setLoadingRegion((p) => ({ ...p, negara: true }));
    // simulate async
    setTimeout(() => setLoadingRegion((p) => ({ ...p, negara: false })), 300);
  }, []);

  // When country changes, load provinces
  useEffect(() => {
    if (!watchedNegara) {
      setProvinsiList([]);
      setKabupatenList([]);
      setValue('provinsi_id', '');
      setValue('kabupaten_id', '');
      return;
    }

    // Reset province and district
    setValue('provinsi_id', '');
    setValue('kabupaten_id', '');
    setKabupatenList([]);

    // If country = Singapore, no provinces
    if (watchedNegara === 'SG') {
      setProvinsiList([]);
      // Directly load zones for Singapore
      setLoadingRegion((p) => ({ ...p, kabupaten: true }));
      setTimeout(() => {
        setKabupatenList(staticZones['SG'] || []);
        setLoadingRegion((p) => ({ ...p, kabupaten: false }));
      }, 300);
    } else {
      // Load provinces from static data
      setLoadingRegion((p) => ({ ...p, provinsi: true }));
      setTimeout(() => {
        setProvinsiList(staticRegions[watchedNegara] || []);
        setLoadingRegion((p) => ({ ...p, provinsi: false }));
      }, 300);
    }
  }, [watchedNegara, setValue]);

  // When province changes (for non-Singapore countries), load districts
  useEffect(() => {
    // Only run if country is not Singapore and province is selected
    if (!watchedNegara || watchedNegara === 'SG') return;
    if (!watchedProvinsi) {
      setKabupatenList([]);
      return;
    }
    setValue('kabupaten_id', '');
    setLoadingRegion((p) => ({ ...p, kabupaten: true }));
    setTimeout(() => {
      setKabupatenList(staticZones[watchedProvinsi] || []);
      setLoadingRegion((p) => ({ ...p, kabupaten: false }));
    }, 300);
  }, [watchedProvinsi, watchedNegara, setValue]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      location: {
        negara_id: data.negara_id,
        provinsi_id: data.provinsi_id || null, // can be null for Singapore
        kabupaten_id: data.kabupaten_id,
      },
    };
    const result = await doRegister(payload);
    if (result.success) {
      toast.success('Account created successfully! Welcome to AIVI.');
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 py-8">
      {/* Background - same as before */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full top-1/4 right-1/4 bg-cyan-500/5 blur-3xl" />
        <div className="absolute w-48 h-48 rounded-full bottom-1/4 left-1/3 bg-blue-600/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border rounded-xl bg-cyan-500/10 border-cyan-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <circle cx="12" cy="12" r="4" fill="#06b6d4" opacity="0.9" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Create AIVI Account</h1>
          <p className="mt-1 text-sm text-slate-500">Receive disaster alerts based on your location</p>
        </div>

        <div className="p-6 card">
          {error && (
            <div className="p-3 mb-4 font-mono text-xs text-red-400 border rounded bg-red-500/10 border-red-500/30 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name, Email, Password - same structure */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Your full name"
                className="input-field"
                autoComplete="name"
              />
              {errors.name && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.name.message}</p>}
            </div>

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
              {errors.email && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Min. 8 characters"
                  className="input-field"
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                  Confirm
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Repeat password"
                  className="input-field"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Region — cascading dropdowns */}
            <div>
              <p className="mb-2 font-mono text-xs tracking-wider uppercase text-slate-400">
                Location
              </p>
              <div className="space-y-2.5 p-3 bg-navy-800/60 rounded-lg border border-border/60">
                {/* Country */}
                <SelectField
                  label="Country"
                  placeholder="Select country"
                  loading={loadingRegion.negara}
                  error={errors.negara_id?.message}
                  {...register('negara_id')}
                >
                  {negaraList.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </SelectField>

                {/* Province - disabled if country is Singapore or no country selected */}
                <SelectField
                  label="Province"
                  placeholder="Select province"
                  disabled={!watchedNegara || watchedNegara === 'SG'}
                  loading={loadingRegion.provinsi}
                  error={errors.provinsi_id?.message}
                  {...register('provinsi_id')}
                >
                  {provinsiList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </SelectField>

                {/* District / City */}
                <SelectField
                  label="District / City"
                  placeholder="Select district/city"
                  disabled={
                    !watchedNegara || 
                    (watchedNegara !== 'SG' && !watchedProvinsi) // need province unless Singapore
                  }
                  loading={loadingRegion.kabupaten}
                  error={errors.kabupaten_id?.message}
                  {...register('kabupaten_id')}
                >
                  {kabupatenList.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </SelectField>
              </div>
              <p className="text-[10px] text-slate-600 font-mono mt-1.5">
                This location determines the relevance of disaster alerts you receive
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 rounded-full border-navy-900 border-t-transparent animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="pt-4 mt-4 text-center border-t border-border">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium transition-colors text-cyan-400 hover:text-cyan-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}