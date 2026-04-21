import crypto from 'crypto';

export function generateDownloadToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateMapJSON(spots) {
  // Return a Google My Maps compatible format (simplified)
  return {
    type: 'FeatureCollection',
    features: spots.map((spot) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [spot.longitude, spot.latitude],
      },
      properties: {
        name: spot.name,
        description: spot.description,
        category: spot.category,
        localTip: spot.localTip,
      },
    })),
  };
}
