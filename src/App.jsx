import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <FlowCanvas />
      </div>
      <NotificationSystem />
    </div>
  );
}

export default App;

