const fs = require('fs');
const W = 400;
const H = 400;
const centerX = W / 2;
const centerY = H / 2;
const radius = 150;
function rand(x, y) {
  let seed = x * 374761393 + y * 668265263;
  seed = (seed ^ (seed >> 13)) * 1274126177;
  seed = (seed ^ (seed >> 16)) >>> 0;
  return seed / 4294967295;
}
const rows = [];
for (let y = 0; y < H; y++) {
  const row = [];
  for (let x = 0; x < W; x++) {
    const dx = (x - centerX) / radius;
    const dy = (y - centerY) / radius;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const noise = rand(x, y) * 0.2 - 0.1; // [-0.1, 0.1]
    if (dist + noise <= 1) {
      const d = rand(x * 2, y * 2);
      if (d < 0.33) row.push('forest');
      else if (d < 0.66) row.push('grassland');
      else row.push('desert');
    } else {
      row.push('ocean');
    }
  }
  rows.push(row.join(','));
}
fs.writeFileSync('public/maps/world.csv', rows.join('\n') + '\n');
