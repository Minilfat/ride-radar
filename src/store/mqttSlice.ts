import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MqttConnectionStatus, VehiclePosition } from '../types';

export interface MqttState {
  topics: string[];
  vehiclePositions: Record<string, VehiclePosition>;
  connectionStatus: MqttConnectionStatus;
  vehiclesCount: number;
}

export const initialState: MqttState = {
  topics: [],
  vehiclePositions: {},
  connectionStatus: 'disconnected',
  vehiclesCount: 0,
};

const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    addTopic: (state, action: PayloadAction<string>) => {
      if (!state.topics.includes(action.payload)) {
        state.topics.push(action.payload);
      }
    },
    removeTopics: (state, action: PayloadAction<string[]>) => {
      state.vehiclePositions = {};
      state.topics = state.topics.filter(
        (topic) => !action.payload.includes(topic),
      );
    },
    setVehiclePositions: (
      state,
      action: PayloadAction<Array<VehiclePosition>>,
    ) => {
      state.vehiclePositions = {};
      action.payload.forEach((vp) => {
        state.vehiclePositions[vp.id] = vp;
      });
      state.vehiclesCount = action.payload.length;
    },
    updateConnectionStatus: (
      state,
      action: PayloadAction<MqttConnectionStatus>,
    ) => {
      state.connectionStatus = action.payload;
    },

    initConnection: (state) => state,
    closeConnection: (state) => state,
    startBufferedUpdates: (state) => state,
    stopBufferedUpdates: (state) => state,
  },
});

export const {
  addTopic,
  removeTopics,
  setVehiclePositions,
  initConnection,
  closeConnection,
  updateConnectionStatus,
  startBufferedUpdates,
  stopBufferedUpdates,
} = mqttSlice.actions;

export default mqttSlice.reducer;
