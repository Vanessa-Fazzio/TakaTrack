const API_BASE_URL = 'http://localhost:5555';

export const collectionPointsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/collection_points`);
    return response.json();
  },

  create: async (name, latitude, longitude) => {
    const response = await fetch(`${API_BASE_URL}/collection_points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, latitude, longitude })
    });
    return response.json();
  }
};

export const collectorAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/collector`);
    return response.json();
  },

  updateLocation: async (latitude, longitude) => {
    const response = await fetch(`${API_BASE_URL}/collector`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude })
    });
    return response.json();
  }
};
