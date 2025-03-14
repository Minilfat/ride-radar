import L from 'leaflet';

import { TransportMode } from '../../consts';
import PositionIcon from '../../icons/position.svg?url';
import * as styles from './styles.module.scss';

const ICON_SIZE = {
  L: 40,
  M: 32,
  S: 16,
  XS: 8,
};

const FONT_SIZE = {
  L: 14,
  M: 12,
  S: 6,
  XS: 0,
};

const getIconSize = (zoom: number) => {
  return zoom >= 9 && zoom <= 10
    ? 'XS'
    : zoom >= 11 && zoom <= 12
      ? 'S'
      : zoom >= 13 && zoom <= 15
        ? 'M'
        : 'L';
};

const getIcon = (label: string, color: string, zoom: number) => {
  const iconSize = getIconSize(zoom);
  return L.divIcon({
    className: styles[`icon-${iconSize}`],
    html: `<span style="background-color: ${color}; font-size: ${FONT_SIZE[iconSize]}px;">${label}</span>`,
    iconSize: [ICON_SIZE[iconSize], ICON_SIZE[iconSize]],
    iconAnchor: [ICON_SIZE[iconSize] / 2, ICON_SIZE[iconSize] / 2],
  });
};

export const getTransportIcon = (
  mode: TransportMode,
  desi: string,
  zoom: number,
) => {
  switch (mode) {
    case 'bus':
      return getIcon(desi, 'rgb(0, 122, 201)', zoom);
    case 'metro':
      return getIcon(desi, '#CA4000', zoom);
    case 'train':
      return getIcon(desi, 'rgb(140, 71, 153)', zoom);
    case 'tram':
      return getIcon(desi, 'rgb(0, 129, 81)', zoom);
    default:
      return getIcon(':(', 'white', zoom);
  }
};

export const getMyPositionIcon = () => {
  const iconSize = ICON_SIZE['L'];

  return L.icon({
    iconUrl: PositionIcon,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });
};
