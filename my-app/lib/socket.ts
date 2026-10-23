import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';

const resolveBackendUrl = (): string => {
  let url = 
    process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/+$/, '') ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ||
    (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : '');

  if (url.includes('30011')) {
    url = url.replace('30011', '3001');
  }

  return url || 'http://localhost:3001';
};

const resolveApiBaseUrl = (): string => {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';
  if (apiUrl.includes('30011')) {
    apiUrl = apiUrl.replace('30011', '3001');
  }
  return apiUrl || `${resolveBackendUrl()}/api`;
};

export const BACKEND_URL = resolveBackendUrl();
export const API_BASE_URL = resolveApiBaseUrl();

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
      transports: ['polling', 'websocket'],
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
