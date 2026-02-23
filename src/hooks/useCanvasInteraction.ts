import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ViewTransform } from '../types/canvas';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface DragState {
  startX: number;
  startY: number;
  originPanX: number;
  originPanY: number;
}

export function useCanvasInteraction(
  canvasRef: RefObject<HTMLCanvasElement | null>,
): { viewTransform: ViewTransform } {
  const [viewTransform, setViewTransform] = useState<ViewTransform>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });

  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new AbortController();
    const { signal } = controller;

    function handleMouseDown(e: MouseEvent): void {
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originPanX: viewTransform.panX,
        originPanY: viewTransform.panY,
      };
    }

    function handleMouseMove(e: MouseEvent): void {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const { originPanX, originPanY } = dragRef.current;
      setViewTransform((prev) => ({ ...prev, panX: originPanX + dx, panY: originPanY + dy }));
    }

    function handleMouseUp(): void {
      dragRef.current = null;
    }

    function handleWheel(e: WheelEvent): void {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const rect = canvas!.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setViewTransform((prev) => {
        const newZoom = clamp(prev.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);
        const scale = newZoom / prev.zoom;
        return {
          zoom: newZoom,
          panX: cursorX - (cursorX - prev.panX) * scale,
          panY: cursorY - (cursorY - prev.panY) * scale,
        };
      });
    }

    canvas.addEventListener('mousedown', handleMouseDown, { signal });
    window.addEventListener('mousemove', handleMouseMove, { signal });
    window.addEventListener('mouseup', handleMouseUp, { signal });
    // Must be non-passive to call preventDefault and block page scroll
    canvas.addEventListener('wheel', handleWheel, { passive: false, signal } as AddEventListenerOptions);

    return () => controller.abort();
  }, [canvasRef, viewTransform.panX, viewTransform.panY]);

  return { viewTransform };
}
