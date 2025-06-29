import { useState } from 'react';
import './App.css';
import Board from './Board';
import StatusBar from './StatusBar';
import { GameProvider } from './GameContext';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <GameProvider>
      <div className={`App ${theme}-theme`}>
        <header className="App-header">
          <h1>7x7 RPG</h1>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <StatusBar />
          <Board />
        </header>
      </div>
    </GameProvider>
  );
}

export default App;
