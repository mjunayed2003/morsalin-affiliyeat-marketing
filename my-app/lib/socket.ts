import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// When developing locally on localhost, always target the local NestJS backend on port 3001
export const BACKEND_URL = 
  (isLocalhost ? 'http://localhost:3001' : null) ||
  process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/+$/, '') ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ||
  (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:3001');

export const API_BASE_URL = 
  (isLocalhost ? 'http://localhost:3001/api' : null) ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 
  `${BACKEND_URL}/api`;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket && isBrowser) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log(`⚡ [Socket.IO] Connected successfully to ${BACKEND_URL} (ID: ${socket?.id})`);
    });

    socket.on('connect_error', (err) => {
      console.warn(`⚠️ [Socket.IO] Connection error to ${BACKEND_URL}:`, err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [Socket.IO] Disconnected from ${BACKEND_URL}:`, reason);
    });
  }
  return socket as Socket;
};
