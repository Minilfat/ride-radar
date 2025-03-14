import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import type { Feature, Polygon } from 'geojson';
import type { LatLngLiteral } from 'leaflet';

import type { TransportMode } from '../consts';
import { getBoundingPolygon } from '../utils';

export interface FiltersState {
  radiusKm: number;
  transportMode: TransportMode;
  route: string;
  userPolygon: Feature<Polygon> | null;
  userPosition: LatLngLiteral | null;
  useCurrentLocation: boolean;
}

const HelsinkiCenter: LatLngLiteral = {
  lat: 60.1710688,
  lng: 24.9414841,
};

const initialState: FiltersState = {
  radiusKm: 2,
  transportMode: 'bus',
  route: '',
  userPolygon: getBoundingPolygon({
    lat: HelsinkiCenter.lat,
    lon: HelsinkiCenter.lng,
    radiusKm: 2,
  }),
  userPosition: HelsinkiCenter,
  useCurrentLocation: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setRadius: (state, action: PayloadAction<number>) => {
      state.radiusKm = action.payload;
    },
    setTransportMode: (state, action: PayloadAction<TransportMode>) => {
      state.transportMode = action.payload;
    },
    setUserPosition: (state, action: PayloadAction<LatLngLiteral | null>) => {
      state.userPosition = action.payload;
    },
    setRoute: (state, action: PayloadAction<string>) => {
      state.route = action.payload;
    },
    setUseCurrentLocation: (state, action: PayloadAction<boolean>) => {
      state.useCurrentLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        filtersSlice.actions.setRadius,
        filtersSlice.actions.setUserPosition,
      ),
      (state) => {
        if (state.userPosition) {
          const { lat, lng } = state.userPosition;
          state.userPolygon = getBoundingPolygon({
            lat,
            lon: lng,
            radiusKm: state.radiusKm,
          });
        }
      },
    );
  },
});

export const {
  setRadius,

  setTransportMode,
  setUserPosition,
  setRoute,
  setUseCurrentLocation,
} = filtersSlice.actions;

export default filtersSlice.reducer;
