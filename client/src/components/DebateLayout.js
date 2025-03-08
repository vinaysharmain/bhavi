import React from 'react';
import LeftSidebar from './LeftSidebar';
import ChatArea from './ChatArea';
import RightSidebar from './RightSidebar';
import EmojiPicker from './EmojiPicker';
import { useSocket } from '../contexts/SocketContext';
import { usePeer } from '../contexts/PeerContext';

const DebateLayout = () => {
  const { socket } = useSocket();
  const { peer } = usePeer();

  return (
    <div className="flex h-screen main-container">
      <LeftSidebar />
      <ChatArea />
      <RightSidebar />
      <EmojiPicker />
    </div>
  );
};

export default DebateLayout; 