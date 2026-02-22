import React, { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDisasterStore } from '../store/disasterStore';
import { socketService } from '../services/socket';
import toast from 'react-hot-toast';

/**
 * Initializes WebSocket connection and subscribes to disaster events.
 * Falls back to polling if WebSocket is unavailable.
 */
export function useRealtimeDisasters() {
  const { isAuthenticated, token } = useAuthStore();
  const { addOrUpdateDisaster, fetchUserAlerts } = useDisasterStore();

  const handleNewDisaster = useCallback((disaster) => {
    addOrUpdateDisaster(disaster);

    // Show toast for critical new events
    if (disaster.status === 'ACTIVE' && disaster.severity === 'CRITICAL') {
      toast.custom(
        (t) =>
          React.createElement(
            'div',
            {
              className: `${t.visible ? 'animate-slide-up' : 'opacity-0'} bg-red-950 border border-red-500/40 rounded-lg p-3 max-w-xs`,
            },
            React.createElement(
              'div',
              { className: 'flex items-start gap-2' },
              React.createElement('span', { className: 'text-base' }, '⚠️'),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'p',
                  { className: 'text-xs font-mono text-red-400 font-semibold' },
                  'BENCANA BARU TERDETEKSI'
                ),
                React.createElement(
                  'p',
                  { className: 'text-xs text-slate-300 mt-0.5' },
                  disaster.name
                )
              )
            )
          ),
        { duration: 8000 }
      );
    }

    // Refresh user alerts if authenticated
    if (isAuthenticated) {
      fetchUserAlerts();
    }
  }, [addOrUpdateDisaster, fetchUserAlerts, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    //eslint-disable-next-line
    const socket = socketService.connect(token);

    socketService.on('disaster:new', handleNewDisaster);
    socketService.on('disaster:update', handleNewDisaster);
    socketService.on('alert:new', () => {
      fetchUserAlerts();
    });

    return () => {
      socketService.off('disaster:new', handleNewDisaster);
      socketService.off('disaster:update', handleNewDisaster);
      socketService.off('alert:new', fetchUserAlerts);
    };
    //eslint-disable-next-line
  }, [isAuthenticated, token, handleNewDisaster]);
}

/**
 * Returns the user's current impact level for a given disaster.
 * Reads from the disaster's user_impact_level field set by backend.
 */
export function useUserImpactLevel(disaster) {
  return disaster?.user_impact_level || 'NONE';
}