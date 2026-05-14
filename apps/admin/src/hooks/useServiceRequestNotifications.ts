"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useServiceRequestNotifications(onNewRequest: (request: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get token for authentication
    const token = localStorage.getItem('sat_admin_token');
    if (!token) return;

    // Connect to main server first, then join admin namespace
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000', {
      auth: { token }
    });

    socketRef.current = socket;

    // Listen for service request notifications on main namespace
    socket.on('admin:new_service_request', (data) => {
      console.log('New service request notification:', data);
      onNewRequest(data);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewRequest]);

  return socketRef.current;
}
