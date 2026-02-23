import type { GridConfig } from './types/canvas';
import { GardenCanvas } from './components/canvas/GardenCanvas';
import styles from './App.module.css';

const DEFAULT_GRID: GridConfig = {
  cellSize: 40,
  cols: 20,
  rows: 20,
};

function App() {
  return (
    <div className={styles.appContainer}>
      <GardenCanvas gridConfig={DEFAULT_GRID} />
    </div>
  );
}

export default App;
