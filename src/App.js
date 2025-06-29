import { useState, useEffect } from 'react';
import './App.css';
import Board from './Board';
import StatusBar from './StatusBar';
import { GameProvider } from './GameContext';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <GameProvider>
      <div className={`App ${theme}-theme`}>
        <header className="App-header">
          <h1>7x7 RPG</h1>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌞' : '🌙'}
          </button>
          <StatusBar />
          <Board />
        </header>
      </div>
    </GameProvider>
  );
}

export default App;
