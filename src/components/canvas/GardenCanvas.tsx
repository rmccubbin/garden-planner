import { useRef } from 'react';
import type { GridConfig } from '../../types/canvas';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';
import styles from './GardenCanvas.module.css';

interface GardenCanvasProps {
  gridConfig: GridConfig;
}

export function GardenCanvas({ gridConfig }: GardenCanvasProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { viewTransform } = useCanvasInteraction(canvasRef);
  useCanvasRenderer(canvasRef, viewTransform, gridConfig);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      data-testid="garden-canvas"
    />
  );
}
