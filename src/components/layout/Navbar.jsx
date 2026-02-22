import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useDisasterStore } from '../../store/disasterStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { userAlerts } = useDisasterStore();
  const navigate = useNavigate();

  const criticalAlerts = userAlerts.filter((a) => a.impact_level === 'DIRECT');
  const totalAlerts = userAlerts.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="3" fill="#06b6d4" />
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            {criticalAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <span className="font-mono font-semibold text-white tracking-wider text-sm">AIVI</span>
            <span className="hidden sm:inline text-xs text-slate-500 ml-2">Disaster Alert System</span>
          </div>
        </NavLink>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link px-3 py-1.5 rounded hover:bg-surface-secondary transition-all text-xs sm:text-sm ${isActive ? 'text-cyan-400 bg-cyan-500/10' : ''}`
            }
          >
            Beranda
          </NavLink>
          <NavLink
            to="/disasters"
            className={({ isActive }) =>
              `nav-link px-3 py-1.5 rounded hover:bg-surface-secondary transition-all text-xs sm:text-sm ${isActive ? 'text-cyan-400 bg-cyan-500/10' : ''}`
            }
          >
            Bencana
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `nav-link px-3 py-1.5 rounded hover:bg-surface-secondary transition-all text-xs sm:text-sm ${isActive ? 'text-cyan-400 bg-cyan-500/10' : ''}`
            }
          >
            Peta
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `nav-link relative px-3 py-1.5 rounded hover:bg-surface-secondary transition-all text-xs sm:text-sm ${isActive ? 'text-cyan-400 bg-cyan-500/10' : ''}`
              }
            >
              Peringatan
              {totalAlerts > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-mono font-bold px-1 ${criticalAlerts.length > 0 ? 'bg-red-500 text-white animate-pulse-red' : 'bg-yellow-500 text-black'}`}>
                  {totalAlerts}
                </span>
              )}
            </NavLink>
          )}
        </nav>

        {/* Auth Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-white font-medium leading-none">{user?.name?.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">
                  {user?.location?.kabupaten || 'Lokasi tidak diketahui'}
                </span>
              </div>
              <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10 font-mono"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary text-xs py-1.5 px-3">
                Masuk
              </NavLink>
              <NavLink to="/register" className="btn-primary text-xs py-1.5 px-3">
                Daftar
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}