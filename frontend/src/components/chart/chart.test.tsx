import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemperatureChart } from './chart';

const lineChartMock = vi.fn(() => <div data-testid="line-chart" />);
const xAxisMock = vi.fn(() => <div data-testid="x-axis" />);
const yAxisMock = vi.fn(() => <div data-testid="y-axis" />);
const cartesianGridMock = vi.fn(() => <div data-testid="grid" />);
const tooltipMock = vi.fn(() => <div data-testid="tooltip" />);
const lineMock = vi.fn(() => <div data-testid="line" />);
const responsiveContainerMock = vi.fn(({ children }) => <div data-testid="responsive">{children}</div>);

// Мокаем recharts, чтобы проверять props без рендера настоящего svg/canvas
vi.mock('recharts', () => ({
  ResponsiveContainer: (props: any) => responsiveContainerMock(props),
  LineChart: () => lineChartMock(),
  XAxis: () => xAxisMock(),
  YAxis: () => yAxisMock(),
  CartesianGrid: () => cartesianGridMock(),
  Tooltip: () => tooltipMock(),
  Line: () => lineMock(),
}));

describe('TemperatureChart component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass mapped data to LineChart (equivalence: data -> dataForChart)', () => {
    const data = [
      {
        date: '2025-03-09',
        temperature: 20,
        wind_speed: 3,
        pressure: 760,
        humidity: 40,
        visibility: 10,
      },
      {
        date: '2025-03-10',
        temperature: 22,
        wind_speed: 4,
        pressure: 758,
        humidity: 45,
        visibility: 9,
      },
    ] as any;

    render(<TemperatureChart isDarkTheme={false} data={data} value="temperature" />);

    expect(screen.getByTestId('responsive')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();

    expect(lineChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { date: '2025-03-09', value: 20 },
          { date: '2025-03-10', value: 22 },
        ],
      })
    );
  });

  it('should set YAxis label unit and theme colors correctly (boundary: dark vs light + unit mapping)', () => {
    render(
      <TemperatureChart
        isDarkTheme={true}
        data={[
          {
            date: '2025-03-09',
            temperature: 20,
            wind_speed: 3,
            pressure: 760,
            humidity: 40,
            visibility: 10,
          },
        ] as any}
        value="humidity"
      />
    );

    // unit для humidity -> %
    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: expect.objectContaining({
          value: '%',
          fill: '#ffffff', // dark theme => white text
        }),
        tick: { fill: '#ffffff' },
        axisLine: { stroke: '#cccccc' },
      })
    );

    // Tooltip тоже должен быть в dark theme стиле
    expect(tooltipMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contentStyle: expect.objectContaining({
          backgroundColor: '#424242',
        }),
        labelStyle: expect.objectContaining({
          color: '#ffffff',
        }),
        itemStyle: expect.objectContaining({
          color: '#ffffff',
        }),
      })
    );
  });
});