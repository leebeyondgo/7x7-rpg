export default async function loadWorld() {
  const res = await fetch(process.env.PUBLIC_URL + '/maps/world.csv');
  const text = await res.text();
  return text.trim().split('\n').map(row => row.split(','));
}
