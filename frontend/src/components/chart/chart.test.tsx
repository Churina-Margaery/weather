import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemperatureChart } from './chart';

const lineChartMock = vi.fn();
const yAxisMock = vi.fn();
const tooltipMock = vi.fn();

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive">{children}</div>
  ),

  LineChart: ({ children, ...props }: any) => {
    lineChartMock(props);
    return <div data-testid="line-chart">{children}</div>;
  },

  XAxis: () => <div data-testid="x-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,

  YAxis: (props: any) => {
    yAxisMock(props);
    return <div data-testid="y-axis" />;
  },

  Tooltip: (props: any) => {
    tooltipMock(props);
    return <div data-testid="tooltip" />;
  },

  Line: () => <div data-testid="line" />,
}));

describe('TemperatureChart component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass mapped data to LineChart (equivalence: data -> dataForChart)', () => {
    const data = [
      { date: '2025-03-09', temperature: 20, wind_speed: 3, pressure: 760, humidity: 40, visibility: 10 },
      { date: '2025-03-10', temperature: 22, wind_speed: 4, pressure: 758, humidity: 45, visibility: 9 },
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

  it('should set YAxis label unit and tooltip theme colors correctly (boundary: dark theme + unit mapping)', () => {
    render(
      <TemperatureChart
        isDarkTheme={true}
        data={[
          { date: '2025-03-09', temperature: 20, wind_speed: 3, pressure: 760, humidity: 40, visibility: 10 },
        ] as any}
        value="humidity"
      />
    );

    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: expect.objectContaining({
          value: '%',
          fill: '#ffffff',
        }),
        tick: { fill: '#ffffff' },
        axisLine: { stroke: '#cccccc' },
      })
    );

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
