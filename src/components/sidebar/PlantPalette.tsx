import { useState } from 'react';
import type { PlantCategory, PlantDefinition } from '../../types/plants';
import { PlantCard } from './PlantCard';
import styles from './PlantPalette.module.css';

interface PlantPaletteProps {
  plants: PlantDefinition[];
  selectedPlant: PlantDefinition | null;
  onSelect: (plant: PlantDefinition | null) => void;
}

type CategoryFilter = 'all' | PlantCategory;

export function PlantPalette({ plants, selectedPlant, onSelect }: PlantPaletteProps): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const q = search.toLowerCase().trim();
  const filtered = plants.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.otherNames.some((n) => n.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ value: CategoryFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'herb', label: 'Herbs' },
  ];

  return (
    <aside className={styles.sidebar} aria-label="Plant palette">
      <h2 className={styles.heading}>Plants</h2>
      <input
        type="search"
        placeholder="Search plants…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
        aria-label="Search plants"
      />
      <div className={styles.tabs} role="tablist">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={category === value}
            className={category === value ? styles.tabActive : styles.tab}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No plants found</p>
        ) : (
          filtered.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              selected={selectedPlant?.id === plant.id}
              onClick={() => onSelect(selectedPlant?.id === plant.id ? null : plant)}
            />
          ))
        )}
      </div>
      {selectedPlant && (
        <p className={styles.hint}>Click the garden to place · ESC to cancel</p>
      )}
    </aside>
  );
}
