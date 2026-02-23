import { render, screen } from '@testing-library/react';
import { GardenCanvas } from '../GardenCanvas';
import type { GridConfig } from '../../../types/canvas';

beforeEach(() => {
  jest.clearAllMocks();
});

const defaultGrid: GridConfig = { cellSize: 40, cols: 20, rows: 20 };

describe('GardenCanvas', () => {
  it('renders a canvas element', () => {
    render(<GardenCanvas gridConfig={defaultGrid} />);
    expect(screen.getByTestId('garden-canvas')).toBeInTheDocument();
  });

  it('does not throw with default config', () => {
    expect(() => render(<GardenCanvas gridConfig={defaultGrid} />)).not.toThrow();
  });
});
