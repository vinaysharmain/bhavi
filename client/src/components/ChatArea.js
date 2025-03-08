import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { usePeer } from '../contexts/PeerContext';
import Message from './Message';
import VoiceRecorder from './VoiceRecorder';

const ChatArea = () => {
  const { socket } = useSocket();
  const { peer } = usePeer();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem('username');
  const userTeam = localStorage.getItem('debateTeam');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('receiveVoiceMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('userJoined', (data) => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: `${data.username} joined the debate`,
          id: Date.now()
        }]);
      });
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      text: input,
      team: userTeam,
      username: username,
      topic: localStorage.getItem('debateTopic'),
      isQuestion: input.endsWith('?'),
      isAnswer: input.startsWith('(') && input.endsWith(')'),
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };

    socket.emit('sendMessage', messageData);
    setInput('');
  };

  const handleVoiceMessage = (audioUrl) => {
    const messageData = {
      audioUrl,
      team: userTeam,
      username: username,
      topic: localStorage.getItem('debateTopic'),
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };

    socket.emit('sendVoiceMessage', messageData);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-comments text-blue-500"></i> Debate Discussion
            </h2>
            <p className="text-sm text-gray-500">All messages are recorded for review</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              onClick={() => {/* Handle voice call */}}
            >
              <i className="fas fa-phone-alt"></i>
              <span>Join Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="message-area">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Type your message... (use ? for questions, () for answers)"
          />
          <VoiceRecorder
            onRecordingComplete={handleVoiceMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea; 