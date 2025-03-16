import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import type { AppStore, RootState } from '../store/configureStore';
import { setupStore } from '../store/configureStore';

type ExtendedRenderOptions = RenderOptions & {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
};

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
): RenderResult & {
  store: AppStore;
} {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),

    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
