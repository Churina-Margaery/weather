import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';
import { Forecast } from './forecast';
import { mockForecast } from '../../utils/mocks';
import { withStore } from '../../utils/mock-component';
import { AppState } from '../../types/state/state-types';

const testStore = configureStore({
  reducer: {
    main: () => ({ forecast: mockForecast }),
  },
});

vi.mock('../../store/main-process/selectors', () => ({
  getForecast: vi.fn(() => mockForecast),
}));

describe('Forecast component', () => {

  it('should render component', () => {
    const { getByTestId } = render(
      <Provider store={testStore}>
        <Forecast />
      </Provider>
    );
    expect(getByTestId('forecast-container')).toBeInTheDocument();
  })

  it('should display forecast items', () => {

    render(
      <Provider store={testStore}>
        <Forecast />
      </Provider>
    );

    expect(screen.getAllByTestId('forecast-item-container')).toHaveLength(2);
  });

  it('should format date and temperature correctly', () => {
    render(
      <Provider store={testStore}>
        <Forecast />
      </Provider>
    );

    expect(screen.getByText(/Sunday/i)).toBeInTheDocument();
    expect(screen.getByText(/12:00/i)).toBeInTheDocument();
    expect(screen.getByText(/20 °C/i)).toBeInTheDocument();
  });

  it('should handle empty forecast', () => {

    render(
      <Provider store={testStore}>
        <Forecast />
      </Provider>
    );

    expect(screen.queryByRole('forecast-item-container')).toBeNull();
  });

  const mockState: AppState = {
    activeCityName: '',
    date: '',
    temperature: 0,
    description: '',
    icon: '',
    weatherInfo: {
      'Wind speed': 0,
      Visibility: 0,
      Pressure: 0,
      Humidity: 0,
      Sunrise: '',
      Sunset: ''
    },
    forecast: [
      { date: '2025-03-09T12:00:00', temperature: 20 }
    ],
    chartsInfo3Days: [],
    chartsInfo10Days: [],
    darkTheme: false,
    isLoading: false,
    isError: false,
  };

  it('should work with real store', () => {
    const { withStoreComponent } = withStore(<Forecast />, {
      Main: mockState
    });

    render(withStoreComponent);

    expect(screen.getByText(/Sunday/i)).toBeInTheDocument();
    expect(screen.getByText(/20 °C/i)).toBeInTheDocument();
  });
})
