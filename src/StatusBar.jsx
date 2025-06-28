import React, { useContext } from 'react';
import { GameContext } from './GameContext';
import './StatusBar.css';

function StatusBar() {
  const { health, food, gold, turn } = useContext(GameContext);

  return (
    <div className="status-bar" data-testid="status-bar">
      <span>HP: {health}</span>
      <span>Food: {food}</span>
      <span>Gold: {gold}</span>
      <span>Turn: {turn}</span>
    </div>
  );
}

export default StatusBar;
