import type { GridConfig, ViewTransform } from '../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../types/plants';

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function darken(hex: string): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
  return `rgb(${r},${g},${b})`;
}

export function drawPlants(
  ctx: CanvasRenderingContext2D,
  placedPlants: PlacedPlant[],
  plantDefs: PlantDefinition[],
  gridConfig: GridConfig,
  viewTransform: ViewTransform,
  canvasWidth: number,
  canvasHeight: number,
): void {
  if (placedPlants.length === 0) return;

  const { panX, panY, zoom } = viewTransform;
  const { cellSize } = gridConfig;

  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  for (const placed of placedPlants) {
    const def = plantDefs.find((d) => d.id === placed.plantId);
    if (!def) continue;

    const x = placed.col * cellSize;
    const y = placed.row * cellSize;
    const w = def.spacingCells * cellSize;
    const h = def.spacingCells * cellSize;

    // Viewport culling — skip if entirely outside canvas bounds
    const screenLeft = x * zoom + panX;
    const screenTop = y * zoom + panY;
    const screenRight = screenLeft + w * zoom;
    const screenBottom = screenTop + h * zoom;
    if (screenRight < 0 || screenLeft > canvasWidth || screenBottom < 0 || screenTop > canvasHeight) {
      continue;
    }

    const radius = Math.min(6 / zoom, w * 0.2);

    // Filled rounded rect
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = hexWithAlpha(def.color, 0.85);
    ctx.fill();

    // Border
    ctx.strokeStyle = darken(def.color);
    ctx.lineWidth = 1.5 / zoom;
    ctx.stroke();

    // Emoji centred
    const fontSize = Math.min(w, h) * 0.55;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillText(def.emoji, x + w / 2, y + h / 2);
  }

  ctx.restore();
}
