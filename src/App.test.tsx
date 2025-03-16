import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import { rootReducer } from './store/configureStore';

const testStore = configureStore({ reducer: rootReducer });

it('renders app', () => {
  render(
    <Provider store={testStore}>
      <App />
    </Provider>,
  );

  const appName = screen.getByRole('heading', {
    name: 'RideRadar',
  });
  expect(appName).toBeInTheDocument();
});
