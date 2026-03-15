import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SmallCard } from './small-card';
import { mockSmallCardItem } from '../../utils/mocks';


describe('Small card item component', () => {

  it('should render component', () => {
    const { getByTestId } = render(
      <SmallCard
        icon={mockSmallCardItem.icon}
        name={mockSmallCardItem.name}
        value={mockSmallCardItem.value}
        desc={mockSmallCardItem.desc}
      />
    );
    expect(getByTestId('small-card-item-container')).toBeInTheDocument();
  });

  it('should display correct data', () => {

    render(
      <SmallCard
        icon={mockSmallCardItem.icon}
        name={mockSmallCardItem.name}
        value={mockSmallCardItem.value}
        desc={mockSmallCardItem.desc}
      />
    );

    expect(screen.getByRole('img', { name: /icon/i })).toHaveAttribute('src', mockSmallCardItem.icon);
    expect(screen.getByText(mockSmallCardItem.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockSmallCardItem.value} ${mockSmallCardItem.desc}`)).toBeInTheDocument();
  });

  it('should not format value when name is not Sunrise/Sunset (equivalence class)', () => {
    render(
      <SmallCard
        icon="./img/icon.svg"
        name="Humidity"
        value={55}
        desc="%"
      />
    );

    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('55 %')).toBeInTheDocument();
  });

  it('should format value as time when name is Sunrise', () => {
    render(
      <SmallCard
        icon="./img/icon.svg"
        name="Sunrise"
        value="2025-03-09T06:12:34"
        desc=""
      />
    );

    expect(screen.getByText('Sunrise')).toBeInTheDocument();
    expect(screen.getByText('06:12')).toBeInTheDocument();
  });

  it('should format value as time when name is Sunset', () => {
    render(
      <SmallCard
        icon="./img/icon.svg"
        name="Sunset"
        value="2025-03-09T18:45:00"
        desc=""
      />
    );

    expect(screen.getByText('Sunset')).toBeInTheDocument();
    expect(screen.getByText('18:45')).toBeInTheDocument();
  });

  it('should render zero value correctly (boundary)', () => {
    render(
      <SmallCard
        icon="./img/icon.svg"
        name="Pressure"
        value={0}
        desc="hPa"
      />
    );

    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('0 hPa')).toBeInTheDocument();
  });
});
