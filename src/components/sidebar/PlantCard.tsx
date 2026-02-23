import type { PlantDefinition, LightRequirement } from '../../types/plants';
import styles from './PlantCard.module.css';

function lightEmoji(light: LightRequirement): string {
  switch (light) {
    case 'full-sun': return '☀️';
    case 'partial-sun': return '⛅';
    case 'shade': return '🌥️';
  }
}

function lightLabel(light: LightRequirement): string {
  switch (light) {
    case 'full-sun': return 'Full sun';
    case 'partial-sun': return 'Partial sun';
    case 'shade': return 'Shade';
  }
}

interface PlantCardProps {
  plant: PlantDefinition;
  selected: boolean;
  onClick: () => void;
}

export function PlantCard({ plant, selected, onClick }: PlantCardProps): React.JSX.Element {
  return (
    <button
      className={selected ? styles.cardSelected : styles.card}
      onClick={onClick}
      aria-pressed={selected}
      title={plant.name}
    >
      <span className={styles.emoji} aria-hidden="true">{plant.emoji}</span>
      <span className={styles.name}>{plant.name}</span>
      <div className={styles.indicators}>
        <span
          title={lightLabel(plant.lightRequirement)}
          aria-label={lightLabel(plant.lightRequirement)}
        >
          {lightEmoji(plant.lightRequirement)}
        </span>
        {!plant.catSafe && (
          <span title="Not cat safe" aria-label="Not cat safe">⚠️</span>
        )}
      </div>
    </button>
  );
}
