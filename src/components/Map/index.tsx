import 'leaflet/dist/leaflet.css';

import { Map } from 'leaflet';
import L from 'leaflet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import { globals } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { setUserPosition } from '../../store/filtersSlice';
import {
  setVehiclePositions,
  startBufferedUpdates,
  stopBufferedUpdates,
} from '../../store/mqttSlice';
import { getLeafletPosition } from '../../utils';
import { getMyPositionIcon, getTransportIcon } from '../Markers';
import { HSL_POLYGON } from './area';
import * as styles from './styles.module.scss';

const HSL_AREA_BOUNDS = L.latLngBounds(HSL_POLYGON);

const ZoomHandler = ({
  setZoomLevel,
}: {
  setZoomLevel: (level: number) => void;
}) => {
  useMapEvents({
    zoomend: (e) => setZoomLevel(e.target.getZoom()),
  });
  return null;
};

export const HSLMap = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(globals.defaultMapZoom);

  const dispatch = useAppDispatch();

  const { vehiclePositions } = useAppSelector((s) => s.mqtt);
  const { userPosition, userPolygon, useCurrentLocation } = useAppSelector(
    (s) => s.filters,
  );

  const markerRef = useRef<L.Marker | null>(null);
  const eventHandlers = useMemo(
    () => ({
      dragstart() {
        dispatch(stopBufferedUpdates());
      },
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          const { lat, lng } = marker.getLatLng();

          dispatch(setVehiclePositions([]));
          dispatch(setUserPosition({ lat, lng }));
          dispatch(startBufferedUpdates());
        }
      },
    }),
    [dispatch],
  );

  useEffect(() => {
    if (map) {
      const zoomLevel = map.getBoundsZoom(HSL_AREA_BOUNDS);
      map.options.minZoom = zoomLevel;
    }
  }, [map]);

  return (
    <MapContainer
      ref={setMap}
      className={styles.map}
      center={userPosition ?? undefined}
      zoom={globals.defaultMapZoom}
      maxBounds={HSL_AREA_BOUNDS}
      maxBoundsViscosity={1.0}
      wheelDebounceTime={200}
      wheelPxPerZoomLevel={200}
    >
      <ZoomHandler setZoomLevel={setZoomLevel} />
      <TileLayer
        url={`${globals.hslMapCdn}{z}/{x}/{y}{r}.png?digitransit-subscription-key=${globals.hslSubscriptionToken}`}
        attribution="&copy; Copyright HSL"
      />
      <Polygon
        interactive={false}
        positions={HSL_POLYGON}
        color="blue"
        weight={2}
        fillOpacity={0}
      />
      {userPolygon ? (
        <Polygon
          interactive={false}
          positions={getLeafletPosition(userPolygon)}
          color="red"
          weight={1}
          fillOpacity={0.08}
        />
      ) : null}
      {userPosition ? (
        <Marker
          interactive={!useCurrentLocation}
          ref={markerRef}
          position={userPosition}
          icon={getMyPositionIcon()}
          draggable={!useCurrentLocation}
          eventHandlers={eventHandlers}
          zIndexOffset={100}
        />
      ) : null}
      {Object.entries(vehiclePositions).map(([vehicleId, vp]) => {
        return (
          <Marker
            key={vehicleId}
            position={{
              lat: vp.lat,
              lng: vp.long,
            }}
            icon={getTransportIcon(vp.transportMode, vp.desi, zoomLevel)}
          />
        );
      })}
    </MapContainer>
  );
};
