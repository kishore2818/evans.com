import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://evans-backend-3oyy.onrender.com';

export const socket = io(API_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('[WEBSOCKET] Connected to real-time server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[WEBSOCKET] Disconnected:', reason);
});

export default socket;
