import { io, Socket } from 'socket.io-client';

// Unified API & Backend URL derivation: only NEXT_PUBLIC_API_URL is needed!
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 
  (process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '')}/api` : 'http://localhost:3001/api');

export const BACKEND_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') || 
  API_BASE_URL.replace(/\/api\/?$/, '') || 
  'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket && typeof window !== 'undefined') {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket as Socket;
};
