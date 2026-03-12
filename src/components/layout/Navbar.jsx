import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useDisasterStore } from '../../store/disasterStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { userAlerts } = useDisasterStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  const criticalAlerts = userAlerts.filter((a) => a.impact_level === 'DIRECT');
  const totalAlerts = userAlerts.length;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Close menu on route change
  useEffect(() => {
    //eslint-disable-next-line
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e) => {
      if (
        headerRef.current && !headerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/disasters', label: 'Disasters' },
    { to: '/map', label: 'Map' },
    ...(isAuthenticated ? [{ to: '/alerts', label: 'Alerts', badge: totalAlerts, critical: criticalAlerts.length > 0 }] : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b glass-surface border-border" ref={headerRef}>
        <div className="flex items-center justify-between gap-4 px-4 mx-auto max-w-7xl sm:px-6 h-14">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 flex items-center justify-center border rounded bg-cyan-500/20 border-cyan-500/40">
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
              <span className="font-mono text-sm font-semibold tracking-wider text-white">AIVI</span>
              <span className="hidden ml-2 text-xs sm:inline text-slate-500">Disaster Alert System</span>
            </div>
          </NavLink>

          {/* ─── DESKTOP Nav ─────────────────────────────────────── */}
          <nav className="items-center hidden gap-4 sm:flex">
            {navLinks.map(({ to, label, end, badge, critical }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-link relative px-3 py-1.5 rounded hover:bg-surface-secondary transition-all text-sm ${isActive ? 'text-cyan-400 bg-cyan-500/10' : ''}`
                }
              >
                {label}
                {badge > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-mono font-bold px-1 ${critical ? 'bg-red-500 text-white animate-pulse-red' : 'bg-yellow-500 text-black'}`}>
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ─── DESKTOP Auth ────────────────────────────────────── */}
          <div className="items-center hidden gap-2 sm:flex shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium leading-none text-white">{user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">
                    {user?.location?.kabupaten || 'Unknown location'}
                  </span>
                </div>
                <div className="flex items-center justify-center font-mono text-xs font-semibold border rounded w-7 h-7 bg-cyan-500/20 border-cyan-500/30 text-cyan-400">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 font-mono text-xs transition-colors rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary text-xs py-1.5 px-3">Login</NavLink>
                <NavLink to="/register" className="btn-primary text-xs py-1.5 px-3">Register</NavLink>
              </>
            )}
          </div>

          {/* ─── MOBILE Right side ───────────────────────────────── */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Alert badge shortcut */}
            {isAuthenticated && totalAlerts > 0 && (
              <NavLink
                to="/alerts"
                className="relative flex items-center justify-center w-8 h-8 transition-colors rounded hover:bg-surface-secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className={`absolute top-0.5 right-0.5 min-w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] font-mono font-bold px-0.5 ${criticalAlerts.length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-yellow-500 text-black'}`}>
                  {totalAlerts}
                </span>
              </NavLink>
            )}

            {/* Avatar (if logged in) */}
            {isAuthenticated && (
              <div className="flex items-center justify-center font-mono text-xs font-semibold border rounded w-7 h-7 bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.25 rounded hover:bg-surface-secondary transition-colors"
            >
              <span className={`block h-[1.5px] bg-slate-300 transition-all duration-300 origin-center ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'}`} />
              <span className={`block h-[1.5px] bg-slate-300 transition-all duration-300 ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'}`} />
              <span className={`block h-[1.5px] bg-slate-300 transition-all duration-300 origin-center ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'}`} />
            </button>
          </div>
        </div>

      </header>

      {/* ─── MOBILE Dropdown Menu (outside header to avoid clip) ── */}
      <div
        ref={dropdownRef}
        className={`
          sm:hidden fixed top-14 left-0 right-0 z-9999
          glass-surface border-b border-border/80
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          transition-all duration-300 ease-out
          ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="px-4 py-3 space-y-1">
          {/* Nav links */}
          {navLinks.map(({ to, label, end, badge, critical }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-surface-secondary'
                }`
              }
            >
              <span className="font-mono">{label}</span>
              {badge > 0 && (
                <span className={`min-w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-mono font-bold px-1.5 ${critical ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="h-px my-2 bg-border/50" />

          {/* Auth section */}
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex items-center justify-center w-8 h-8 font-mono text-xs font-semibold border rounded bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {user?.location?.kabupaten || 'Unknown location'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all font-mono"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pb-1">
              <NavLink to="/login" className="flex-1 py-2 text-xs text-center btn-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="flex-1 py-2 text-xs text-center btn-primary">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}