import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { drawGrid } from '../utils/drawGrid';
import { drawPlants } from '../utils/drawPlants';
import type { GridConfig, ViewTransform } from '../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../types/plants';

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  viewTransform: ViewTransform,
  gridConfig: GridConfig,
  placedPlants: PlacedPlant[],
  plantDefs: PlantDefinition[],
  selectedPlant: PlantDefinition | null,
  previewCell: { col: number; row: number } | null,
): void {
  const [, setSize] = useState({ width: 0, height: 0 });

  // Force re-render when the canvas is resized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      setSize({ width: canvas.clientWidth, height: canvas.clientHeight });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);

  // Draw everything on every relevant state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);
    ctx.scale(dpr, dpr);

    drawGrid(ctx, displayWidth, displayHeight, gridConfig, viewTransform);
    drawPlants(ctx, placedPlants, plantDefs, gridConfig, viewTransform, displayWidth, displayHeight);

    // Ghost preview for the currently selected plant
    if (selectedPlant && previewCell) {
      const { panX, panY, zoom } = viewTransform;
      const { cellSize } = gridConfig;
      const x = previewCell.col * cellSize;
      const y = previewCell.row * cellSize;
      const w = selectedPlant.spacingCells * cellSize;
      const h = selectedPlant.spacingCells * cellSize;

      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      const radius = Math.min(6 / zoom, w * 0.2);

      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fillStyle = selectedPlant.color;
      ctx.fill();

      ctx.globalAlpha = 0.6;
      const fontSize = Math.min(w, h) * 0.55;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillText(selectedPlant.emoji, x + w / 2, y + h / 2);

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }, [canvasRef, viewTransform, gridConfig, placedPlants, plantDefs, selectedPlant, previewCell]);
}
