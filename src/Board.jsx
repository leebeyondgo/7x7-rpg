import React, { useState } from 'react';
import './Board.css';

const BOARD_SIZE = 7;
const CENTER = Math.floor(BOARD_SIZE / 2);

function Board() {
  const [position, setPosition] = useState({ row: CENTER, col: CENTER });

  const move = (dRow, dCol) => {
    setPosition(pos => {
      const newRow = Math.min(Math.max(pos.row + dRow, 0), BOARD_SIZE - 1);
      const newCol = Math.min(Math.max(pos.col + dCol, 0), BOARD_SIZE - 1);
      return { row: newRow, col: newCol };
    });
  };

  const moveUp = () => move(-1, 0);
  const moveDown = () => move(1, 0);
  const moveLeft = () => move(0, -1);
  const moveRight = () => move(0, 1);

  const tiles = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const isHero = r === position.row && c === position.col;
      tiles.push(
        <div
          key={`${r}-${c}`}
          className={`tile${isHero ? ' hero' : ''}`}
          role="presentation"
        />
      );
    }
  }

  return (
    <div className="board-container">
      <div className="board" data-testid="board">
        {tiles}
      </div>
      <div className="dpad">
        <button onClick={moveUp} aria-label="up">↑</button>
        <div className="middle-row">
          <button onClick={moveLeft} aria-label="left">←</button>
          <button onClick={moveRight} aria-label="right">→</button>
        </div>
        <button onClick={moveDown} aria-label="down">↓</button>
      </div>
    </div>
  );
}

export default Board;
