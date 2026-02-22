import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-navy-900 grid-bg">
      {/* Scan line ambient effect */}
      <div
        className="fixed top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none z-50"
        style={{ animation: 'scanLine 10s linear infinite' }}
      />

      <Navbar />

      <main className="pt-14 min-h-screen">
        <Outlet />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#e2e8f0',
            border: '1px solid #1e2d45',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#06b6d4', secondary: '#0a0e1a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' },
          },
        }}
      />
    </div>
  );
}