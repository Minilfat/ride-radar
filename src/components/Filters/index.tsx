import React, { useEffect, useState } from 'react';

import { TRANSPORT_MODES, TransportMode } from '../../consts';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import BusIcon from '../../icons/bus.svg';
import MetroIcon from '../../icons/metro.svg';
import TrainIcon from '../../icons/train.svg';
import TramIcon from '../../icons/tram.svg';
import {
  setRadius,
  setRoute,
  setTransportMode,
  setUseCurrentLocation,
  setUserPosition,
} from '../../store/filtersSlice';
import { addTopic, removeTopics } from '../../store/mqttSlice';
import { constructTopic } from '../../utils';
import * as styles from './styles.module.scss';

const TRANSPORT_ICON: Record<
  TransportMode,
  React.ReactElement<React.SVGProps<SVGSVGElement>>
> = {
  bus: <BusIcon height={40} width={40} />,
  train: <TrainIcon height={40} width={40} />,
  metro: <MetroIcon height={40} width={40} />,
  tram: <TramIcon height={40} width={40} />,
};

export const Filters = () => {
  const [deniedLocation, setDeniedLocation] = useState(false);

  const {
    topics: currentTopics,
    connectionStatus,
    vehiclesCount,
  } = useAppSelector((state) => state.mqtt);
  const { transportMode, radiusKm, route, useCurrentLocation } = useAppSelector(
    (state) => state.filters,
  );

  const dispatch = useAppDispatch();

  const onSetRadius = (km: number) => {
    dispatch(setRadius(km));
  };

  const onSelectTransportMode = (mode: TransportMode) => {
    dispatch(setTransportMode(mode));
  };

  const onSetRoute = (route: string) => {
    dispatch(setRoute(route));
  };

  const onToggleUseLocation = () => {
    dispatch(setUseCurrentLocation(!useCurrentLocation));
  };

  useEffect(() => {
    if (connectionStatus === 'connected') {
      dispatch(removeTopics(currentTopics));
      dispatch(addTopic(constructTopic(transportMode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transportMode, connectionStatus]);

  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setUserPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }),
          );

          dispatch(setUseCurrentLocation(true));
        },
        (error) => {
          setDeniedLocation(true);
          dispatch(setUseCurrentLocation(false));
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true },
      );
    }
  }, [dispatch, useCurrentLocation]);

  return (
    <div className={styles.filterContainer}>
      <div>
        <span className={styles.label}>Select transport type:</span>
        <div className={styles.radioGroup}>
          {TRANSPORT_MODES.map((type) => (
            <label key={type} className={styles.radioLabel}>
              <input
                type="radio"
                name="transportType"
                value={type}
                checked={transportMode === type}
                onChange={() => onSelectTransportMode(type)}
              />
              {TRANSPORT_ICON[type]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className={styles.label}>Show within:</span>
        <div className={styles.rangeContainer}>
          <input
            type="range"
            min="2"
            max="10"
            value={radiusKm}
            onChange={(e) => onSetRadius(Number(e.target.value))}
          />
          <span>{radiusKm}km</span>
        </div>
      </div>

      <div>
        <span className={styles.label}>Filter by route number:</span>
        <input
          className={styles.textInput}
          type="text"
          placeholder="E.g. M1"
          value={route}
          onChange={(e) => onSetRoute(e.target.value)}
        />
      </div>

      <div className={styles.checkbox}>
        <input
          id="switch"
          name="switch"
          disabled={deniedLocation}
          type="checkbox"
          checked={useCurrentLocation}
          onChange={() => onToggleUseLocation()}
        />
        <label htmlFor="switch">Use my current location</label>

        {deniedLocation && (
          <span className={styles.errorLabel}>
            Error getting user&apos;s location
          </span>
        )}
      </div>

      <span className={styles.label}>or</span>

      <div className={styles.checkbox}>
        <input
          id="switch-map"
          name="switch-map"
          type="checkbox"
          checked={!useCurrentLocation}
          onChange={() => onToggleUseLocation()}
        />
        <label htmlFor="switch">
          Drag the marker to set a location on the map
        </label>
      </div>

      <span className={styles.divider}></span>

      <div className={styles.totalInfo}>
        <div className={styles.label}>Number of live tracked vehicles</div>
        <div className={styles.total}>{vehiclesCount}</div>
      </div>

      <div className={styles.caption}>
        Note: If you&apos;re tracking a train or a metro, each coach appears as
        a separate vehicle.
      </div>
    </div>
  );
};
