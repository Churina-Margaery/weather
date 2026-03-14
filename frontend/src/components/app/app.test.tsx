import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './app';
import { getIsDarkTheme, getIsLoading } from '../../store/main-process/selectors';
import { fetchWeatherAction } from '../../store/api-actions';
import { toggleTheme } from '../../store/main-process/main-slice';

vi.mock('../../store/main-process/selectors', () => ({
  getIsDarkTheme: vi.fn(),
  getIsLoading: vi.fn(),
}));

const dispatchMock = vi.fn();
vi.mock('../../store', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: unknown) => (selector as any)(),
}));

vi.mock('../../store/api-actions', () => ({
  fetchWeatherAction: vi.fn((payload) => ({ type: 'fetchWeatherAction', payload })),
}));

vi.mock('../../store/main-process/main-slice', () => ({
  toggleTheme: vi.fn(() => ({ type: 'toggleTheme' })),
}));

// mocks: child components
vi.mock('../header/header', () => ({ Header: () => <div data-testid="header" /> }));
vi.mock('../main-card/main-card', () => ({ MainCard: () => <div data-testid="main-card" /> }));
vi.mock('../small-cards/small-cards', () => ({ SmallCards: () => <div data-testid="small-cards" /> }));
vi.mock('../forecast/forecast', () => ({ Forecast: () => <div data-testid="forecast" /> }));
vi.mock('../chart-block/chart-block', () => ({ ChartBlock: ({ period }: any) => <div data-testid={`chart-block-${period}`} /> }));
vi.mock('../../pages/loading-screen/loading-screen', () => ({ LoadingScreen: () => <div data-testid="loading" /> }));

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.className = '';

    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (getIsLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    (window as any).matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  it('should dispatch fetchWeatherAction on mount (equivalence: initial mount)', () => {
    render(<App />);

    expect(fetchWeatherAction).toHaveBeenCalledWith({
      cityName: 'Saint-Petersburg',
      stateName: '',
      countryName: '',
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'fetchWeatherAction',
      })
    );
  });

  it('should toggle theme on mount when system dark mode is true (boundary/equivalence: matchMedia true)', () => {
    (window as any).matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(<App />);

    expect(toggleTheme).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'toggleTheme',
      })
    );
  });

  it('should render loading screen when isLoading=true (equivalence class: loading)', () => {
    (getIsLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<App />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.queryByText(/Today Overview/i)).toBeNull();
  });

  it('should render main layout when isLoading=false (equivalence class: not loading)', () => {
    (getIsLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText(/Today Overview/i)).toBeInTheDocument();

    expect(screen.getByTestId('main-card')).toBeInTheDocument();
    expect(screen.getByTestId('small-cards')).toBeInTheDocument();
    expect(screen.getByTestId('forecast')).toBeInTheDocument();

    expect(screen.getByTestId('chart-block-3')).toBeInTheDocument();
    expect(screen.getByTestId('chart-block-10')).toBeInTheDocument();
  });

  it('should toggle body class based on darkTheme (boundary: false -> true)', () => {
    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const { rerender } = render(<App />);
    expect(document.body.classList.contains('dark-theme')).toBe(false);

    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    rerender(<App />);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });
});