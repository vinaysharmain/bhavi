import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import FactChecker from './FactChecker';

const LeftSidebar = () => {
  const { socket } = useSocket();
  const [points, setPoints] = useState({ team1: 0, team2: 0 });
  const [topic, setTopic] = useState('Loading...');
  const [teamInfo, setTeamInfo] = useState({
    name: 'Loading...',
    position: 'Loading...'
  });

  useEffect(() => {
    // Load initial data from localStorage
    const debateTopic = localStorage.getItem('debateTopic');
    const team = localStorage.getItem('debateTeam');
    const team1Name = localStorage.getItem('team1Name');
    const team2Name = localStorage.getItem('team2Name');
    const team1Position = localStorage.getItem('team1Position');
    const team2Position = localStorage.getItem('team2Position');

    setTopic(debateTopic);
    setTeamInfo({
      name: team === 'team1' ? team1Name : team2Name,
      position: team === 'team1' ? team1Position : team2Position
    });

    // Listen for points updates
    if (socket) {
      socket.on('updatePoints', (newPoints) => {
        setPoints(newPoints);
      });
    }
  }, [socket]);

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 shadow-lg sidebar">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 compact-section">
        <div className="text-2xl font-bold text-gray-800 mb-2">{topic}</div>
        <div className="text-xs text-gray-600 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Active Debate Session
        </div>
      </div>
      
      {/* Team Info */}
      <div className="p-3 space-y-2">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <i className="fas fa-users text-blue-500"></i> Your Team
          </h3>
          <div className="p-2 bg-blue-50 rounded-lg compact-info">
            <div className="font-medium text-blue-800">{teamInfo.name}</div>
            <div className="text-sm text-blue-600 mt-1">Position: {teamInfo.position}</div>
          </div>
        </div>
        
        {/* Points */}
        <div className="mb-2 bg-gradient-to-r from-slate-50 to-gray-50 p-2 rounded-lg">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <i className="fas fa-star text-yellow-500"></i> Debate Points
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 rounded-lg compact-info">
              <div className="text-sm text-green-600">{localStorage.getItem('team1Name')}</div>
              <div className="font-bold text-green-800">{points.team1}</div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg compact-info">
              <div className="text-sm text-purple-600">{localStorage.getItem('team2Name')}</div>
              <div className="font-bold text-purple-800">{points.team2}</div>
            </div>
          </div>
        </div>

        {/* Fact Checker */}
        <FactChecker />
      </div>
    </div>
  );
};

export default LeftSidebar; 