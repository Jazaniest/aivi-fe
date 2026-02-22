import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
// Import data statis
import { countries as staticCountries, regions as staticRegions, zones as staticZones } from '../utils/regionData';

// Schema dengan validasi bersyarat untuk provinsi
const schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
  negara_id: z.string().min(1, 'Pilih negara'),
  provinsi_id: z.string().optional(), // opsional, akan divalidasi manual
  kabupaten_id: z.string().min(1, 'Pilih kabupaten/kota'),
}).refine((data) => {
  // Jika negara bukan Singapura, provinsi_id harus diisi
  if (data.negara_id !== 'SG' && !data.provinsi_id) {
    return false;
  }
  return true;
}, {
  message: 'Pilih provinsi',
  path: ['provinsi_id'],
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
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
          <option value="">{loading ? 'Memuat...' : placeholder}</option>
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <span className="w-3 h-3 border border-slate-500 border-t-cyan-500 rounded-full animate-spin block" />
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

  const [negaraList] = useState(staticCountries); // langsung dari data statis
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

  // Simulasi loading (bisa dihilangkan karena data statis, tapi biar ada efek)
  useEffect(() => {
    setLoadingRegion((p) => ({ ...p, negara: true }));
    // simulasi async
    setTimeout(() => setLoadingRegion((p) => ({ ...p, negara: false })), 300);
  }, []);

  // Ketika negara berubah, muat provinsi
  useEffect(() => {
    if (!watchedNegara) {
      setProvinsiList([]);
      setKabupatenList([]);
      setValue('provinsi_id', '');
      setValue('kabupaten_id', '');
      return;
    }

    // Reset provinsi dan kabupaten
    setValue('provinsi_id', '');
    setValue('kabupaten_id', '');
    setKabupatenList([]);

    // Jika negara = Singapura, tidak ada provinsi
    if (watchedNegara === 'SG') {
      setProvinsiList([]);
      // Langsung muat zone untuk Singapura
      setLoadingRegion((p) => ({ ...p, kabupaten: true }));
      setTimeout(() => {
        setKabupatenList(staticZones['SG'] || []);
        setLoadingRegion((p) => ({ ...p, kabupaten: false }));
      }, 300);
    } else {
      // Muat provinsi dari data statis
      setLoadingRegion((p) => ({ ...p, provinsi: true }));
      setTimeout(() => {
        setProvinsiList(staticRegions[watchedNegara] || []);
        setLoadingRegion((p) => ({ ...p, provinsi: false }));
      }, 300);
    }
  }, [watchedNegara, setValue]);

  // Ketika provinsi berubah (untuk negara bukan Singapura), muat kabupaten
  useEffect(() => {
    // Hanya jalan jika negara bukan Singapura dan provinsi dipilih
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
        provinsi_id: data.provinsi_id || null, // bisa null untuk Singapura
        kabupaten_id: data.kabupaten_id,
      },
    };
    const result = await doRegister(payload);
    if (result.success) {
      toast.success('Akun berhasil dibuat! Selamat datang di AIVI.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative">
      {/* Background - sama seperti sebelumnya */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <circle cx="12" cy="12" r="4" fill="#06b6d4" opacity="0.9" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Buat Akun AIVI</h1>
          <p className="text-sm text-slate-500 mt-1">Terima peringatan bencana sesuai lokasimu</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-mono animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name, Email, Password - sama */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                Nama Lengkap
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Nama Lengkap Anda"
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
                placeholder="nama@email.com"
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
                  placeholder="Min. 8 karakter"
                  className="input-field"
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                  Konfirmasi
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Ulangi password"
                  className="input-field"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Region — cascading dropdowns */}
            <div>
              <p className="text-xs font-mono text-slate-400 mb-2 tracking-wider uppercase">
                Asal Wilayah
              </p>
              <div className="space-y-2.5 p-3 bg-navy-800/60 rounded-lg border border-border/60">
                {/* Negara */}
                <SelectField
                  label="Negara"
                  placeholder="Pilih negara"
                  loading={loadingRegion.negara}
                  error={errors.negara_id?.message}
                  {...register('negara_id')}
                >
                  {negaraList.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </SelectField>

                {/* Provinsi - disabled jika negara Singapura atau belum pilih negara */}
                <SelectField
                  label="Provinsi"
                  placeholder="Pilih provinsi"
                  disabled={!watchedNegara || watchedNegara === 'SG'}
                  loading={loadingRegion.provinsi}
                  error={errors.provinsi_id?.message}
                  {...register('provinsi_id')}
                >
                  {provinsiList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </SelectField>

                {/* Kabupaten / Kota */}
                <SelectField
                  label="Kabupaten / Kota"
                  placeholder="Pilih kabupaten/kota"
                  disabled={
                    !watchedNegara || 
                    (watchedNegara !== 'SG' && !watchedProvinsi) // butuh provinsi kecuali Singapura
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
                Lokasi ini menentukan relevansi peringatan bencana yang Anda terima
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  Membuat akun...
                </>
              ) : (
                'Buat Akun'
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-xs text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}