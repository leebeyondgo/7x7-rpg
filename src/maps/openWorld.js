const terrains = ['desert', 'forest', 'ice', 'ocean'];

const openWorld = Array.from({ length: 20 }, (_, r) =>
  Array.from({ length: 20 }, (_, c) => terrains[(r + c) % terrains.length])
);

export default openWorld;
