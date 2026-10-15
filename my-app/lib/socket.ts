import { io, Socket } from 'socket.io-client';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
export const API_BASE_URL = `${BACKEND_URL}/api`;

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
