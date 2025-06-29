import React from 'react';
import './MapView.css';

const tileColors = {
  floor: '#8bc34a',
  wall: '#9e9e9e',
  water: '#42a5f5',
  special: '#ffd700',
  desert: '#e0c070',
  ice: '#a0e0ff',
  forest: '#228b22',
  ocean: '#1e90ff',
  jungle: '#006400',
  grassland: '#7cfc00',
};


function MapView({
  onClose,
  worldPosition,
  monsters,
  world,
  dimensions,
  inline = false,
}) {
  const rows = dimensions?.rows ?? world.length;
  const cols = dimensions?.cols ?? (world[0] ? world[0].length : 0);

  const tiles = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const isHero = r === worldPosition.row && c === worldPosition.col;
      const isMonster = monsters.some((m) => m.row === r && m.col === c);
      const rowData = world[r] || [];
      const tileType = rowData[c] || 'floor';
      tiles.push(
        <div
          key={`${r}-${c}`}
          className={`map-tile${isHero ? ' hero' : isMonster ? ' monster' : ''}`}
          style={{ backgroundColor: tileColors[tileType] || tileColors.floor }}
        />
      );
    }
  }

  const grid = (
    <div
      className="map-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 16px)`,
        gridTemplateRows: `repeat(${rows}, 16px)`,
      }}
    >
      {tiles}
    </div>
  );

  if (inline) {
    return <div className="mapview-inline">{grid}</div>;
  }

  return (
    <div className="mapview-overlay" role="dialog">
      <div className="mapview">
        {grid}
        <button type="button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default MapView;
