import { drawGrid } from '../drawGrid';
import type { GridConfig, ViewTransform } from '../../types/canvas';

function makeMockCtx(): jest.Mocked<Pick<
  CanvasRenderingContext2D,
  | 'clearRect' | 'fillRect' | 'strokeRect' | 'beginPath'
  | 'moveTo' | 'lineTo' | 'stroke' | 'save' | 'restore'
  | 'translate' | 'scale' | 'fillStyle' | 'strokeStyle' | 'lineWidth'
>> {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  };
}

const defaultGrid: GridConfig = { cellSize: 10, cols: 3, rows: 2 };
const identityTransform: ViewTransform = { panX: 0, panY: 0, zoom: 1 };

describe('drawGrid', () => {
  it('clears the canvas once', () => {
    const ctx = makeMockCtx();
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, identityTransform);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 200, 200);
  });

  it('balances save and restore calls', () => {
    const ctx = makeMockCtx();
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, identityTransform);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('calls stroke at least once', () => {
    const ctx = makeMockCtx();
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, identityTransform);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('draws the correct number of grid lines for a 3x2 grid', () => {
    const ctx = makeMockCtx();
    // 3 cols → 4 vertical lines (col 0..3), 2 rows → 3 horizontal lines (row 0..2) = 7 total
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, identityTransform);
    expect(ctx.moveTo).toHaveBeenCalledTimes(7);
    expect(ctx.lineTo).toHaveBeenCalledTimes(7);
  });

  it('draws zero lines when the grid is fully off-screen', () => {
    const ctx = makeMockCtx();
    // Pan the grid far off to the right so nothing is visible in a 200x200 viewport
    const offScreenTransform: ViewTransform = { panX: 10000, panY: 0, zoom: 1 };
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, offScreenTransform);
    expect(ctx.moveTo).not.toHaveBeenCalled();
  });

  it('applies the zoom via ctx.scale', () => {
    const ctx = makeMockCtx();
    const zoomedTransform: ViewTransform = { panX: 0, panY: 0, zoom: 2 };
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, zoomedTransform);
    expect(ctx.scale).toHaveBeenCalledWith(2, 2);
  });

  it('applies the pan via ctx.translate', () => {
    const ctx = makeMockCtx();
    const pannedTransform: ViewTransform = { panX: 50, panY: 30, zoom: 1 };
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 200, 200, defaultGrid, pannedTransform);
    expect(ctx.translate).toHaveBeenCalledWith(50, 30);
  });
});
