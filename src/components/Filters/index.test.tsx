import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  FiltersState,
  initialState,
  //   initialState,
  setRadius,
  setRoute,
  setTransportMode,
  setUseCurrentLocation,
} from '../../store/filtersSlice';
import { renderWithProviders } from '../../utils/test-utils';
import { Filters } from '.';
import { RootState } from '../../store/configureStore';

describe('Filters Component', () => {
  it('renders correctly', () => {
    renderWithProviders(<Filters />);
    expect(screen.getByText(/Select transport type:/i)).toBeInTheDocument();
    expect(screen.getByText(/Show within:/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by route number:/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Use my current location/i),
    ).toBeInTheDocument();
  });

  it('updates selected transport mode', async () => {
    const { store } = renderWithProviders(<Filters />, {
      preloadedState: { filters: { ...initialState, transportMode: 'bus' } },
    });

    const tramRadio = screen.getByLabelText('tram');
    await userEvent.click(tramRadio);

    expect(store.getState().filters.transportMode).toBe('tram');
  });

  it('changes radius value', () => {
    const { store } = renderWithProviders(<Filters />, {
      preloadedState: { filters: { ...initialState, radiusKm: 3 } },
    });

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 4 } });

    expect(store.getState().filters.radiusKm).toBe(4);
  });

  it('allows entering a route number', async () => {
    const { store } = renderWithProviders(<Filters />);
    const input = screen.getByPlaceholderText('E.g. M1');
    await userEvent.type(input, 'M2');

    expect(store.getState().filters.route).toBe('M2');
  });

  it('requests user location and disabled drag', async () => {
    const { store } = renderWithProviders(<Filters />, {
      preloadedState: {
        filters: { ...initialState, useCurrentLocation: false },
      },
    });

    const getCurrentPositionMock = jest.fn().mockResolvedValue({
      position: {
        coords: { latitude: 1, longitude: 1 },
      },
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: getCurrentPositionMock,
      },
    });

    const dragLocation = screen.getByLabelText(
      /Drag the marker to set a location on the map/i,
    );
    const useMyLocation = screen.getByLabelText(/Use my current location/i);

    expect(dragLocation).toBeChecked();
    expect(useMyLocation).not.toBeChecked();

    await userEvent.click(useMyLocation);

    expect(dragLocation).not.toBeChecked();
    expect(useMyLocation).toBeChecked();

    expect(store.getState().filters.useCurrentLocation).toBe(true);
  });
});
