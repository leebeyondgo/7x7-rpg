import { render, screen } from '@testing-library/react';
import App from './App';

test('renders 7x7 board', () => {
  render(<App />);
  const board = screen.getByTestId('board');
  expect(board.children).toHaveLength(49);
});
