import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const RightSidebar = () => {
  const { socket } = useSocket();
  const [questions, setQuestions] = useState([]);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        if (message.isQuestion || message.isAnswer) {
          setQuestions(prev => [...prev, message]);
        }
      });

      socket.on('pollUpdate', (data) => {
        setQuestions(prev => prev.map(q => {
          if (q.pollId === data.pollId) {
            const validPercentage = Math.round((data.votes.valid / data.totalVotes) * 100) || 0;
            const invalidPercentage = 100 - validPercentage;

            // Remove invalid questions/answers
            if (data.totalVotes >= 3 && invalidPercentage > 50) {
              return null;
            }

            return {
              ...q,
              pollResults: {
                validPercentage,
                totalVotes: data.totalVotes
              }
            };
          }
          return q;
        }).filter(Boolean));
      });
    }
  }, [socket]);

  const handleVote = (vote) => {
    socket.emit('votePoll', {
      pollId: selectedQuestion.pollId,
      vote,
      username: localStorage.getItem('username'),
      topic: localStorage.getItem('debateTopic')
    });
    setShowVerification(false);
  };

  return (
    <div className="w-1/4 bg-white border-l border-gray-200 shadow-lg">
      {/* Questions Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-question-circle text-purple-500"></i>
          Questions & Rebuttals
        </h2>
      </div>

      {/* Questions List */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {questions.map(question => (
          <div
            key={question.id}
            id={`qa-${question.pollId}`}
            className={`p-4 rounded-lg shadow-sm ${
              question.pollResults?.validPercentage > 50
                ? 'bg-green-50 border border-green-200'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium text-sm ${
                question.team === 'team1' ? 'text-blue-600' : 'text-green-600'
              }`}>{question.username}</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">{question.timestamp}</span>
            </div>
            <div className="text-gray-800 mb-2">{question.text}</div>
            {question.pollResults && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${question.pollResults.validPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600">{question.pollResults.validPercentage}% valid</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {question.pollResults.totalVotes} total votes
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Question Verification Modal */}
      {showVerification && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Question</h3>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              {selectedQuestion.text}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleVote('invalid')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleVote('valid')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar; 