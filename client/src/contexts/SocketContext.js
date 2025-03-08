import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://vidhi.onrender.com', {
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      forceNew: true,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
      const debateTopic = localStorage.getItem('debateTopic');
      const username = localStorage.getItem('username');
      const userTeam = localStorage.getItem('debateTeam');

      if (debateTopic && username && userTeam) {
        console.log('Joining debate:', debateTopic);
        newSocket.emit('joinDebate', {
          topic: debateTopic,
          username: username,
          team: userTeam
        });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}; 