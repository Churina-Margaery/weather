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

export function TemperatureChart(): JSX.Element {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
