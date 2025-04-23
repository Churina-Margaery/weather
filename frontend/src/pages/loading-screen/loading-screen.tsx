import { useAppSelector } from "../../store";
import { getIsDarkTheme } from "../../store/main-process/selectors";
import { ToastContainer } from 'react-toastify';

export function LoadingScreen(): JSX.Element {
  return (
    <section data-testid="loader-container">
      <header className="header">
        <ToastContainer />
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
              disabled
            />
            <input
              className="header__city-search"
              type="search"
              name="search-state"
              placeholder="Enter state (optional)"
              id="2"
              disabled
            />
            <input
              className="header__city-search"
              type="search"
              name="search-country"
              placeholder="Enter country"
              id="3"
              disabled
            />
          </div>
          <button
            className="header__loupe"
            disabled
          >
            <img src="./img/loupe.svg" alt="loupe" />
          </button>
          <button
            className="header__btn"
            disabled
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

      <main className="main">
        <div className="container">
          <section className="overview">
            <h1 className="overview__title">Today Overview</h1>
            <div className="overview__items">
              <div className="overview__main-info loading__overview"></div>
              <div className="overview__small-items">
                <div className="loading__overview-small-item"></div>
                <div className="loading__overview-small-item"></div>
                <div className="loading__overview-small-item"></div>
                <div className="loading__overview-small-item"></div>
                <div className="loading__overview-small-item"></div>
                <div className="loading__overview-small-item"></div>
              </div>
              <div className="loading__overview-forecast"></div>
            </div>
          </section>
        </div>
      </main>
    </section >
  );
}
