import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';
import { SmallCards } from './small-cards';
import { mockData } from '../../utils/mocks';

const testStore = configureStore({
  reducer: {
    main: () => ({ data: mockData }),
  },
});

vi.mock('../../store/main-process/selectors', () => ({
  getInfo: vi.fn(() => mockData),
}));

describe('Small Cards component', () => {

  it('should render component', () => {
    const { getByTestId } = render(
      <Provider store={testStore}>
        <SmallCards />
      </Provider>
    );
    expect(getByTestId('small-cards-container')).toBeInTheDocument();
  })

  it('should display small cards', () => {

    render(
      <Provider store={testStore}>
        <SmallCards />
      </Provider>
    );

    expect(screen.getAllByTestId('small-card-item-container')).toHaveLength(6);
  });

  it('should display correct data', () => {

    const val = new Date(Date()).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    render(
      <Provider store={testStore}>
        <SmallCards />
      </Provider>
    );

    expect(screen.getByText('0 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 km')).toBeInTheDocument();
    expect(screen.getByText('0 hPa')).toBeInTheDocument();
    expect(screen.getByText('0 %')).toBeInTheDocument();
    expect(screen.getByText('0 km/h')).toBeInTheDocument();
    expect(screen.getAllByText(val)).toHaveLength(2);
  });
})
