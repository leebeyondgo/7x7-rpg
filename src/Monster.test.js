import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';
import { GameProvider } from './GameContext';

// 몬스터가 보드에 표시되는지 확인
test('monster appears on the board', () => {
  render(
    <GameProvider>
      <Board />
    </GameProvider>
  );
  const monsterTiles = screen.getAllByRole('presentation').filter(tile =>
    tile.classList.contains('monster')
  );
  expect(monsterTiles.length).toBeGreaterThan(0);
});

// 몬스터 위로 이동하면 체력이 감소한다
test('colliding with monster decreases player HP', () => {
  render(
    <GameProvider>
      <Board />
    </GameProvider>
  );
  const status = screen.getByTestId('status');
  expect(status).toHaveTextContent('HP: 100');

  fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });

  expect(status).toHaveTextContent('HP: 99');
});
