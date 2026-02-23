import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { drawGrid } from '../utils/drawGrid';
import type { GridConfig, ViewTransform } from '../types/canvas';

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  viewTransform: ViewTransform,
  gridConfig: GridConfig,
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

  // Draw the grid on every relevant state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Resize backing store to physical pixels (resets context state)
    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    // Scale so all drawing coordinates are in CSS pixels
    ctx.scale(dpr, dpr);

    drawGrid(ctx, displayWidth, displayHeight, gridConfig, viewTransform);
  }, [canvasRef, viewTransform, gridConfig]);
}
