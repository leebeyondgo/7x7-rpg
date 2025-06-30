import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import './Board.css';
import MenuPanel from './components/MenuPanel';
import Monster from './entities/Monster';
import { GameContext } from './GameContext';
import loadWorld from './maps/loadWorld';
import stepSfx from './assets/sounds/step.mp3';


const tileColors = {
  floor: '#8bc34a',  // 초원
  wall: '#9e9e9e',   // 벽
  water: '#42a5f5',  // 바다
  special: '#ffd700', // 특별 지형
  desert: '#e0c070',
  ice: '#a0e0ff',
  forest: '#228b22',
  ocean: '#1e90ff',
  jungle: '#006400',
  grassland: '#7cfc00'
};

const BOARD_SIZE = 7;
const CENTER = Math.floor(BOARD_SIZE / 2);

const INITIAL_ITEMS = {
  '0,1': { name: 'Potion', type: 'heal', amount: 20 },
  '1,0': { name: 'Gold Pouch', type: 'gold', amount: 10 },
};

function Board() {
  const stepAudioRef = useRef(null);
  const [world, setWorld] = useState(null);
  const [showDpad, setShowDpad] = useState(true);
  // 전역 맵에서의 좌표를 관리한다
  const [worldPosition, setWorldPosition] = useState({ row: 0, col: 0 });
  const [monsters, setMonsters] = useState([
    new Monster(0, 1),
    new Monster(-1, -1),
  ]);

  const {
    consumeTurn,
    setHealth,
    setGold,
  } = useContext(GameContext);
  const [itemsOnMap, setItemsOnMap] = useState(INITIAL_ITEMS);
  const [inventory, setInventory] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

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
    if (!world) return;
    const rows = world.length;
    const cols = world[0].length;
    const newPos = {
      row: (worldPosition.row + dRow + rows) % rows,
      col: (worldPosition.col + dCol + cols) % cols,
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
  }, [world, worldPosition, monsters, handleCombat, moveMonsterAI, consumeTurn]);

  useEffect(() => {
    stepAudioRef.current = new Audio(stepSfx);
  }, []);

  useEffect(() => {
    loadWorld().then(setWorld);
  }, []);


  const moveUp = useCallback(() => move(-1, 0), [move]);
  const moveDown = useCallback(() => move(1, 0), [move]);
  const moveLeft = useCallback(() => move(0, -1), [move]);
  const moveRight = useCallback(() => move(0, 1), [move]);
  const handleAction = useCallback(() => {
    setShowMenu(true);
  }, [setShowMenu]);

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
    setItemsOnMap(prev => {
      const found = prev[key];
      if (found) {
        setInventory(inv => [...inv, found]);
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return prev;
    });
  }, [worldPosition]);

  const useItem = useCallback((index) => {
    setInventory((inv) => {
      const item = inv[index];
      if (!item) return inv;
      if (item.type === 'gold') {
        setGold(g => g + item.amount);
      } else if (item.type === 'heal') {
        setHealth(h => Math.min(h + item.amount, 100));
      }
      return inv.filter((_, i) => i !== index);
    });
  }, [setGold, setHealth]);

  if (!world) {
    return <div>Loading...</div>;
  }

  const rows = world.length;
  const cols = world[0].length;

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
      const hasItem = Boolean(itemsOnMap[`${worldRow},${worldCol}`]);
      const tileType = world[(worldRow + rows) % rows][(worldCol + cols) % cols];
      tiles.push(
        <div
          key={`${worldRow}-${worldCol}`}
          className={`tile${isHero ? ' hero' : isMonster ? ' monster' : ''}${hasItem ? ' item' : ''}`}
          role="presentation"
          data-row={worldRow}
          data-col={worldCol}
          style={{ backgroundColor: tileColors[tileType] || tileColors.floor }}
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
        className="dpad-toggle btn"
        onClick={() => setShowDpad(prev => !prev)}
        aria-label="toggle dpad"
      >
        {showDpad ? 'Hide D-pad' : 'Show D-pad'}
      </button>
      {showDpad && (
        <div className="dpad">
          <button className="up btn" onClick={moveUp} aria-label="up">↑</button>
          <button className="left btn" onClick={moveLeft} aria-label="left">←</button>
          <button className="action btn" onClick={handleAction} aria-label="action">●</button>
          <button className="right btn" onClick={moveRight} aria-label="right">→</button>
          <button className="down btn" onClick={moveDown} aria-label="down">↓</button>
        </div>
      )}
      <button
        type="button"
        className="menu-button btn"
        onClick={() => setShowMenu(true)}
      >
        Menu
      </button>
      {showMenu && (
        <MenuPanel
          inventory={inventory}
          onUseItem={useItem}
          onClose={() => setShowMenu(false)}
          world={world}
          worldPosition={worldPosition}
          monsters={monsters}
          dimensions={{ rows: world.length, cols: world[0].length }}
        />
      )}
    </div>
  );
}

export default Board;
