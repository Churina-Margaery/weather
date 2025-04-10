import { useEffect } from 'react';
import axios from 'axios';

import { Header } from '../header/header';
import { MainCard } from '../main-card/main-card';
import { SmallCards } from '../small-cards/small-cards';
import { Forecast } from '../forecast/forecast';
import { ChartBlock } from '../chart-block/chart-block';
import { getIsDarkTheme } from '../../store/main-process/selectors';
import { toggleTheme } from '../../store/main-process/main-slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWeatherAction } from '../../store/api-actions';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const darkTheme = useAppSelector(getIsDarkTheme);

  useEffect(() => {
    dispatch(fetchWeatherAction({ cityName: 'Saint-Petersburg' }));
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDarkMode) {
      dispatch(toggleTheme());
    }
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
  }, [darkTheme]);

  // if (useSelector(getIsLoading)) {
  //   return (
  //     <LoadingScreen />
  //   );
  // }

  return (
    <section className="content">
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
    </section>
  );
}

export default App;
