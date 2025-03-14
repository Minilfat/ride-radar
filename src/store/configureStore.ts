import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { globals } from '../globals';
import filtersReducer from './filtersSlice';
import { mqttMiddleware } from './mqttMiddleware';
import mqttReducer from './mqttSlice';

const rootReducer = combineReducers({
  mqtt: mqttReducer,
  filters: filtersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mqttMiddleware(globals.hslMqttHost)),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
