import { useRef, useState } from 'react';
import type { GridConfig } from '../../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../../types/plants';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';
import styles from './GardenCanvas.module.css';

interface GardenCanvasProps {
  gridConfig: GridConfig;
  placedPlants: PlacedPlant[];
  plantDefs: PlantDefinition[];
  selectedPlant: PlantDefinition | null;
  onPlantPlace: (col: number, row: number) => void;
}

export function GardenCanvas({
  gridConfig,
  placedPlants,
  plantDefs,
  selectedPlant,
  onPlantPlace,
}: GardenCanvasProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewCell, setPreviewCell] = useState<{ col: number; row: number } | null>(null);

  function handlePreviewMove(col: number | null, row: number | null): void {
    setPreviewCell(col !== null && row !== null ? { col, row } : null);
  }

  const { viewTransform } = useCanvasInteraction(canvasRef, {
    selectedPlant,
    gridConfig,
    onPlantPlace,
    onPreviewMove: handlePreviewMove,
  });

  useCanvasRenderer(
    canvasRef,
    viewTransform,
    gridConfig,
    placedPlants,
    plantDefs,
    selectedPlant,
    previewCell,
  );

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{ cursor: selectedPlant ? 'crosshair' : undefined }}
      data-testid="garden-canvas"
    />
  );
}
