import { useState } from "react";

import { TemperatureChart } from "../chart/chart";
import { useAppSelector } from "../../store";
import { getIsDarkTheme } from "../../store/main-process/selectors";
import { ChartsInfo, WeatherChartTypes } from '../../types/state/state-types';
import { get3DaysData, get10DaysData } from '../../store/main-process/selectors';

type ChartBlockProps = {
  period: 3 | 10;
}
export function ChartBlock({ period = 3 }: ChartBlockProps): JSX.Element {

  const [selectedValue, setSelectedValue] = useState<WeatherChartTypes>('temperature');
  let data: ChartsInfo[] = [];

  if (period === 3) {
    data = useAppSelector(get3DaysData);
  } else {
    data = useAppSelector(get10DaysData);
  }

  return (
    <div className="chart__content-part">
      <div className="chart__content-info">
        <h3 className="chart__content-info-period">Last {period} Days</h3>
        <div className="custom-select">
          <select
            name={`period${period}`}
            required
            value={selectedValue}
            onChange={(e) => {
              const value = e.target.value as WeatherChartTypes;
              setSelectedValue(value);
            }}
          >
            <option value="wind_speed">Wind speed</option>
            <option value="pressure">Pressure</option>
            <option value="humidity">Humidity</option>
            <option value="visibility">Visibility</option>
            <option value="temperature">Temperature</option>
          </select>
        </div>
      </div>

      <TemperatureChart
        isDarkTheme={useAppSelector(getIsDarkTheme)}
        data={data}
        days={period}
        value={selectedValue}
      />
    </div>
  );
}
