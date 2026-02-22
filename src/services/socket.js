import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8000';

let socket = null;

export const socketService = {
  connect(token) {
    if (socket?.connected) return socket;

    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[AIVI WS] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[AIVI WS] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[AIVI WS] Connection error:', err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  on(event, callback) {
    if (socket) socket.on(event, callback);
  },

  off(event, callback) {
    if (socket) socket.off(event, callback);
  },

  getSocket() {
    return socket;
  },
};