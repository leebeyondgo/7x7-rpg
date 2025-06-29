import React from 'react';
import openWorld from '../maps/openWorld';
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
};

function MapView({ onClose, worldPosition, monsters }) {
  const tiles = [];
  for (let r = 0; r < openWorld.length; r += 1) {
    for (let c = 0; c < openWorld[r].length; c += 1) {
      const isHero = r === worldPosition.row && c === worldPosition.col;
      const isMonster = monsters.some((m) => m.row === r && m.col === c);
      const tileType = openWorld[r][c] || 'floor';
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
