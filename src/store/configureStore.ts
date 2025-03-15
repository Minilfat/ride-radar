import { combineReducers, configureStore } from '@reduxjs/toolkit';

import filtersReducer from './filtersSlice';
import { mqttMiddleware } from './mqttMiddleware';
import mqttReducer from './mqttSlice';

const rootReducer = combineReducers({
  mqtt: mqttReducer,
  filters: filtersReducer,
});

console.log('process.env.HSL_MQTT_HOST as:', process.env.HSL_MQTT_HOST);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      mqttMiddleware(process.env.HSL_MQTT_HOST as string),
    ),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
