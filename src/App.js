import './App.css';
import Board from './Board';
import StatusBar from './StatusBar';
import { GameProvider } from './GameContext';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <header className="App-header">
          <h1>7x7 RPG</h1>
          <StatusBar />
          <Board />
        </header>
      </div>
    </GameProvider>
  );
}

export default App;
