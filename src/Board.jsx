import React, { useState, useEffect } from 'react';
import './Board.css';

const BOARD_SIZE = 7;
const CENTER = Math.floor(BOARD_SIZE / 2);

function Board() {
  const [showDpad, setShowDpad] = useState(true);
  // 전역 맵에서의 좌표를 관리한다
  const [worldPosition, setWorldPosition] = useState({ row: 0, col: 0 });

  const move = (dRow, dCol) => {
    // 보드 내 위치가 아닌 전역 위치를 이동시킨다
    setWorldPosition(pos => ({
      row: pos.row + dRow,
      col: pos.col + dCol,
    }));
  };

  const moveUp = () => move(-1, 0);
  const moveDown = () => move(1, 0);
  const moveLeft = () => move(0, -1);
  const moveRight = () => move(0, 1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const tiles = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // 현재 보드 타일이 전역 맵에서 어떤 위치에 해당하는지 계산
      const worldRow = worldPosition.row + (r - CENTER);
      const worldCol = worldPosition.col + (c - CENTER);
      const isHero = r === CENTER && c === CENTER;
      tiles.push(
        <div
          key={`${worldRow}-${worldCol}`}
          className={`tile${isHero ? ' hero' : ''}`}
          role="presentation"
          data-row={worldRow}
          data-col={worldCol}
        />
      );
    }
  }

  return (
    <div className={`board-container${showDpad ? '' : ' collapsed'}`}>
      <div className="board" data-testid="board">
        {tiles}
      </div>
      <button
        type="button"
        className="dpad-toggle"
        onClick={() => setShowDpad(prev => !prev)}
        aria-label="toggle dpad"
      >
        {showDpad ? 'Hide D-pad' : 'Show D-pad'}
      </button>
      {showDpad && (
        <div className="dpad">
          <button onClick={moveUp} aria-label="up">↑</button>
          <div className="middle-row">
            <button onClick={moveLeft} aria-label="left">←</button>
            <button onClick={moveRight} aria-label="right">→</button>
          </div>
          <button onClick={moveDown} aria-label="down">↓</button>
        </div>
      )}
    </div>
  );
}

export default Board;
