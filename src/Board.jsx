import React, { useState, useEffect, useCallback, useContext } from 'react';
import './Board.css';
import Inventory from './components/Inventory';
import { GameContext } from './GameContext';
import level1 from './maps/level1';
import floorImg from './assets/environment/visual_grid.png';
import wallImg from './assets/environment/wall_blocking.png';
import waterImg from './assets/environment/water0.png';

  floor: floorImg,
  wall: wallImg,
  water: waterImg,
};

const BOARD_SIZE = 7;
const CENTER = Math.floor(BOARD_SIZE / 2);

const INITIAL_ITEMS = {
  '0,1': { name: 'Potion', type: 'heal', amount: 20 },
  '1,0': { name: 'Gold Pouch', type: 'gold', amount: 10 },
};

function Board() {
  const [showDpad, setShowDpad] = useState(true);
  // 전역 맵에서의 좌표를 관리한다
  const [worldPosition, setWorldPosition] = useState({ row: 0, col: 0 });
  const [itemsOnMap, setItemsOnMap] = useState(INITIAL_ITEMS);
  const [inventory, setInventory] = useState([]);
  const [resources, setResources] = useState({ hp: 100, gold: 0 });
  const { consumeTurn } = useContext(GameContext);

  const move = useCallback((dRow, dCol) => {
    // 보드 내 위치가 아닌 전역 위치를 이동시킨다
    setWorldPosition(pos => ({
      row: pos.row + dRow,
      col: pos.col + dCol,
    }));
    consumeTurn();
  }, [consumeTurn]);

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

  // 이동 후 아이템 획득 여부 체크
  useEffect(() => {
    const key = `${worldPosition.row},${worldPosition.col}`;
    const found = itemsOnMap[key];
    if (found) {
      setInventory(inv => [...inv, found]);
      setItemsOnMap(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  }, [worldPosition, itemsOnMap]);

  const useItem = useCallback((index) => {
    setInventory(inv => {
      const item = inv[index];
      if (!item) return inv;
      if (item.type === 'gold') {
        setResources(res => ({ ...res, gold: res.gold + item.amount }));
      } else if (item.type === 'heal') {
        setResources(res => ({
          ...res,
          hp: Math.min(res.hp + item.amount, 100),
        }));
      }
      return inv.filter((_, i) => i !== index);
    });
  }, []);

  const tiles = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // 현재 보드 타일이 전역 맵에서 어떤 위치에 해당하는지 계산
      const worldRow = worldPosition.row + (r - CENTER);
      const worldCol = worldPosition.col + (c - CENTER);
      const isHero = r === CENTER && c === CENTER;
      const rowData = level1[worldRow];
      const tileType = rowData && rowData[worldCol] ? rowData[worldCol] : 'floor';
      const bg = tileImages[tileType] || floorImg;
      tiles.push(
        <div
          key={`${worldRow}-${worldCol}`}
          className={`tile${isHero ? ' hero' : ''}`}
          role="presentation"
          data-row={worldRow}
          data-col={worldCol}
          style={{ backgroundImage: `url(${bg})` }}
        />
      );
    }
  }

  return (
    <div>
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
      <div className="resources">HP: {resources.hp} Gold: {resources.gold}</div>
      <Inventory items={inventory} onUse={useItem} />
    </div>
  );
}

export default Board;
