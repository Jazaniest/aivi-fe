import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DisastersPage from './pages/DisastersPage';
import DisasterDetailPage from './pages/DisasterDetailPage';
import MapPage from './pages/MapPage';
import AlertsPage from './pages/AlertsPage';
import { useAuthStore } from './store/authStore';
import { useDisasterStore } from './store/disasterStore';
import { AlertManager } from './components/alerts/AlertManager';
import { useRealtimeDisasters } from './hooks/useRealtimeDisasters';

function AppContent() {
  const { isAuthenticated, refreshUser } = useAuthStore();
  const { userAlerts, fetchDisasters, fetchUserAlerts, startPolling, stopPolling } = useDisasterStore();

  // Initialize WebSocket / real-time
  useRealtimeDisasters();

  useEffect(() => {
    // Refresh user profile on mount
    if (isAuthenticated) {
      refreshUser();
      fetchUserAlerts();
    }

    // Start polling for public data
    fetchDisasters();
    startPolling(30000);

    return () => stopPolling();
  }, [isAuthenticated, refreshUser, fetchDisasters, fetchUserAlerts, startPolling, stopPolling]);

  return (
    <>
      {/* Alert overlays for authenticated users */}
      {isAuthenticated && userAlerts.length > 0 && (
        <AlertManager alerts={userAlerts} />
      )}

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="disasters" element={<DisastersPage />} />
          <Route path="disasters/:id" element={<DisasterDetailPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}