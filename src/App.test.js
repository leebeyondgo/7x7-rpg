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
