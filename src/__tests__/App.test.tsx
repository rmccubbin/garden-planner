import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the garden planner heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /garden planner/i })).toBeInTheDocument();
  });
});
