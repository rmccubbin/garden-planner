import type { GridConfig, ViewTransform } from '../types/canvas';

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gridConfig: GridConfig,
  viewTransform: ViewTransform,
): void {
  const { cellSize, cols, rows } = gridConfig;
  const { panX, panY, zoom } = viewTransform;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Compute which cells are visible to avoid drawing off-screen lines
  const worldLeft = -panX / zoom;
  const worldTop = -panY / zoom;
  const worldRight = worldLeft + canvasWidth / zoom;
  const worldBottom = worldTop + canvasHeight / zoom;

  const firstCol = Math.max(0, Math.floor(worldLeft / cellSize));
  const lastCol = Math.min(cols, Math.ceil(worldRight / cellSize));
  const firstRow = Math.max(0, Math.floor(worldTop / cellSize));
  const lastRow = Math.min(rows, Math.ceil(worldBottom / cellSize));

  // Nothing to draw if the grid is entirely off-screen
  if (firstCol >= lastCol || firstRow >= lastRow) return;

  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  // Garden background fill
  ctx.fillStyle = '#f0f7ee';
  ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

  // Grid lines — 1 physical pixel regardless of zoom
  ctx.beginPath();
  ctx.lineWidth = 1 / zoom;
  ctx.strokeStyle = '#c8dfc4';

  for (let col = firstCol; col <= lastCol; col++) {
    const x = col * cellSize;
    ctx.moveTo(x, firstRow * cellSize);
    ctx.lineTo(x, lastRow * cellSize);
  }

  for (let row = firstRow; row <= lastRow; row++) {
    const y = row * cellSize;
    ctx.moveTo(firstCol * cellSize, y);
    ctx.lineTo(lastCol * cellSize, y);
  }

  ctx.stroke();

  // Outer garden border
  ctx.beginPath();
  ctx.lineWidth = 2 / zoom;
  ctx.strokeStyle = '#5a8a52';
  ctx.strokeRect(0, 0, cols * cellSize, rows * cellSize);

  ctx.restore();
}
