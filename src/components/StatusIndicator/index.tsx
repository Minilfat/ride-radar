import React from 'react';

import * as styles from './styles.module.scss';

interface StatusProps {
  isConnected: boolean;
}

export const StatusIndicator: React.FC<StatusProps> = ({ isConnected }) => {
  return (
    <div
      className={`${styles['status-indicator']} ${isConnected ? styles.connected : styles.disconnected}`}
    >
      <span className={styles.caption}>
        {isConnected ? 'HSL Server Connected' : 'HSL Server Disconnected'}
      </span>
      <div className={styles.dot}></div>
    </div>
  );
};
