import { useState, useEffect } from 'react';

interface TelemetryPoint {
  user_id: number;
  lat: number;
  lon: number;
  altitude?: number;
  accel_x?: number;
  accel_y?: number;
  accel_z?: number;
  device_id?: string;
}

export const useSensorTelemetry = (userId: number | undefined) => {
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let interval: any;
    
    // START SENSOR CAPTURE (PWA Behavior)
    const beginCapture = () => {
      setIsCapturing(true);
      
      // 1. Get Coordinates
      navigator.geolocation.getCurrentPosition((pos) => {
        const batch: TelemetryPoint[] = [{
          user_id: userId,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          altitude: pos.coords.altitude || 0,
          // MOCK IMU SENSOR DATA (Using JS comments, not Python ones!)
          accel_x: (Math.random() - 0.5) * 0.1, // Simulated micro-noise
          accel_y: (Math.random() - 0.5) * 0.1,
          accel_z: 9.81 + (Math.random() - 0.5) * 0.1,
          device_id: navigator.userAgent.substring(0, 50)
        }];

        // 2. Transmit to ShramShield Core
        fetch('/api/telemetry/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch)
        }).catch(err => console.error("Telemetry Sync Error:", err));
        
        setIsCapturing(false);
      }, (err) => {
        console.warn("Location permission denied for telemetry:", err);
        setIsCapturing(false);
      }, {
        enableHighAccuracy: true
      });
    };

    // Run every 45s to mimic worker mobility behavior
    interval = setInterval(beginCapture, 45000);
    beginCapture(); // Initial run

    return () => clearInterval(interval);
  }, [userId]);

  return { isCapturing };
};
