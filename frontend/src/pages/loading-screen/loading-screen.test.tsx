import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { LoadingScreen } from './loading-screen';
import { store } from '../../store';
describe('LoadingScreen', () => {
  it('should display loading text', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>

    );
    expect(getByTestId('loader-container')).toBeInTheDocument();
  });
});