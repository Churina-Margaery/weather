import { useEffect } from 'react';

import { Header } from '../header/header';
import { MainCard } from '../main-card/main-card';
import { SmallCards } from '../small-cards/small-cards';
import { Forecast } from '../forecast/forecast';
import { ChartBlock } from '../chart-block/chart-block';
import { LoadingScreen } from '../../pages/loading-screen/loading-screen';
import { getIsDarkTheme, getIsLoading } from '../../store/main-process/selectors';
import { toggleTheme } from '../../store/main-process/main-slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWeatherAction } from '../../store/api-actions';
import React from 'react';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const darkTheme = useAppSelector(getIsDarkTheme);
  const isLoading = useAppSelector(getIsLoading);

  useEffect(() => {
    dispatch(fetchWeatherAction({ cityName: 'Moscow', stateName: '', countryName: '' }));
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDarkMode) {
      dispatch(toggleTheme());
    }
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
  }, [darkTheme]);

  return (
    <section className="content">
      {isLoading && <LoadingScreen />}
      {!isLoading &&
        <React.Fragment>
          <Header />
          <main className="main">
            <div className="container">
              <section className="overview">
                <h1 className="overview__title">Today Overview</h1>
                <div className="overview__items">
                  <MainCard />
                  <SmallCards />
                  <Forecast />
                </div>
              </section>
              <section className="chart">
                <div className="chart__content">
                  <ChartBlock
                    period={3}
                  />
                  <ChartBlock
                    period={10}
                  />
                </div>
              </section>
            </div>
          </main>
        </React.Fragment>
      }
    </section>
  );
}

export default App;
