import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { WeatherChartTypes } from '../../types/state/state-types';
import { ChartsInfo } from '../../types/state/state-types';

interface TemperatureChartProps {
  isDarkTheme: boolean;
  days: 3 | 10;
  data: ChartsInfo[];
  value: WeatherChartTypes;
}

export function TemperatureChart({ isDarkTheme, days, data, value }: TemperatureChartProps): JSX.Element {
  const textColor = isDarkTheme ? '#ffffff' : '#333333';
  const axisColor = isDarkTheme ? '#cccccc' : '#666666';
  const gridColor = isDarkTheme ? '#444444' : '#eeeeee';
  const tooltipBg = isDarkTheme ? '#424242' : '#ffffff';
  const unit = {
    temperature: '°C',
    "wind speed": 'm/s',
    pressure: 'hPa',
    humidity: '%',
    visibility: 'km'
  }[value];
  const dataForChart = data.map((item) => ({ date: item.date, value: item[value] }));
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={dataForChart}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: textColor }}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            label={{
              value: unit,
              angle: -90,
              position: 'insideLeft',
              fill: textColor
            }}
            tick={{ fill: textColor }}
            axisLine={{ stroke: axisColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            labelStyle={{
              color: textColor,
              fontWeight: 600
            }}
            itemStyle={{
              color: textColor,
              fontSize: '14px'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
