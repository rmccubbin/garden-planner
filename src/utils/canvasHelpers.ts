import type { GridConfig, ViewTransform } from '../types/canvas';
import type { PlacedPlant, PlantDefinition } from '../types/plants';

export function screenToGrid(
  screenX: number,
  screenY: number,
  viewTransform: ViewTransform,
  gridConfig: GridConfig,
): { col: number; row: number } {
  const worldX = (screenX - viewTransform.panX) / viewTransform.zoom;
  const worldY = (screenY - viewTransform.panY) / viewTransform.zoom;
  return {
    col: Math.floor(worldX / gridConfig.cellSize),
    row: Math.floor(worldY / gridConfig.cellSize),
  };
}

export function isPlacementValid(
  col: number,
  row: number,
  size: number,
  placedPlants: PlacedPlant[],
  plantDefs: PlantDefinition[],
  gridConfig: GridConfig,
): boolean {
  if (col < 0 || row < 0) return false;
  if (col + size > gridConfig.cols || row + size > gridConfig.rows) return false;

  for (const placed of placedPlants) {
    const def = plantDefs.find((d) => d.id === placed.plantId);
    if (!def) continue;
    const s = def.spacingCells;
    const noOverlap =
      col >= placed.col + s ||
      col + size <= placed.col ||
      row >= placed.row + s ||
      row + size <= placed.row;
    if (!noOverlap) return false;
  }

  return true;
}
