// const USE_MOCK = true;

// export const getSensorData = async () => {
//   if (USE_MOCK) {
//     // Mock data (for development)
//     return {
//       value: Math.random() * 100,
//       timestamp: new Date().toISOString(),
//     };
//   }

//   // Real API call (future sensor)
//   try {
//     const response = await fetch('https://your-api.com/sensor/latest');
//     const json = await response.json();

//     return {
//       value: json.value,
//       timestamp: json.timestamp,
//     };

//   } catch (error) {
//     console.error('Sensor fetch error:', error);
//     return null;
//   }
// };


import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const USE_MOCK = false;

export const subscribeToSensor = (callback) => {
  if (USE_MOCK) {
    const interval = setInterval(() => {
      callback({
        value: Math.random() * 100,
        timestamp: new Date().toISOString(),
        source: "mock",
      });
    }, 3000);

    return () => clearInterval(interval);
  }

  // 🔹 LOCAL FLASK API POLLING
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://10.0.0.212:5000/api/data");
      const data = await res.json();
      console.log(data);

      // adapt to your API format
      callback({
        value: data.moisture, // or whatever field you use
        voltage: data.voltage,
        rssi: data.rssi,
        timestamp: data.timestamp || new Date().toISOString(),
        source: "local-api",
      });

    } catch (err) {
      console.error("Sensor API error:", err);
    }
  }, 3000);

  // cleanup function
  return () => clearInterval(interval);
};