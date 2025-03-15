import { Middleware } from '@reduxjs/toolkit';
import mqtt, { MqttClient } from 'mqtt';

import { VehiclePosition } from '../types';
import {
  extractTransportMode,
  isPointInsidePolygon,
  parseVPMessage,
} from '../utils';
import type { RootState } from './configureStore';
import {
  addTopic,
  initConnection,
  removeTopics,
  setVehiclePositions,
  startBufferedUpdates,
  stopBufferedUpdates,
  updateConnectionStatus,
} from './mqttSlice';

const RECONNECT_TIMEOUT_MS = 5000; // 5s
const STORE_UPDATES_MS = 1000; // 1s
const EXPIRATION_TIME_MS = 2 * 60 * 1000; // 2mins

export const mqttMiddleware = (
  mqttHost: string,
): Middleware<unknown, RootState> => {
  let client: MqttClient | null;
  let intervalId: NodeJS.Timeout | null = null;
  const messageBuffer = new Map<string, VehiclePosition>();

  return (store) => (next) => (action) => {
    if (initConnection.match(action)) {
      client = mqtt.connect(mqttHost, {
        reconnectPeriod: RECONNECT_TIMEOUT_MS,
      });

      client.on('connect', () => {
        store.dispatch(updateConnectionStatus('connected'));
      });

      client.on('error', (err) => {
        console.error('Connection error: ', err);
        store.dispatch(updateConnectionStatus('disconnected'));
        client?.end(true);
        client = null;
      });

      client.on('reconnect', () => {
        store.dispatch(updateConnectionStatus('reconnecting'));
      });

      client.on('message', (topic, message) => {
        const mode = extractTransportMode(topic);
        const vp = parseVPMessage(message.toString(), mode);
        if (vp) messageBuffer.set(vp.id, vp);
      });
    }

    if (addTopic.match(action)) {
      const subscribedTopics = store.getState().mqtt.topics;
      if (!subscribedTopics.includes(action.payload)) {
        client?.subscribe(action.payload, (err) => {
          if (err) {
            console.log(`Failed to subscribe to topic: ${action.payload}`);
          }
        });
      }
    }

    if (removeTopics.match(action)) {
      action.payload.forEach((topic) => {
        client?.unsubscribe(topic, (err) => {
          if (err) {
            console.log(`Failed to unsubscribe from topic: ${topic}`);
          }
        });
      });
      messageBuffer.clear();
    }

    if (startBufferedUpdates.match(action)) {
      if (!intervalId) {
        intervalId = setInterval(() => {
          const { userPolygon, route, transportMode } =
            store.getState().filters;
          const filteredVps = [...messageBuffer].reduce<VehiclePosition[]>(
            (acc, [, vp]) => {
              if (userPolygon && vp) {
                const isInside = isPointInsidePolygon({
                  lat: vp.lat,
                  lon: vp.long,
                  polygon: userPolygon,
                });

                const recentlyUpdated =
                  vp.receivedAt + EXPIRATION_TIME_MS > Date.now();

                const matchesRoute = route
                  ? vp.desi.toLowerCase().includes(route.toLowerCase())
                  : true;

                const sameType = transportMode === vp.transportMode;

                if (isInside && recentlyUpdated && matchesRoute && sameType) {
                  acc.push(vp);
                }
              }

              return acc;
            },
            [],
          );

          store.dispatch(setVehiclePositions(filteredVps));
        }, STORE_UPDATES_MS);
      }
    }

    if (stopBufferedUpdates.match(action)) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        if (messageBuffer.size > 0) messageBuffer.clear();
      }
    }

    return next(action);
  };
};
