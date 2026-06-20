const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errDetail = `API Request Failed with status ${response.status}`;
      try {
        const err = await response.json();
        if (err.detail) {
          errDetail = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
        } else if (err.message) {
          errDetail = err.message;
        }
      } catch (_) {}
      throw new Error(errDetail);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error on ${path}:`, error);
    throw error;
  }
}

export const api = {
  getHealth: () => request('/health'),
  getHighRiskZones: () => request('/zones/high-risk'),
  getHotspots: () => request('/hotspots'),
  getPatrols: () => request('/patrols'),
  getForecast: () => request('/forecast'),
  getAlerts: () => request('/alerts'),
  predictRisk: (payload) => request('/predict', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
