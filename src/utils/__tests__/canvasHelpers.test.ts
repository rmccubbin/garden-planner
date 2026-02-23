import { screenToGrid, isPlacementValid } from '../canvasHelpers';
import type { GridConfig, ViewTransform } from '../../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../../types/plants';

const grid: GridConfig = { cellSize: 40, cols: 10, rows: 10 };
const identity: ViewTransform = { panX: 0, panY: 0, zoom: 1 };

describe('screenToGrid', () => {
  it('returns (0,0) for screen origin with identity transform', () => {
    expect(screenToGrid(0, 0, identity, grid)).toEqual({ col: 0, row: 0 });
  });

  it('returns correct cell for a mid-cell screen position', () => {
    // screen (50, 90) → world (50, 90) → col 1, row 2
    expect(screenToGrid(50, 90, identity, grid)).toEqual({ col: 1, row: 2 });
  });

  it('accounts for pan offset', () => {
    const panned: ViewTransform = { panX: 40, panY: 0, zoom: 1 };
    // screen (0,0) → world (-40, 0) → col -1, row 0
    expect(screenToGrid(0, 0, panned, grid)).toEqual({ col: -1, row: 0 });
  });

  it('accounts for zoom', () => {
    const zoomed: ViewTransform = { panX: 0, panY: 0, zoom: 2 };
    // screen (80, 80) → world (40, 40) → col 1, row 1
    expect(screenToGrid(80, 80, zoomed, grid)).toEqual({ col: 1, row: 1 });
  });
});

function makeDef(id: string, spacingCells: number): PlantDefinition {
  return {
    id,
    name: id,
    otherNames: [],
    category: 'vegetable',
    emoji: '🍅',
    color: '#ff0000',
    spacingCells,
    lightRequirement: 'full-sun',
    catSafe: true,
  };
}

describe('isPlacementValid', () => {
  const plantDefs = [makeDef('tomato', 2)];
  const placed: PlacedPlant[] = [{ instanceId: 'a', plantId: 'tomato', col: 3, row: 3 }];

  it('returns true for valid placement in empty grid', () => {
    expect(isPlacementValid(0, 0, 1, [], plantDefs, grid)).toBe(true);
  });

  it('returns false for negative col', () => {
    expect(isPlacementValid(-1, 0, 1, [], plantDefs, grid)).toBe(false);
  });

  it('returns false for negative row', () => {
    expect(isPlacementValid(0, -1, 1, [], plantDefs, grid)).toBe(false);
  });

  it('returns false when placement exceeds grid cols', () => {
    expect(isPlacementValid(9, 0, 2, [], plantDefs, grid)).toBe(false);
  });

  it('returns false when placement exceeds grid rows', () => {
    expect(isPlacementValid(0, 9, 2, [], plantDefs, grid)).toBe(false);
  });

  it('returns false when directly overlapping an existing plant', () => {
    expect(isPlacementValid(3, 3, 1, placed, plantDefs, grid)).toBe(false);
  });

  it('returns false when partially overlapping (inside footprint)', () => {
    // Tomato occupies cols 3-4, rows 3-4. Placing at (4,4) is still inside.
    expect(isPlacementValid(4, 4, 1, placed, plantDefs, grid)).toBe(false);
  });

  it('returns true when placed adjacent but not overlapping', () => {
    // Tomato ends at col 5. Placing size-1 at (5,3) is just outside.
    expect(isPlacementValid(5, 3, 1, placed, plantDefs, grid)).toBe(true);
  });
});
