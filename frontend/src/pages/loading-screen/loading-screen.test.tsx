import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LoadingScreen } from './loading-screen';
import { store } from '../../store';

vi.mock('../../store/main-process/selectors', () => ({
  getIsDarkTheme: vi.fn(),
}));

vi.mock('../../store', async () => {
  const actual = await vi.importActual<any>('../../store');
  return {
    ...actual,
    useAppSelector: () => false,
  };
});

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component container', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    expect(getByTestId('loader-container')).toBeInTheDocument();
  });

  it('should render header base elements', () => {
    render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(screen.getByText(/weather/i)).toBeInTheDocument();
  });

  it('should render 3 disabled search inputs (equivalence: all inputs disabled)', () => {
    render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    const inputs = screen.getAllByRole('searchbox');
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => expect(input).toBeDisabled());
  });

  it('should render 2 disabled header buttons (loupe and theme switch)', () => {
    render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    const buttons = screen.getAllByRole('button');
    const disabledButtons = buttons.filter(
      (btn) => (btn as HTMLButtonElement).disabled
    );

    expect(disabledButtons).toHaveLength(2);
  });

  it('should render correct GitHub support link', () => {
    render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    const link = screen.getByRole('link', { name: /support project/i });

    expect(link).toHaveAttribute(
      'href',
      'https://github.com/Churina-Margaery/weather'
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should render overview skeleton blocks in correct amounts', () => {
    const { container } = render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    );

    expect(screen.getByText(/Today Overview/i)).toBeInTheDocument();

    expect(container.querySelectorAll('.loading__overview').length).toBe(1);

    expect(container.querySelectorAll('.loading__overview-small-item').length).toBe(6);

    expect(container.querySelectorAll('.loading__overview-forecast').length).toBe(1);
  });
});