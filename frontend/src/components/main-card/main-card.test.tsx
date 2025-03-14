import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import { MainCard } from './main-card';
import { getTemp, getCity, getDate } from '../../store/main-process/selectors';

vi.mock('../../store/main-process/selectors', () => ({
  getTemp: vi.fn(),
  getCity: vi.fn(),
  getDate: vi.fn(),
}));

describe('MainCard component', () => {
  const mockGetTemp = getTemp as vi.Mock;
  const mockGetCity = getCity as vi.Mock;
  const mockGetDate = getDate as vi.Mock;

  const createMockStore = (state: object) => configureStore({
    reducer: {
      main: (state = {}) => state
    },
    preloadedState: state
  });

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks();
  });

  it('should render with mock data', () => {
    mockGetTemp.mockReturnValue(25);
    mockGetCity.mockReturnValue('London');
    mockGetDate.mockReturnValue('2024-01-01T00:00:00');

    const mockStore = createMockStore({
      main: {
        temp: 25,
        city: 'London',
        date: '2024-01-01T00:00:00'
      }
    });

    render(
      <Provider store={mockStore}>
        <MainCard />
      </Provider>
    );

    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('January 1')).toBeInTheDocument();

    // Проверяем иконки
    expect(screen.getAllByAltText('icon')[0]).toHaveAttribute('src', './img/sun.svg');
    expect(screen.getAllByAltText('icon')[1]).toHaveAttribute('src', './img/location.svg');
    expect(screen.getAllByAltText('icon')[2]).toHaveAttribute('src', './img/calendar.svg');
  });

  it('should handle different data', () => {
    // Меняем моки для другого тестового случая
    mockGetTemp.mockReturnValue(-5);
    mockGetCity.mockReturnValue('Moscow');
    mockGetDate.mockReturnValue('2024-12-31T00:00:00');

    const mockStore = createMockStore({
      main: {
        temp: -5,
        city: 'Moscow',
        date: '2024-12-31T00:00:00'
      }
    });

    render(
      <Provider store={mockStore}>
        <MainCard />
      </Provider>
    );

    expect(screen.getByText('-5°C')).toBeInTheDocument();
    expect(screen.getByText('Moscow')).toBeInTheDocument();
    expect(screen.getByText('December 31')).toBeInTheDocument();
  });
});