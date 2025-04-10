import { useState } from "react";

import { TemperatureChart } from "../chart/chart";

type ChartBlockProps = {
  period: 3 | 10;
}
export function ChartBlock({ period = 3 }: ChartBlockProps): JSX.Element {

  const [selectedValue, setSelectedValue] = useState('temperature');

  return (
    <div className="chart__content-part">
      <div className="chart__content-info">
        <h3 className="chart__content-info-period">Last {period} Days</h3>
        <div className="custom-select">
          <select
            name="period1"
            required
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="wind">Wind speed</option>
            <option value="pressure">Pressure</option>
            <option value="humidity">Humidity</option>
            <option value="visibility">Visibility</option>
            <option value="visibility" selected={true}>Temperature</option>
          </select>
        </div>
      </div>

      {/* <img src="./img/mock-diagram.png" alt="mock" className="mock" /> */}
      <TemperatureChart />
    </div>
  );
}
