import React, { createContext, useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => {
  return useContext(PeerContext);
};

export const PeerProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    if (typeof Peer === 'undefined') {
      console.error('PeerJS library not loaded');
      return;
    }

    const newPeer = new Peer(`debate-${localStorage.getItem('debateTeam')}-${Date.now()}`, {
      host: window.location.hostname,
      port: window.location.port || 443,
      path: '/peerjs',
      secure: window.location.protocol === 'https:'
    });

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    newPeer.on('error', (error) => {
      console.error('PeerJS error:', error);
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  return (
    <PeerContext.Provider value={{ peer }}>
      {children}
    </PeerContext.Provider>
  );
}; 