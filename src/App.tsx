import { useState, useEffect } from 'react';
import type { GridConfig } from './types/canvas';
import type { PlantDefinition, PlacedPlant } from './types/plants';
import { GardenCanvas } from './components/canvas/GardenCanvas';
import { PlantPalette } from './components/sidebar/PlantPalette';
import { PLANTS } from './data/plants';
import { isPlacementValid } from './utils/canvasHelpers';
import styles from './App.module.css';

const DEFAULT_GRID: GridConfig = {
  cellSize: 40,
  cols: 20,
  rows: 20,
};

function App() {
  const [selectedPlant, setSelectedPlant] = useState<PlantDefinition | null>(null);
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') setSelectedPlant(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handlePlantPlace(col: number, row: number): void {
    if (!selectedPlant) return;
    if (!isPlacementValid(col, row, selectedPlant.spacingCells, placedPlants, PLANTS, DEFAULT_GRID)) return;
    setPlacedPlants((prev) => [
      ...prev,
      {
        instanceId: crypto.randomUUID(),
        plantId: selectedPlant.id,
        col,
        row,
      },
    ]);
  }

  return (
    <div className={styles.layout}>
      <PlantPalette
        plants={PLANTS}
        selectedPlant={selectedPlant}
        onSelect={setSelectedPlant}
      />
      <GardenCanvas
        gridConfig={DEFAULT_GRID}
        placedPlants={placedPlants}
        plantDefs={PLANTS}
        selectedPlant={selectedPlant}
        onPlantPlace={handlePlantPlace}
      />
    </div>
  );
}

export default App;
