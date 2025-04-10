import { useAppSelector, useAppDispatch } from "../../store";
import { getIsDarkTheme } from '../../store/main-process/selectors';
import { toggleTheme } from '../../store/main-process/main-slice';
import { fetchWeatherAction } from "../../store/api-actions";
import { useState } from "react";

export function Header(): JSX.Element {

  const dispatch = useAppDispatch();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const handleSearch = () => {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    dispatch(fetchWeatherAction({
      cityName: city.trim(),
      stateName: state.trim(),
      countryName: country.trim()
    }));
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="header" data-testid="header-container">
      <div className="container">
        <div className="header__weather-label">
          <img src="./img/cloud.svg" alt="cloud" className="header__cloud" />
          <p className="header__label-desc">weather</p>
        </div>
        <div className="header__inputs">
          <input
            className="header__city-search"
            type="search"
            name="search-city"
            placeholder="Enter city"
            id="1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            className="header__city-search"
            type="search"
            name="search-state"
            placeholder="Enter state (optional)"
            id="2"
            value={state}
            onChange={(e) => setState(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            className="header__city-search"
            type="search"
            name="search-country"
            placeholder="Enter country"
            id="3"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <button
          className="header__loupe"
          onClick={handleSearch}
        >
          <img src="./img/loupe.svg" alt="loupe" />
        </button>
        <button
          className="header__btn"
          onClick={() => dispatch(toggleTheme())}
        >
          <img
            src={useAppSelector(getIsDarkTheme) ? "./img/light-moon.svg" : "./img/full-moon.svg"}
            alt="switch mode"
            className="header__btn-img"
          />
        </button>
        <a
          href="https://github.com/Churina-Margaery/weather"
          target="_blank"
          className="header__support-link"
        >
          <button className="header__support-btn">
            <img src="./img/github.svg" alt="github" className="header__github" />
            <p className="header__support-desc">Support Project</p>
          </button>
        </a>
      </div>
    </header>
  );
}
