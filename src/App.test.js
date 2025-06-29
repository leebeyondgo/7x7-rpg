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

test('clicking D-pad button moves world position while hero stays centered', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  const centerIndex = Math.floor(board.children.length / 2);
  const centerTile = board.children[centerIndex];
  expect(centerTile).toHaveClass('hero');
  const startRow = Number(centerTile.getAttribute('data-row'));
  const startCol = Number(centerTile.getAttribute('data-col'));

  const rightButton = screen.getByRole('button', { name: /right/i });
  fireEvent.click(rightButton);

  const boardAfter = screen.getByTestId('board');
  const centerTileAfter = boardAfter.children[centerIndex];
  expect(centerTileAfter).toHaveClass('hero');
  expect(boardAfter.querySelectorAll('.hero')).toHaveLength(1);
  const endRow = Number(centerTileAfter.getAttribute('data-row'));
  const endCol = Number(centerTileAfter.getAttribute('data-col'));
  expect(endRow).toBe(startRow);
  expect(endCol).toBe(startCol + 1);
});

test('D-pad can be toggled on small screens', () => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query.includes('(max-width: 600px)'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  const { container } = render(<App />);

  const toggle = screen.getByRole('button', { name: /hide d-pad/i });
  expect(toggle).toBeInTheDocument();
  expect(container.querySelector('.dpad')).toBeInTheDocument();

  fireEvent.click(toggle);
  expect(container.querySelector('.dpad')).not.toBeInTheDocument();

  fireEvent.click(toggle);
  expect(container.querySelector('.dpad')).toBeInTheDocument();
});

test('status bar displays resource values', () => {
  render(<App />);
  const status = screen.getByTestId('status-bar');
  expect(status).toHaveTextContent(/HP:/i);
  expect(status).toHaveTextContent(/Food:/i);
  expect(status).toHaveTextContent(/Gold:/i);
  expect(status).toHaveTextContent(/Turn:/i);
});

test('using inventory item updates context and status bar', () => {
  render(<App />);
  const status = screen.getByTestId('status-bar');
  expect(status).toHaveTextContent('Gold: 0');

  fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });

  const useButton = screen.getByRole('button', { name: /use/i });
  fireEvent.click(useButton);

  expect(status).toHaveTextContent('Gold: 10');
});

test('column index wraps to 0 when moving right past the edge', async () => {
  render(<App />);
  const board = await screen.findByTestId('board');
  const centerIndex = Math.floor(board.children.length / 2);

  for (let i = 0; i < 9; i += 1) {
    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
  }

  let centerTile = screen.getByTestId('board').children[centerIndex];
  expect(Number(centerTile.getAttribute('data-col'))).toBe(9);

  fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });

  centerTile = screen.getByTestId('board').children[centerIndex];
  expect(Number(centerTile.getAttribute('data-col'))).toBe(0);
});
