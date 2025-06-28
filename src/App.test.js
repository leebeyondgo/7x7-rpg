import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders 7x7 board', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  expect(board.children).toHaveLength(49);
});

test('hero stays centered after arrow key press', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  const centerIndex = Math.floor(board.children.length / 2);
  const centerTile = board.children[centerIndex];
  expect(centerTile).toHaveClass('hero');

  fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });

  const centerTileAfter = board.children[centerIndex];
  expect(centerTileAfter).toHaveClass('hero');
  expect(board.querySelectorAll('.hero')).toHaveLength(1);
});
