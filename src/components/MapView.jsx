import React, { useRef, useEffect } from 'react';
import './MapView.css';
import tileColors from '../utils/tileColors';


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
  const tileSize = 16;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const rowData = world[r] || [];
        const tileType = rowData[c] || 'floor';
        ctx.fillStyle = tileColors[tileType] || tileColors.floor;
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }

    ctx.fillStyle = '#f44336';
    ctx.fillRect(
      worldPosition.col * tileSize + 4,
      worldPosition.row * tileSize + 4,
      tileSize - 8,
      tileSize - 8,
    );

    ctx.fillStyle = '#2196f3';
    monsters.forEach((m) => {
      ctx.fillRect(m.col * tileSize + 4, m.row * tileSize + 4, tileSize - 8, tileSize - 8);
    });
  }, [world, worldPosition, monsters, rows, cols]);

  const grid = <canvas ref={canvasRef} className="map-canvas" />;

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
