import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders 7x7 board', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  expect(board.children).toHaveLength(49);
});

test('arrow key moves world position while hero stays centered', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  const centerIndex = Math.floor(board.children.length / 2);
  const centerTile = board.children[centerIndex];
  expect(centerTile).toHaveClass('hero');
  const startRow = Number(centerTile.getAttribute('data-row'));
  const startCol = Number(centerTile.getAttribute('data-col'));

  fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });

  const boardAfter = screen.getByTestId('board');
  const centerTileAfter = boardAfter.children[centerIndex];
  expect(centerTileAfter).toHaveClass('hero');
  expect(boardAfter.querySelectorAll('.hero')).toHaveLength(1);
  const endRow = Number(centerTileAfter.getAttribute('data-row'));
  const endCol = Number(centerTileAfter.getAttribute('data-col'));
  expect(endRow).toBe(startRow);
  expect(endCol).toBe(startCol + 1);
});
