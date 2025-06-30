const fs = require('fs');
const W = 200;
const H = 200;

const geo = JSON.parse(fs.readFileSync('public/maps/oceania.geojson', 'utf8'));
const rawPolygons = [];
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
for (const feature of geo.features) {
  for (const poly of feature.geometry.coordinates) {
    rawPolygons.push(poly);
    for (const [x, y] of poly) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const scale = Math.min(W / (maxX - minX), H / (maxY - minY));
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const polygons = rawPolygons.map((poly) => poly
  .map(([x, y]) => [
    (x - cx) * scale + W / 2,
    (y - cy) * scale + H / 2,
  ]));

function pointInPoly(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    const intersect = (yi > y) !== (yj > y) &&
      x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function rand(x, y) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const rows = [];
for (let y = 0; y < H; y++) {
  const row = [];
  for (let x = 0; x < W; x++) {
    const inside = polygons.some(p => pointInPoly(p, x, y));
    if (inside) {
      const d = rand(x, y);
      row.push(d < 0.5 ? 'forest' : 'grassland');
    } else {
      row.push('ocean');
    }
  }
  rows.push(row.join(','));
}

fs.writeFileSync('public/maps/world.csv', rows.join('\n') + '\n');
