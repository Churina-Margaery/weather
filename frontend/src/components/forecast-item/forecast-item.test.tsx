import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ForecastItem } from './forecast-item';
import { mockForecastItem } from '../../utils/mocks';

describe('Forecast item component', () => {
  it('should render component', () => {
    const { getByTestId } = render(
      <ForecastItem
        day={mockForecastItem.day}
        time={mockForecastItem.time}
        temp={mockForecastItem.temperature}
      />
    );

    expect(getByTestId('forecast-item-container')).toBeInTheDocument();
  });

  it('should display forecast item (container count = 1)', () => {
    render(
      <ForecastItem
        day={mockForecastItem.day}
        time={mockForecastItem.time}
        temp={mockForecastItem.temperature}
      />
    );

    expect(screen.getAllByTestId('forecast-item-container')).toHaveLength(1);
  });

  it('should display day, time and temperature text correctly', () => {
    render(
      <ForecastItem
        day={mockForecastItem.day}
        time={mockForecastItem.time}
        temp={mockForecastItem.temperature}
      />
    );

    expect(screen.getByText(mockForecastItem.day)).toBeInTheDocument();
    expect(screen.getByText(mockForecastItem.time)).toBeInTheDocument();
    expect(screen.getByText(`${mockForecastItem.temperature} °C`)).toBeInTheDocument();
  });

  it('should support temp boundary values (0 and negative)', () => {
    const { rerender } = render(<ForecastItem day="Mon" time="00:00" temp={0} />);
    expect(screen.getByText('0 °C')).toBeInTheDocument();

    rerender(<ForecastItem day="Mon" time="00:00" temp={-5} />);
    expect(screen.getByText('-5 °C')).toBeInTheDocument();
  });

  it('should render even if day/time are empty strings (equivalence class: empty strings)', () => {
    render(<ForecastItem day="" time="" temp={10} />);

    expect(screen.getByTestId('forecast-item-container')).toBeInTheDocument();
    expect(screen.getByText('10 °C')).toBeInTheDocument();
  });

  it('should not render item when component is not mounted (equivalence: no render)', () => {
    expect(screen.queryByTestId('forecast-item-container')).toBeNull();
  });
});
