import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', temp: 22 },
  { day: 'Tue', temp: 19 },
  { day: 'Wed', temp: 24 },
  { day: 'Thu', temp: 21 },
  { day: 'Fri', temp: 18 },
  { day: 'Sat', temp: 20 },
  { day: 'Sun', temp: 23 }
];

interface TemperatureChartProps {
  isDarkTheme: boolean;
}

export function TemperatureChart({ isDarkTheme }: TemperatureChartProps): JSX.Element {
  // Цвета для разных тем
  const textColor = isDarkTheme ? '#ffffff' : '#333333';
  const axisColor = isDarkTheme ? '#cccccc' : '#666666';
  const gridColor = isDarkTheme ? '#444444' : '#eeeeee';
  const tooltipBg = isDarkTheme ? '#424242' : '#ffffff';

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: textColor }}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            label={{
              value: '°C',
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
            dataKey="temp"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
