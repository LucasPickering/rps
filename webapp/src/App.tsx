import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  console.log('render');
  const [isOpen, setIsOpen] = useState(false);
  const ws = new WebSocket(`ws://${window.location.host}/ws/match/a`);
  ws.onopen = () => {
    console.log('open');
    ws.send(JSON.stringify({ message: 'asdf' }));
    setIsOpen(true);
  };

  return (
    <div className="App">
      <button
        disabled={!isOpen}
        onClick={() => {
          ws.send(JSON.stringify({ message: 'click!' }));
        }}
      >
        Click!
      </button>
    </div>
  );
};

export default App;
