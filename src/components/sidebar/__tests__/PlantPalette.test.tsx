import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlantPalette } from '../PlantPalette';
import { PLANTS } from '../../../data/plants';

const noop = () => {};

describe('PlantPalette', () => {
  it('renders plant cards for all plants on load', () => {
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    expect(screen.getAllByRole('button', { name: /tomato/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /basil/i })).toBeInTheDocument();
  });

  it('filters plants by name search', async () => {
    const user = userEvent.setup();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    await user.type(screen.getByRole('searchbox'), 'tomato');
    expect(screen.getByRole('button', { name: /tomato/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /basil/i })).not.toBeInTheDocument();
  });

  it('filters by otherNames alias (cilantro → coriander)', async () => {
    const user = userEvent.setup();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    await user.type(screen.getByRole('searchbox'), 'cilantro');
    expect(screen.getByRole('button', { name: /coriander/i })).toBeInTheDocument();
  });

  it('filters plants by Herbs category', async () => {
    const user = userEvent.setup();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    await user.click(screen.getByRole('tab', { name: /herbs/i }));
    expect(screen.getByRole('button', { name: /basil/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /tomato/i })).not.toBeInTheDocument();
  });

  it('filters plants by Vegetables category', async () => {
    const user = userEvent.setup();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    await user.click(screen.getByRole('tab', { name: /vegetables/i }));
    expect(screen.getByRole('button', { name: /tomato/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /basil/i })).not.toBeInTheDocument();
  });

  it('shows "No plants found" when search has no matches', async () => {
    const user = userEvent.setup();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={noop} />);
    await user.type(screen.getByRole('searchbox'), 'zzznomatch');
    expect(screen.getByText(/no plants found/i)).toBeInTheDocument();
  });

  it('calls onSelect with the plant when a card is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<PlantPalette plants={PLANTS} selectedPlant={null} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /tomato/i }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'tomato' }));
  });

  it('calls onSelect with null when the selected plant is clicked again', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const tomato = PLANTS.find((p) => p.id === 'tomato')!;
    render(<PlantPalette plants={PLANTS} selectedPlant={tomato} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /tomato/i }));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('selected plant card has aria-pressed="true"', () => {
    const tomato = PLANTS.find((p) => p.id === 'tomato')!;
    render(<PlantPalette plants={PLANTS} selectedPlant={tomato} onSelect={noop} />);
    expect(screen.getByRole('button', { name: /tomato/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows placement hint when a plant is selected', () => {
    const tomato = PLANTS.find((p) => p.id === 'tomato')!;
    render(<PlantPalette plants={PLANTS} selectedPlant={tomato} onSelect={noop} />);
    expect(screen.getByText(/click the garden to place/i)).toBeInTheDocument();
  });
});
