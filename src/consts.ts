export const TRANSPORT_MODES = ['bus', 'tram', 'train', 'metro'] as const;
export type TransportMode = (typeof TRANSPORT_MODES)[number];
