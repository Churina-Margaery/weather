import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './header';
import { rootReducer } from '../../store/root-reducer';
import { getIsDarkTheme } from '../../store/main-process/selectors';
import { fetchWeatherAction } from '../../store/api-actions';

const testStore = configureStore({
  reducer: {
    main: rootReducer,
  },
});

const toastErrorMock = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

vi.mock('../../store/main-process/selectors', () => ({
  getIsDarkTheme: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  fetchWeatherAction: vi.fn(),
}));

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getIsDarkTheme as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (state: ReturnType<typeof testStore.getState>) => state.main.Main.darkTheme
    );

    (fetchWeatherAction as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        () => ({
          unwrap: () => Promise.resolve(),
        })
    );
  });

  it('should render component', () => {
    const { getByTestId } = render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );
    expect(getByTestId('header-container')).toBeInTheDocument();
  });

  it('should display data', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );
    expect(screen.getByText(/weather/i)).toBeInTheDocument();
    expect(screen.getByText(/Support project/i)).toBeInTheDocument();
  });

  it('should handle mode change', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    const themeButton = screen.getByRole('button', { name: /switch mode/i });

    expect(testStore.getState().main.Main.darkTheme).toBe(false);

    fireEvent.click(themeButton);

    expect(testStore.getState().main.Main.darkTheme).toBe(true);
    fireEvent.click(themeButton);
  });

  it('should display correct icon based on theme', () => {
    const { rerender } = render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    expect(screen.getByRole('img', { name: /switch mode/i })).toHaveAttribute('src', './img/full-moon.svg');

    const themeButton = screen.getByRole('button', { name: /switch mode/i });
    fireEvent.click(themeButton);

    rerender(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    expect(screen.getByRole('img', { name: /switch mode/i })).toHaveAttribute('src', './img/light-moon.svg');
  });

  it('should show toast error if city is empty and not dispatch weather action', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    const buttons = screen.getAllByRole('button');
    const loupeButton = buttons[0];

    fireEvent.click(loupeButton);

    expect(toastErrorMock).toHaveBeenCalledWith('Please enter a city name');
    expect(fetchWeatherAction).not.toHaveBeenCalled();
  });

  it('should dispatch fetchWeatherAction with trimmed params on click', () => {
    const thunkImpl = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
    (fetchWeatherAction as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => thunkImpl
    );

    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter city/i), { target: { value: '  London  ' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter state/i), { target: { value: '  ENG  ' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter country/i), { target: { value: '  UK  ' } });

    const buttons = screen.getAllByRole('button');
    const loupeButton = buttons[0];

    fireEvent.click(loupeButton);

    expect(fetchWeatherAction).toHaveBeenCalledWith({
      cityName: 'London',
      stateName: 'ENG',
      countryName: 'UK',
    });

    expect(toastErrorMock).not.toHaveBeenCalledWith('No such city');
  });

  it('should show "No such city" when unwrap rejects', async () => {
    (fetchWeatherAction as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        () => ({
          unwrap: () => Promise.reject(new Error('fail')),
        })
    );

    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter city/i), { target: { value: 'Nowhere' } });

    const buttons = screen.getAllByRole('button');
    const loupeButton = buttons[0];

    fireEvent.click(loupeButton);

    await Promise.resolve();

    expect(toastErrorMock).toHaveBeenCalledWith('No such city');
  });

  it('should trigger search on Enter key', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    const cityInput = screen.getByPlaceholderText(/Enter city/i);
    fireEvent.change(cityInput, { target: { value: 'Paris' } });

    fireEvent.keyDown(cityInput, { key: 'Enter' });

    expect(fetchWeatherAction).toHaveBeenCalledWith({
      cityName: 'Paris',
      stateName: '',
      countryName: '',
    });
  });

  it('should have correct GitHub link (href + target)', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    const link = screen.getByRole('link', { name: /support project/i });

    expect(link).toHaveAttribute('href', 'https://github.com/Churina-Margaery/weather');
    expect(link).toHaveAttribute('target', '_blank');
  });
});