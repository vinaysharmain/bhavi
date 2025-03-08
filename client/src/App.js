import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DebateLayout from './components/DebateLayout';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <DebateLayout />
      </div>
    </Router>
  );
}

export default App; 