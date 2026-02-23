import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { GridConfig, ViewTransform } from '../types/canvas';
import type { PlantDefinition } from '../types/plants';
import { screenToGrid } from '../utils/canvasHelpers';

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
  hasDragged: boolean;
}

export interface InteractionOptions {
  selectedPlant: PlantDefinition | null;
  gridConfig: GridConfig;
  onPlantPlace: (col: number, row: number) => void;
  onPreviewMove: (col: number | null, row: number | null) => void;
}

export function useCanvasInteraction(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options?: InteractionOptions,
): { viewTransform: ViewTransform } {
  // Keep a ref that always holds the latest viewTransform so handlers
  // can call screenToGrid without stale closure values.
  const viewTransformRef = useRef<ViewTransform>({ panX: 0, panY: 0, zoom: 1 });
  const [viewTransform, _setViewTransform] = useState<ViewTransform>({ panX: 0, panY: 0, zoom: 1 });

  function setViewTransform(vt: ViewTransform | ((prev: ViewTransform) => ViewTransform)): void {
    const next = typeof vt === 'function' ? vt(viewTransformRef.current) : vt;
    viewTransformRef.current = next;
    _setViewTransform(next);
  }

  // Keep latest options accessible in event handlers without re-registering them.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
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
        originPanX: viewTransformRef.current.panX,
        originPanY: viewTransformRef.current.panY,
        hasDragged: false,
      };
    }

    function handleMouseMove(e: MouseEvent): void {
      if (!dragRef.current) {
        // Not dragging — update placement preview
        const opts = optionsRef.current;
        if (opts?.selectedPlant) {
          const rect = canvas!.getBoundingClientRect();
          const { col, row } = screenToGrid(
            e.clientX - rect.left,
            e.clientY - rect.top,
            viewTransformRef.current,
            opts.gridConfig,
          );
          opts.onPreviewMove(col, row);
        }
        return;
      }

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (!dragRef.current.hasDragged && Math.hypot(dx, dy) > 5) {
        dragRef.current.hasDragged = true;
      }

      const { originPanX, originPanY } = dragRef.current;
      setViewTransform((prev) => ({ ...prev, panX: originPanX + dx, panY: originPanY + dy }));
    }

    function handleMouseUp(e: MouseEvent): void {
      const drag = dragRef.current;
      dragRef.current = null;

      if (!drag) return;

      if (!drag.hasDragged) {
        const opts = optionsRef.current;
        if (opts?.selectedPlant) {
          const rect = canvas!.getBoundingClientRect();
          const { col, row } = screenToGrid(
            e.clientX - rect.left,
            e.clientY - rect.top,
            viewTransformRef.current,
            opts.gridConfig,
          );
          opts.onPlantPlace(col, row);
        }
      }
    }

    function handleMouseLeave(): void {
      optionsRef.current?.onPreviewMove(null, null);
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
    canvas.addEventListener('mouseleave', handleMouseLeave, { signal });
    window.addEventListener('mousemove', handleMouseMove, { signal });
    window.addEventListener('mouseup', handleMouseUp, { signal });
    canvas.addEventListener('wheel', handleWheel, {
      passive: false,
      signal,
    } as AddEventListenerOptions);

    return () => controller.abort();
  }, [canvasRef, viewTransform.panX, viewTransform.panY]);

  return { viewTransform };
}
