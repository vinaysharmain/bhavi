import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const FactChecker = () => {
  const { socket } = useSocket();
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add loading state
    setResults(prev => [{
      type: 'loading',
      id: Date.now()
    }, ...prev]);

    // Send fact check request
    socket.emit('checkFact', { text: input });
    setInput('');
  };

  // Listen for fact check results
  React.useEffect(() => {
    if (socket) {
      socket.on('factCheckResult', (data) => {
        setResults(prev => {
          // Remove loading state
          const filtered = prev.filter(r => r.type !== 'loading');
          return [{
            type: 'result',
            data,
            id: Date.now()
          }, ...filtered];
        });
      });
    }
  }, [socket]);

  return (
    <div className="fact-checker-container">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        <i className="fas fa-check-circle text-blue-500"></i> Fact Checker
      </h3>
      <div className="bg-white rounded-lg p-3">
        <div className="mb-2 text-sm text-gray-600">Ask a question or verify a fact:</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter fact to check..."
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-robot mr-2"></i>
            Check Fact
          </button>
        </form>
      </div>
      <div className="fact-results">
        {results.map(result => {
          if (result.type === 'loading') {
            return (
              <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                  <div className="text-gray-400">AI is analyzing...</div>
                </div>
              </div>
            );
          }

          return (
            <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="text-sm text-gray-500 mb-1">Query:</div>
              <div className="text-gray-800 mb-3">{result.data.original}</div>
              <div className="text-sm text-gray-500 mb-1">AI Response:</div>
              <div className="text-gray-800 whitespace-pre-wrap">{result.data.result}</div>
              <div className="text-xs text-gray-400 mt-2">{result.data.timestamp}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FactChecker; 