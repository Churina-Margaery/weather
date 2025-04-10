import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './header';
import { rootReducer } from '../../store/root-reducer';

const testStore = configureStore({
  reducer: {
    main: rootReducer,
  },
});

vi.mock('../../store/main-process/selectors', () => ({
  getIsDarkTheme: vi.fn(),
}));

describe('Header component', () => {
  it('should render component', () => {
    const { getByTestId } = render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );
    expect(getByTestId('header-container')).toBeInTheDocument();
  })

  it('should display data', () => {
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );
    expect(screen.getByText(/weather/i)).toBeInTheDocument();
    expect(screen.getByText(/Support project/i)).toBeInTheDocument();
  })

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
    vi.mock('../../store/main-process/selectors', () => ({
      getIsDarkTheme: vi.fn((state) => state.main.Main.darkTheme),
    }));

    console.log(testStore.getState().main.Main.darkTheme);

    const { rerender } = render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    const themeButton = screen.getByRole('button', { name: /switch mode/i });

    expect(screen.getByRole('img', { name: /switch mode/i })).toHaveAttribute('src', './img/full-moon.svg');

    console.log(testStore.getState().main.Main.darkTheme);

    fireEvent.click(themeButton);

    rerender(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );

    expect(screen.getByRole('img', { name: /switch mode/i })).toHaveAttribute('src', './img/light-moon.svg');
  });
})

