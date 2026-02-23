import { drawPlants } from '../drawPlants';
import type { GridConfig, ViewTransform } from '../../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../../types/plants';

function makeMockCtx() {
  return {
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    beginPath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    roundRect: jest.fn(),
    fillText: jest.fn(),
    fillStyle: '' as string,
    strokeStyle: '' as string,
    lineWidth: 1,
    font: '',
    textAlign: 'start' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    globalAlpha: 1,
  };
}

function makeDef(id: string, spacingCells: number): PlantDefinition {
  return {
    id,
    name: id,
    otherNames: [],
    category: 'vegetable',
    emoji: '🍅',
    color: '#e05c3a',
    spacingCells,
    lightRequirement: 'full-sun',
    catSafe: true,
  };
}

const grid: GridConfig = { cellSize: 40, cols: 10, rows: 10 };
const identity: ViewTransform = { panX: 0, panY: 0, zoom: 1 };
const defs = [makeDef('tomato', 2)];

describe('drawPlants', () => {
  it('does nothing (no save call) for empty placed array', () => {
    const ctx = makeMockCtx();
    drawPlants(ctx as unknown as CanvasRenderingContext2D, [], defs, grid, identity, 800, 600);
    expect(ctx.save).not.toHaveBeenCalled();
  });

  it('calls save and restore once for a non-empty array', () => {
    const ctx = makeMockCtx();
    const plants: PlacedPlant[] = [{ instanceId: 'x', plantId: 'tomato', col: 0, row: 0 }];
    drawPlants(ctx as unknown as CanvasRenderingContext2D, plants, defs, grid, identity, 800, 600);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('calls roundRect once per placed plant', () => {
    const ctx = makeMockCtx();
    const plants: PlacedPlant[] = [
      { instanceId: 'a', plantId: 'tomato', col: 0, row: 0 },
      { instanceId: 'b', plantId: 'tomato', col: 3, row: 3 },
    ];
    drawPlants(ctx as unknown as CanvasRenderingContext2D, plants, defs, grid, identity, 800, 600);
    expect(ctx.roundRect).toHaveBeenCalledTimes(2);
  });

  it('calls fillText once per placed plant for emoji', () => {
    const ctx = makeMockCtx();
    const plants: PlacedPlant[] = [{ instanceId: 'c', plantId: 'tomato', col: 0, row: 0 }];
    drawPlants(ctx as unknown as CanvasRenderingContext2D, plants, defs, grid, identity, 800, 600);
    expect(ctx.fillText).toHaveBeenCalledTimes(1);
    expect(ctx.fillText).toHaveBeenCalledWith('🍅', expect.any(Number), expect.any(Number));
  });

  it('skips plants with unknown plantId', () => {
    const ctx = makeMockCtx();
    const plants: PlacedPlant[] = [{ instanceId: 'd', plantId: 'unknown', col: 0, row: 0 }];
    drawPlants(ctx as unknown as CanvasRenderingContext2D, plants, defs, grid, identity, 800, 600);
    expect(ctx.roundRect).not.toHaveBeenCalled();
  });

  it('culls plants entirely off-screen to the left', () => {
    const ctx = makeMockCtx();
    // Plant at col 0 with panX far to the right — plant would be off-screen left
    const offScreen: ViewTransform = { panX: -5000, panY: 0, zoom: 1 };
    const plants: PlacedPlant[] = [{ instanceId: 'e', plantId: 'tomato', col: 0, row: 0 }];
    drawPlants(ctx as unknown as CanvasRenderingContext2D, plants, defs, grid, offScreen, 800, 600);
    expect(ctx.roundRect).not.toHaveBeenCalled();
  });
});
