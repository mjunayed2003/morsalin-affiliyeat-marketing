import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';

export const BACKEND_URL = 
  process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/+$/, '') ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ||
  (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:3001');

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 
  `${BACKEND_URL}/api`;

let socket: Socket | null = null;

const getStoredToken = (): string | undefined => {
  if (!isBrowser) return undefined;
  try {
    return localStorage.getItem('bytedesk_token_v2') || undefined;
  } catch {
    return undefined;
  }
};

export const getSocket = (): Socket => {
  if (!socket && isBrowser) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: (cb) => {
        cb({ token: getStoredToken() });
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log(`⚡ [Socket.IO] Connected to ${BACKEND_URL}`);
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

export const updateSocketAuth = (token?: string) => {
  if (socket) {
    const activeToken = token || getStoredToken();
    socket.auth = { token: activeToken };
    if (!socket.connected) {
      socket.connect();
    }
  }
};
