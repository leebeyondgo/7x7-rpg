import React from 'react';
import level1 from '../maps/level1';
import './MapView.css';

const tileColors = {
  floor: '#8bc34a',
  wall: '#9e9e9e',
  water: '#42a5f5',
  special: '#ffd700',
};

function MapView({ onClose, worldPosition, monsters }) {
  const tiles = [];
  for (let r = 0; r < level1.length; r += 1) {
    for (let c = 0; c < level1[r].length; c += 1) {
      const isHero = r === worldPosition.row && c === worldPosition.col;
      const isMonster = monsters.some((m) => m.row === r && m.col === c);
      const tileType = level1[r][c] || 'floor';
      tiles.push(
        <div
          key={`${r}-${c}`}
          className={`map-tile${isHero ? ' hero' : isMonster ? ' monster' : ''}`}
          style={{ backgroundColor: tileColors[tileType] || tileColors.floor }}
        />
      );
    }
  }

  return (
    <div className="mapview-overlay" role="dialog">
      <div className="mapview">
        <div className="map-grid">{tiles}</div>
        <button type="button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default MapView;
