import React, { useState, useEffect, useCallback } from 'react';
import './Board.css';
import Monster from './entities/Monster';

const BOARD_SIZE = 7;
const CENTER = Math.floor(BOARD_SIZE / 2);

function Board() {
  const [showDpad, setShowDpad] = useState(true);
  // 전역 맵에서의 좌표를 관리한다
  const [worldPosition, setWorldPosition] = useState({ row: 0, col: 0 });
  const [playerHealth, setPlayerHealth] = useState(10);
  const [monsters, setMonsters] = useState([
    new Monster(0, 1),
    new Monster(-1, -1),
  ]);

  const handleCombat = useCallback((playerPos, list) => list
    .map((m) => {
      if (m.row === playerPos.row && m.col === playerPos.col) {
        setPlayerHealth((h) => h - 1);
        const hp = m.hp - 1;
        if (hp <= 0) return null;
        return new Monster(m.row, m.col, hp);
      }
      return m;
    })
    .filter(Boolean), [setPlayerHealth]);

  const moveMonsterAI = useCallback((list) => list.map((m) => {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0, 0]];
    const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
    return new Monster(m.row + dr, m.col + dc, m.hp);
  }), []);

  const move = useCallback((dRow, dCol) => {
    const newPos = {
      row: worldPosition.row + dRow,
      col: worldPosition.col + dCol,
    };

    let updated = handleCombat(newPos, monsters);
    updated = moveMonsterAI(updated);
    updated = handleCombat(newPos, updated);

    setWorldPosition(newPos);
    setMonsters(updated);
  }, [worldPosition, monsters, handleCombat, moveMonsterAI]);

  const moveUp = useCallback(() => move(-1, 0), [move]);
  const moveDown = useCallback(() => move(1, 0), [move]);
  const moveLeft = useCallback(() => move(0, -1), [move]);
  const moveRight = useCallback(() => move(0, 1), [move]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
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
  }, [moveUp, moveDown, moveLeft, moveRight]);

  const tiles = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // 현재 보드 타일이 전역 맵에서 어떤 위치에 해당하는지 계산
      const worldRow = worldPosition.row + (r - CENTER);
      const worldCol = worldPosition.col + (c - CENTER);
      const isHero = r === CENTER && c === CENTER;
      const isMonster = monsters.some(
        (m) => m.row === worldRow && m.col === worldCol,
      );
      tiles.push(
        <div
          key={`${worldRow}-${worldCol}`}
          className={`tile${isHero ? ' hero' : isMonster ? ' monster' : ''}`}
          role="presentation"
          data-row={worldRow}
          data-col={worldCol}
        />
      );
    }
  }

  return (
    <div className={`board-container${showDpad ? '' : ' collapsed'}`}>
      <div className="status" data-testid="status">HP: {playerHealth}</div>
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
