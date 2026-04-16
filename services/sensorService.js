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

const USE_MOCK = true;

// 🔹 MOCK stream (simulated updates)
export const subscribeToSensor = (callback) => {
  if (USE_MOCK) {
    const interval = setInterval(() => {
      callback({
        value: Math.random() * 100,
        timestamp: new Date().toISOString(),
        source: "mock",
      });
    }, 3000);

    // return cleanup function (important)
    return () => clearInterval(interval);
  }

  // 🔹 FIREBASE real-time listener
  const ref = doc(db, "sensors", "latest");

  const unsubscribe = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;

    const data = snap.data();

    callback({
      value: data.value,
      timestamp: data.timestamp,
      source: "firebase",
    });
  });

  return unsubscribe;
};