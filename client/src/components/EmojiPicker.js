import React from 'react';

const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = ['👍', '👎', '❤️', '😊', '🤔', '👏', '🎉', '💡'];

  return (
    <div className="emoji-picker-modal">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Reaction</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="emoji-grid">
          {emojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="emoji-button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker; 