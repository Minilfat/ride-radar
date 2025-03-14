import React, { useEffect } from 'react';

import * as styles from './app.module.scss';
import { Filters } from './components/Filters';
import { HSLMap } from './components/Map';
import { StatusIndicator } from './components/StatusIndicator';
import { useAppDispatch, useAppSelector } from './hooks/store';
import {
  closeConnection,
  initConnection,
  startBufferedUpdates,
  stopBufferedUpdates,
} from './store/mqttSlice';

function App() {
  const dispatch = useAppDispatch();
  const connectionStatus = useAppSelector(({ mqtt }) => mqtt.connectionStatus);

  useEffect(() => {
    dispatch(initConnection());
    return () => {
      dispatch(closeConnection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      dispatch(startBufferedUpdates());
    }

    return () => {
      dispatch(stopBufferedUpdates());
    };
  }, [connectionStatus, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div>
          <h2 className={styles.header}>RideRadar</h2>
          <p className={styles.description}>
            Track buses, trains, and more in real time with interactive
            filtering in the HSL area
          </p>
        </div>
        <StatusIndicator isConnected={connectionStatus === 'connected'} />
      </div>

      <div className={styles.filters}>
        <Filters />
      </div>

      <div className={styles.map}>
        <HSLMap />
      </div>
    </div>
  );
}

export default App;
