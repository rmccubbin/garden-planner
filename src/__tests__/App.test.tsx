import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the garden canvas', () => {
    render(<App />);
    expect(screen.getByTestId('garden-canvas')).toBeInTheDocument();
  });
});
