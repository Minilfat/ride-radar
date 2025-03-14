import type { Units } from '@turf/turf';
import * as turf from '@turf/turf';
import type { Feature, Point, Polygon } from 'geojson';
import type { LatLngTuple } from 'leaflet';

import type { TransportMode } from '../consts';
import { TRANSPORT_MODES } from '../consts';
import { VehiclePosition } from '../types';

// payload type: https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-payload
export function parseVPMessage(
  payload: string,
  transportMode: TransportMode | null,
): VehiclePosition | null {
  if (!transportMode) return null;

  try {
    const data = JSON.parse(payload);

    if (!data.VP || typeof data.VP !== 'object') {
      console.warn('Invalid data format');
      return null;
    }

    const vp: VehiclePosition = {
      id: `${data.VP.oper}/${data.VP.veh}`, // seems like train coaches are show separately
      desi: String(data.VP.desi),
      lat: Number(data.VP.lat),
      long: Number(data.VP.long),
      transportMode,
      receivedAt: Date.now(),
    };

    return vp;
  } catch (error) {
    console.error('Failed to parse vehicle position:', error);
  }
  return null;
}

// https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-topic
const TOPIC_REGEX = /^\/hfp\/v2\/journey\/ongoing\/vp\/([^/]+)/;

export function extractTransportMode(topic: string): TransportMode | null {
  try {
    const match = topic.match(TOPIC_REGEX);
    return match && isValidTransportMode(match[1]) ? match[1] : null;
  } catch (error) {
    console.error('Failed to parse transport mode from topic:', error);
  }
  return null;
}

export function constructTopic(transportMode: TransportMode) {
  // /<prefix>/<version>/<journey_type>/<temporal_type>/<event_type>/<transport_mode>/<operator_id>/<vehicle_number>/<route_id>/<direction_id>/<headsign>/<start_time>/<next_stop>/<geohash_level>/<geohash>/<sid>/#
  return `/hfp/v2/journey/ongoing/vp/${transportMode}/+/+/+/+/+/+/+/4/#`;
}

export function isValidTransportMode(mode: string): mode is TransportMode {
  return TRANSPORT_MODES.includes(mode as TransportMode);
}

export function getBoundingPolygon({
  lat,
  lon,
  radiusKm,
}: {
  lat: number;
  lon: number;
  radiusKm: number;
}) {
  const center = turf.point([lon, lat]);
  const options = { steps: 10, units: 'kilometers' as Units };
  return turf.circle(center, radiusKm, options);
}

// GEOJson position - [longitude, latitude]
// react leaflet - LatLngTuple :mindblown
export function getLeafletPosition(circle: Feature<Polygon>) {
  return circle.geometry.coordinates[0].map((position) => {
    return [position[1], position[0]] as LatLngTuple;
  });
}

export const isPointInsidePolygon = ({
  lat,
  lon,
  polygon,
}: {
  lat: number;
  lon: number;
  polygon: Feature<Polygon>;
}): boolean => {
  const point: Feature<Point> = turf.point([lon, lat]);
  return turf.booleanPointInPolygon(point, polygon);
};
