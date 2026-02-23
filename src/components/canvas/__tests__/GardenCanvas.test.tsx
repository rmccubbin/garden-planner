import { render, screen } from '@testing-library/react';
import { GardenCanvas } from '../GardenCanvas';
import type { GridConfig } from '../../../types/canvas';
import { PLANTS } from '../../../data/plants';

beforeEach(() => {
  jest.clearAllMocks();
});

const defaultGrid: GridConfig = { cellSize: 40, cols: 20, rows: 20 };
const noop = () => {};

describe('GardenCanvas', () => {
  it('renders a canvas element', () => {
    render(
      <GardenCanvas
        gridConfig={defaultGrid}
        placedPlants={[]}
        plantDefs={PLANTS}
        selectedPlant={null}
        onPlantPlace={noop}
      />,
    );
    expect(screen.getByTestId('garden-canvas')).toBeInTheDocument();
  });

  it('does not throw with default config', () => {
    expect(() =>
      render(
        <GardenCanvas
          gridConfig={defaultGrid}
          placedPlants={[]}
          plantDefs={PLANTS}
          selectedPlant={null}
          onPlantPlace={noop}
        />,
      ),
    ).not.toThrow();
  });
});
