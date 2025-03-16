import { screen } from '@testing-library/react';
import React from 'react';

import App from './App';
import { renderWithProviders } from './utils/test-utils';

it('renders app', () => {
  renderWithProviders(<App />);

  const appName = screen.getByRole('heading', {
    name: 'RideRadar asd',
  });
  expect(appName).toBeInTheDocument();
});
