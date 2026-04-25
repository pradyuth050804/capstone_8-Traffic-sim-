/**
 * Traffic Prediction API Service
 *
 * Connects the frontend simulation to the Flask ML backend.
 * Sends real-world traffic features (from Google Maps data model)
 * and receives predicted congestion index (0–1).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Input payload matching the Flask /predict-traffic schema */
export interface TrafficPredictionInput {
  road_id: string;
  hour: number;
  day_of_week: number;
  is_weekend: number;
  distance: number;
  duration: number;
  duration_in_traffic: number;
}

/** Response from the Flask /predict-traffic endpoint */
export interface TrafficPredictionResponse {
  predicted_congestion: number;
  status: string;
}

/**
 * Fetch congestion prediction from the ML backend.
 * Returns predicted_congestion (0–1) or null on failure.
 */
export async function predictTraffic(
  input: TrafficPredictionInput
): Promise<TrafficPredictionResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-traffic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return (await response.json()) as TrafficPredictionResponse;
  } catch (error) {
    console.error("Failed to reach traffic prediction API:", error);
    return null;
  }
}

/**
 * Check if the ML backend is reachable.
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    if (!response.ok) return false;
    const data = await response.json();
    return data.model_loaded === true;
  } catch {
    return false;
  }
}

/**
 * Road segments aligned with the Yelahanka data collector.
 * Each entry carries realistic distance/duration estimates
 * so the frontend can request predictions per-road.
 */
export const YELAHANKA_ROADS = [
  { road_id: "YLK_KIA_01", name: "Yelahanka → KIA",              distance: 35000, baseDuration: 2400 },
  { road_id: "YLK_KIA_02", name: "KIA → Yelahanka",              distance: 35000, baseDuration: 2400 },
  { road_id: "YLK_PU_01",  name: "Yelahanka → Presidency Univ",  distance: 12000, baseDuration: 1200 },
  { road_id: "YLK_PU_02",  name: "Presidency Univ → Yelahanka",  distance: 12000, baseDuration: 1200 },
  { road_id: "YLK_JK_01",  name: "Yelahanka → Jakkur",           distance: 5000,  baseDuration: 600 },
  { road_id: "YLK_JK_02",  name: "Jakkur → Yelahanka",           distance: 5000,  baseDuration: 600 },
  { road_id: "YLK_BG_01",  name: "Yelahanka → Bagalur",          distance: 12000, baseDuration: 1080 },
  { road_id: "YLK_BG_02",  name: "Bagalur → Yelahanka",          distance: 12000, baseDuration: 1080 },
];

/**
 * Build a prediction payload from the current time and a traffic-density slider.
 * `trafficDensity` (0–100) scales duration_in_traffic above base duration.
 */
export function buildPredictionPayload(
  road_id: string,
  distance: number,
  duration: number,
  targetHour?: number
): TrafficPredictionInput {
  const now = new Date();
  const hour = targetHour !== undefined ? targetHour : now.getHours();
  const day_of_week = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0 … Sun=6
  const is_weekend = day_of_week >= 5 ? 1 : 0;

  // Since we dropped manual density sliders, we give the model a generic +20% traffic approximation
  const duration_in_traffic = Math.round(duration * 1.2);

  return {
    road_id,
    hour,
    day_of_week,
    is_weekend,
    distance,
    duration,
    duration_in_traffic,
  };
}
