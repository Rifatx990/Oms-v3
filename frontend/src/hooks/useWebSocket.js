import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const useWebSocket = (events = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    socketRef.current = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket']
    });

    // Set up event listeners
    Object.entries(events).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [events]);

  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const subscribe = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const unsubscribe = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  return { socket: socketRef.current, emit, subscribe, unsubscribe };
};

export default useWebSocket;
