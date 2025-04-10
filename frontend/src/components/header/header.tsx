import { useAppSelector, useAppDispatch } from "../../store";
import { getIsDarkTheme } from '../../store/main-process/selectors';
import { toggleTheme } from '../../store/main-process/main-slice';

export function Header(): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <header className="header" data-testid="header-container">
      <div className="container">
        <div className="header__weather-label">
          <img src="./img/cloud.svg" alt="cloud" className="header__cloud" />
          <p className="header__label-desc">weather</p>
        </div>
        <img src="./img/loupe.svg" alt="loupe" className="header__loupe" />
        <div className="header__inputs">
          <input type="search" name="search-city" placeholder="Enter city name" id="1" className="header__city-search" />
          <input type="search" name="search-state" placeholder="Enter state name (optional)" id="2" className="header__city-search" />
          <input type="search" name="search-country" placeholder="Enter country name" id="3" className="header__city-search" />
        </div>
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
