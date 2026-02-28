import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChartBlock } from './chart-block';
import { get3DaysData, get10DaysData, getIsDarkTheme } from '../../store/main-process/selectors';

vi.mock('../../store/main-process/selectors', () => ({
  get3DaysData: vi.fn(),
  get10DaysData: vi.fn(),
  getIsDarkTheme: vi.fn(),
}));

vi.mock('../../store', () => ({
  useAppSelector: (selector: unknown) => {
    return new (selector as ReturnType<typeof vi.fn>)();
  },
}));

const temperatureChartMock = vi.fn(() => <div data-testid="temperature-chart" />);
vi.mock('../chart/chart', () => ({
  TemperatureChart: () => temperatureChartMock(),
}));

describe('ChartBlock component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (get3DaysData as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      { date: '2025-03-09', temperature: 20, wind_speed: 3, humidity: 40, pressure: 760, visibility: 10 },
    ]);
    (get10DaysData as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      { date: '2025-03-01', temperature: 10, wind_speed: 4, humidity: 50, pressure: 755, visibility: 8 },
      { date: '2025-03-02', temperature: 11, wind_speed: 5, humidity: 55, pressure: 756, visibility: 9 },
    ]);
  });

  it('should render component', () => {
    render(<ChartBlock period={3} />);

    expect(screen.getByText(/Last 3 Days/i)).toBeInTheDocument();
    expect(screen.getByTestId('temperature-chart')).toBeInTheDocument();
  });

  it('should use 3 days selector when period=3 (equivalence class: 3)', () => {
    render(<ChartBlock period={3} />);

    expect(get3DaysData).toHaveBeenCalled();
    expect(get10DaysData).not.toHaveBeenCalled();

    expect(temperatureChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: (get3DaysData as unknown as ReturnType<typeof vi.fn>).mock.results[0].value,
      })
    );
  });

  it('should use 10 days selector when period=10 (equivalence class: 10)', () => {
    render(<ChartBlock period={10} />);

    expect(get10DaysData).toHaveBeenCalled();
    expect(get3DaysData).not.toHaveBeenCalled();

    expect(temperatureChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: (get10DaysData as unknown as ReturnType<typeof vi.fn>).mock.results[0].value,
      })
    );
  });

  it('should pass isDarkTheme from selector to TemperatureChart', () => {
    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<ChartBlock period={3} />);

    expect(temperatureChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isDarkTheme: true,
      })
    );
  });

  it('should have default selected value = "temperature" and pass it to chart (boundary/default)', () => {
    render(<ChartBlock period={3} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('temperature');

    expect(temperatureChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'temperature',
      })
    );
  });

  it('should change selected value on select change and pass new value to chart', () => {
    render(<ChartBlock period={3} />);

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'humidity' } });

    expect(select).toHaveValue('humidity');
    expect(temperatureChartMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'humidity',
      })
    );
  });

  it('should render correct period title (boundary: 3 and 10)', () => {
    const { rerender } = render(<ChartBlock period={3} />);
    expect(screen.getByText(/Last 3 Days/i)).toBeInTheDocument();

    rerender(<ChartBlock period={10} />);
    expect(screen.getByText(/Last 10 Days/i)).toBeInTheDocument();
  });

  it('should work with empty data (equivalence class: empty array)', () => {
    (get3DaysData as unknown as ReturnType<typeof vi.fn>).mockReturnValue([]);

    render(<ChartBlock period={3} />);

    expect(temperatureChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [],
      })
    );
  });

  it('should pass correct props for pairwise combination: period=10 + value=pressure', () => {
    render(<ChartBlock period={10} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'pressure' } });

    expect(temperatureChartMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: (get10DaysData as unknown as ReturnType<typeof vi.fn>).mock.results[0].value,
        value: 'pressure',
        isDarkTheme: false,
      })
    );
  });
});
