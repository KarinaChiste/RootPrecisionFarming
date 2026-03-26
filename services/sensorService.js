const USE_MOCK = true;

export const getSensorData = async () => {
  if (USE_MOCK) {
    // Mock data (for development)
    return {
      value: Math.random() * 100,
      timestamp: new Date().toISOString(),
    };
  }

  // Real API call (future sensor)
  try {
    const response = await fetch('https://your-api.com/sensor/latest');
    const json = await response.json();

    return {
      value: json.value,
      timestamp: json.timestamp,
    };

  } catch (error) {
    console.error('Sensor fetch error:', error);
    return null;
  }
};