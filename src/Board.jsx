import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import './Board.css';
import Inventory from './components/Inventory';
import Monster from './entities/Monster';
import { GameContext } from './GameContext';
import level1 from './maps/level1';
import floorImg from './assets/environment/visual_grid.png';
import wallImg from './assets/environment/wall_blocking.png';
import waterImg from './assets/environment/water0.png';
import stepSfx from './assets/sounds/step.mp3';

const tileImages = {
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
  const stepAudioRef = useRef(null);
  const [showDpad, setShowDpad] = useState(true);
  // 전역 맵에서의 좌표를 관리한다
  const [worldPosition, setWorldPosition] = useState({ row: 0, col: 0 });
  const [monsters, setMonsters] = useState([
    new Monster(0, 1),
    new Monster(-1, -1),
  ]);

  const {
    consumeTurn,
    health,
    setHealth,
    gold,
    setGold,
  } = useContext(GameContext);
  const [itemsOnMap, setItemsOnMap] = useState(INITIAL_ITEMS);
  const [inventory, setInventory] = useState([]);

  const handleCombat = useCallback((playerPos, list) => list
    .map((m) => {
      if (m.row === playerPos.row && m.col === playerPos.col) {
        setHealth((h) => Math.max(h - 1, 0));
        const hp = m.hp - 1;
        if (hp <= 0) return null;
        return new Monster(m.row, m.col, hp);
      }
      return m;
    })
    .filter(Boolean), [setHealth]);

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

    if (stepAudioRef.current) {
      stepAudioRef.current.currentTime = 0;
      stepAudioRef.current.play();
    }
    consumeTurn();
  }, [worldPosition, monsters, handleCombat, moveMonsterAI, consumeTurn]);

  useEffect(() => {
    stepAudioRef.current = new Audio(stepSfx);
  }, []);


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
    setInventory((inv) => {
      const item = inv[index];
      if (!item) return inv;
      if (item.type === 'gold') {
        setResources(res => ({ ...res, gold: res.gold + item.amount }));
        if (setGold) setGold(g => g + item.amount);
      } else if (item.type === 'heal') {
        setResources(res => ({
          ...res,
          hp: Math.min(res.hp + item.amount, 100),
        }));
        if (setHealth) setHealth(h => Math.min(h + item.amount, 100));
      }
      return inv.filter((_, i) => i !== index);
    });
  }, [setGold, setHealth]);

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
      const rowData = level1[worldRow];
      const tileType = rowData && rowData[worldCol] ? rowData[worldCol] : 'floor';
      const bg = tileImages[tileType] || floorImg;
      tiles.push(
        <div
          key={`${worldRow}-${worldCol}`}
          className={`tile${isHero ? ' hero' : isMonster ? ' monster' : ''}`}
          role="presentation"
          data-row={worldRow}
          data-col={worldCol}
          style={{ backgroundImage: `url(${bg})` }}
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
      <div className="resources">HP: {health} Gold: {gold}</div>
      <Inventory items={inventory} onUse={useItem} />
    </div>
  );
}

export default Board;
