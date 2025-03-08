import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketProvider } from './contexts/SocketContext';
import { PeerProvider } from './contexts/PeerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <PeerProvider>
        <App />
      </PeerProvider>
    </SocketProvider>
  </React.StrictMode>
); 