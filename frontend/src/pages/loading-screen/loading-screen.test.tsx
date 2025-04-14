import { render } from '@testing-library/react';
import { LoadingScreen } from './loading-screen';

describe('LoadingScreen', () => {
  it('should display loading text', () => {
    const { getByTestId } = render(
      <LoadingScreen />
    );
    expect(getByTestId('loader-container')).toBeInTheDocument();
  });
});