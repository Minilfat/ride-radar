jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(() => '<div>Mocked MapContainer</div>'),
  TileLayer: jest.fn(() => '<div>Mocked TileLayer</div>'),
  Marker: jest.fn(() => '<div>Mocked Marker</div>'),
  Polygon: jest.fn(() => '<div>Mocked Polygon</div>'),
}));
