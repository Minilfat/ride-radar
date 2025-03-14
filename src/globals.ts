export const globals = {
  hslSubscriptionToken: process.env.HSL_API_SUBSCRIPTION_TOKEN || '',
  hslMapCdn: 'https://cdn.digitransit.fi/map/v3/hsl-map-en/',
  hslMqttHost: process.env.HSL_MQTT_HOST || '',
  defaultMapZoom: 12,
} as const;
