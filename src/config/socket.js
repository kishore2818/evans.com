import { io } from 'socket.io-client';
import API_BASE_URL from './api';

export const socket = io(API_BASE_URL, {
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
