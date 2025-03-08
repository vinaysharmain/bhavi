import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const Message = ({ message }) => {
  const { socket } = useSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const username = localStorage.getItem('username');
  const isLocalMessage = message.username === username;

  const handleVote = (vote) => {
    socket.emit('votePoll', {
      pollId: message.pollId,
      vote,
      username,
      topic: localStorage.getItem('debateTopic')
    });
  };

  const handleAddReaction = (emoji) => {
    socket.emit('addReaction', {
      messageId: message.id,
      emoji,
      username,
      topic: localStorage.getItem('debateTopic')
    });
    setShowEmojiPicker(false);
  };

  if (message.type === 'system') {
    return (
      <div className="text-center text-sm text-gray-500 my-2">
        {message.text}
      </div>
    );
  }

  if (message.audioUrl) {
    return (
      <div className={`message-bubble p-4 rounded-lg shadow-sm ${
        message.team === 'team1' ? 'message-team1' : 'message-team2'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${
            message.team === 'team1' ? 'text-blue-600' : 'text-green-600'
          }`}>{message.username}{isLocalMessage ? ' (You)' : ''}</span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-400 text-xs">{message.timestamp}</span>
          <span className="text-xs text-gray-400"><i className="fas fa-microphone ml-2"></i></span>
        </div>
        <div className="text-gray-800">
          <audio controls src={message.audioUrl} className="w-full h-8" style={{ minHeight: '30px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`message-bubble p-4 rounded-lg shadow-sm ${
      message.team === 'team1' ? 'message-team1' : 'message-team2'
    } relative`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-medium text-sm ${
          message.team === 'team1' ? 'text-blue-600' : 'text-green-600'
        }`}>{message.username}{isLocalMessage ? ' (You)' : ''}</span>
        <span className="text-gray-400 text-xs">•</span>
        <span className="text-gray-400 text-xs">{message.timestamp}</span>
      </div>
      <div className="text-gray-800">{message.text}</div>

      {/* Poll section */}
      {(message.isQuestion || message.isAnswer) && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="text-sm text-gray-600 mb-2">
            Validate this {message.isQuestion ? 'question' : 'answer'}:
          </div>
          <div className="flex gap-2" id={`poll-buttons-${message.pollId}`}>
            <button
              onClick={() => handleVote('valid')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              <i className="fas fa-check mr-1"></i> Valid
            </button>
            <button
              onClick={() => handleVote('invalid')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <i className="fas fa-times mr-1"></i> Invalid
            </button>
          </div>
          <div className="mt-2 text-sm" id={`poll-results-${message.pollId}`}>
            Waiting for votes...
          </div>
        </div>
      )}

      {/* Reaction button */}
      <button
        onClick={() => setShowEmojiPicker(true)}
        className="reaction-button absolute -right-2 -top-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
      >
        <i className="fas fa-smile text-gray-500"></i>
      </button>

      {/* Reactions display */}
      <div className="reactions-container mt-2 flex flex-wrap gap-1">
        {message.reactions && Object.entries(message.reactions).map(([emoji, users]) => (
          <div key={emoji} className="reaction-count" title={users.join(', ')}>
            <span>{emoji}</span>
            <span>{users.length}</span>
          </div>
        ))}
      </div>

      {/* Emoji picker modal */}
      {showEmojiPicker && (
        <div className="emoji-picker-modal">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Reaction</h3>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="emoji-grid">
              {['👍', '👎', '❤️', '😊', '🤔', '👏', '🎉', '💡'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleAddReaction(emoji)}
                  className="emoji-button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message; 