//import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MainCard } from './main-card';
import { getTemp, getCity, getDate, getIcon, getDescription } from '../../store/main-process/selectors';
// В начале тестового файла (перед импортами)
declare const vi: typeof import('vitest').vi;
vi.mock('../../store/main-process/selectors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/main-process/selectors')>();
  return {
    ...actual,
    getTemp: vi.fn(),
    getCity: vi.fn(),
    getDate: vi.fn(),
    getIcon: vi.fn(),
    getDescription: vi.fn(),
  };
});

describe('MainCard component', () => {
  const mockGetTemp = vi.mocked(getTemp);
  const mockGetCity = vi.mocked(getCity);
  const mockGetDate = vi.mocked(getDate);
  const mockGetIcon = vi.mocked(getIcon);
  const mockGetDescription = vi.mocked(getDescription);

  const createMockStore = (state: object) => configureStore({
    reducer: {
      main: (state = {}) => state
    },
    preloadedState: state
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with mock data', () => {
    mockGetTemp.mockReturnValue(25);
    mockGetCity.mockReturnValue('London');
    mockGetDate.mockReturnValue('2024-01-01T00:00:00');
    mockGetIcon.mockReturnValue('./img/sun.svg');
    mockGetDescription.mockReturnValue('Nice');

    const mockStore = createMockStore({
      main: {
        temp: 25,
        city: 'London',
        date: '2024-01-01T00:00:00',
        icon: './img/calendar.svg',
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
    expect(screen.getByText('Nice')).toBeInTheDocument();

    expect(screen.getAllByAltText('icon')[0]).toHaveAttribute('src', './img/sun.svg');
    expect(screen.getAllByAltText('icon')[1]).toHaveAttribute('src', './img/location.svg');
    expect(screen.getAllByAltText('icon')[2]).toHaveAttribute('src', './img/calendar.svg');
  });

  it('should handle different data', () => {
    mockGetTemp.mockReturnValue(-5);
    mockGetCity.mockReturnValue('Moscow');
    mockGetDate.mockReturnValue('2024-12-31T00:00:00');
    mockGetIcon.mockReturnValue('./img/sun.svg');
    mockGetDescription.mockReturnValue('Bad');

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
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });
});