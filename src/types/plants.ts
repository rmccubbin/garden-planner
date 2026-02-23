export type LightRequirement = 'full-sun' | 'partial-sun' | 'shade';
export type PlantCategory = 'vegetable' | 'herb';

export interface PlantDefinition {
  id: string;
  name: string;
  otherNames: string[];
  category: PlantCategory;
  emoji: string;
  color: string;
  spacingCells: number;
  lightRequirement: LightRequirement;
  catSafe: boolean;
}

export interface PlacedPlant {
  instanceId: string;
  plantId: string;
  col: number;
  row: number;
}
