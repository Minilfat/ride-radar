import type { TransportMode } from './consts';

export type VehiclePosition = {
  id: string;
  desi: string;
  lat: number;
  long: number;
  transportMode: TransportMode;
  receivedAt: number;
};

export type MqttConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'reconnecting';
