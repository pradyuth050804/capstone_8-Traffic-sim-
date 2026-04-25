import os
import sys
import time
import requests
import schedule
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

# Load config
load_dotenv()
API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Output file path
OUTPUT_CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)), "real_traffic_data.csv")

# ──────────────────────────────────────────────────────────────────────
# Road segments: Yelahanka ↔ key nearby locations (both directions)
# Coordinates sourced from Google Maps for road-entry points.
#
#   Yelahanka Junction     : 13.1007° N, 77.5963° E
#   KIA (Airport Terminal) : 13.1989° N, 77.7068° E
#   Presidency University  : 13.1060° N, 77.5023° E
#   Jakkur Aerodrome       : 13.0730° N, 77.6115° E
#   Bagalur Cross          : 13.1560° N, 77.6780° E
# ──────────────────────────────────────────────────────────────────────
YELAHANKA_SEGMENTS = [
    # 1–2: Yelahanka ↔ Kempegowda International Airport (~35 km via NH44)
    {"road_id": "YLK_KIA_01", "name": "Yelahanka → KIA",           "origin": "13.1007,77.5963", "destination": "13.1989,77.7068"},
    {"road_id": "YLK_KIA_02", "name": "KIA → Yelahanka",           "origin": "13.1989,77.7068", "destination": "13.1007,77.5963"},

    # 3–4: Yelahanka ↔ Presidency University (~12 km via Bellary Rd)
    {"road_id": "YLK_PU_01",  "name": "Yelahanka → Presidency Univ", "origin": "13.1007,77.5963", "destination": "13.1060,77.5023"},
    {"road_id": "YLK_PU_02",  "name": "Presidency Univ → Yelahanka", "origin": "13.1060,77.5023", "destination": "13.1007,77.5963"},

    # 5–6: Yelahanka ↔ Jakkur Aerodrome (~5 km via Bellary Rd / Jakkur Main Rd)
    {"road_id": "YLK_JK_01",  "name": "Yelahanka → Jakkur",        "origin": "13.1007,77.5963", "destination": "13.0730,77.6115"},
    {"road_id": "YLK_JK_02",  "name": "Jakkur → Yelahanka",        "origin": "13.0730,77.6115", "destination": "13.1007,77.5963"},

    # 7–8: Yelahanka ↔ Bagalur (~12 km via Bagalur Rd)
    {"road_id": "YLK_BG_01",  "name": "Yelahanka → Bagalur",       "origin": "13.1007,77.5963", "destination": "13.1560,77.6780"},
    {"road_id": "YLK_BG_02",  "name": "Bagalur → Yelahanka",       "origin": "13.1560,77.6780", "destination": "13.1007,77.5963"},
]

def fetch_traffic_data(origin: str, destination: str, api_key: str):
    """
    Calls Google Distance Matrix API for a single segment.
    Returns: (distance, duration, duration_in_traffic) safely, or None on failure.
    """
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin,
        "destinations": destination,
        "departure_time": "now", # Required to get duration_in_traffic
        "key": api_key,
        "traffic_model": "best_guess"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "OK":
            element = data["rows"][0]["elements"][0]
            if element.get("status") == "OK":
                distance = element["distance"]["value"] # in meters
                duration = element["duration"]["value"] # in seconds
                
                # Fetch duration_in_traffic, defaulting to standard duration if missing or no traffic data
                duration_in_traffic = element.get("duration_in_traffic", {}).get("value", duration)
                return distance, duration, duration_in_traffic
            else:
                print(f"API Error for route ({origin} -> {destination}): {element.get('status')}")
                return None
        else:
            print(f"Google Maps API Status Error: {data.get('status')} - {data.get('error_message', '')}")
            return None
    except Exception as e:
        print(f"Network error fetching from Google Maps: {e}")
        return None

def process_and_save_data(test_run=False):
    """
    Iterates through configured segments, fetches real time data, engineers features, and saves.
    """
    print(f"\n--- Starting data collection run at {datetime.now().isoformat()} ---")
    
    if not API_KEY or API_KEY == "your_google_maps_api_key_here":
        print("ABORT: GOOGLE_MAPS_API_KEY is not defined. Cannot run actual collection.")
        print("Please configure .env with a valid API key.")
        # If in test run, we will generate a mock row just to verify pipeline operations
        if not test_run:
            return

    records = []
    
    for segment in YELAHANKA_SEGMENTS:
        # Mock logic if API KEY is missing during test run
        if not API_KEY and test_run:
            import random
            print(f"Mocking data for {segment['road_id']} (No API KEY)...")
            distance = random.randint(1000, 5000)
            duration = random.randint(120, 600)
            duration_in_traffic = duration + random.randint(0, 300)
            result = (distance, duration, duration_in_traffic)
        else:
            result = fetch_traffic_data(segment["origin"], segment["destination"], API_KEY)
        
        if result:
            distance, duration, duration_in_traffic = result
            
            now = datetime.now()
            hour = now.hour
            day_of_week = now.weekday()
            is_weekend = 1 if day_of_week >= 5 else 0
            
            # Congestion Computation
            # Congestion Index = duration_in_traffic / duration
            # Maps 1.0 (no traffic delay) to 0, up to 2.0+ mapped towards 1
            ratio = duration_in_traffic / (duration if duration > 0 else 1)
            raw_congestion = ratio - 1.0
            
            # Normalize bounded between 0 and 1
            congestion_index = max(0.0, min(1.0, raw_congestion))
            
            # Base logic defaults mapping to 1000 capacity
            capacity = 1000 
            vehicle_count = int(congestion_index * capacity * 1.2) + int(capacity * 0.2)
            
            record = {
                "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
                "road_id": segment["road_id"],
                "hour": hour,
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "weather_factor": 1.0, # Placeholder. Can integrate OpenWeatherMap here
                "event_factor": 1.0, # Placeholder
                "vehicle_count": vehicle_count,
                "road_capacity": capacity,
                "distance_m": distance,
                "base_duration_s": duration,
                "traffic_duration_s": duration_in_traffic,
                "congestion_index": round(congestion_index, 4)
            }
            records.append(record)
            print(f"Collected {segment['road_id']} -> Congestion: {record['congestion_index']}")
        
        # Friendly sleep to avoid hitting API rate limits
        time.sleep(1)
        
        if test_run and len(records) >= 3:
            print("Stopping early. Test run limit reached (3 segments).")
            break

    if records:
        new_df = pd.DataFrame(records)
        target_csv = OUTPUT_CSV
        
        # Avoid duplicates by reading existing, appending, dropping, and rewriting safely
        if os.path.exists(target_csv):
            try:
                existing_df = pd.read_csv(target_csv)
                combined_df = pd.concat([existing_df, new_df], ignore_index=True)
                # Drop duplicates based on road_id and timestamp, keeping newest
                final_df = combined_df.drop_duplicates(subset=['road_id', 'timestamp'], keep='last')
            except Exception as e:
                print(f"Error reading existing CSV: {e}. Falling back to default append.")
                final_df = new_df
        else:
            final_df = new_df
            
        final_df.to_csv(target_csv, mode='w', header=True, index=False)
        print(f"Successfully collected {len(records)} new records. CSV total: {len(final_df)} rows.")
    else:
        print("No records collected this run.")

def job(iteration: int, total: int):
    """Wrapper that logs the iteration number before collecting."""
    print(f"\n{'='*60}")
    print(f"  ITERATION {iteration}/{total}")
    print(f"{'='*60}")
    process_and_save_data(test_run=False)

if __name__ == "__main__":
    # ── Configuration ────────────────────────────────────────────
    INTERVAL_MINUTES = 5    # Collect every 5 minutes
    MAX_ITERATIONS   = 30   # Stop after 30 cycles (~2.5 hours)
    # ─────────────────────────────────────────────────────────────

    if "--test-run" in sys.argv:
        print("Executing TEST RUN (Max 3 segments)...")
        process_and_save_data(test_run=True)
    else:
        total_time = INTERVAL_MINUTES * MAX_ITERATIONS
        total_rows = MAX_ITERATIONS * len(YELAHANKA_SEGMENTS)
        print(f"Starting RAPID data collection mode")
        print(f"  Interval  : every {INTERVAL_MINUTES} minutes")
        print(f"  Cycles    : {MAX_ITERATIONS}")
        print(f"  Est. time : ~{total_time} minutes ({total_time/60:.1f} hours)")
        print(f"  Est. rows : ~{total_rows}")
        print(f"  Output    : {OUTPUT_CSV}\n")

        for i in range(1, MAX_ITERATIONS + 1):
            job(i, MAX_ITERATIONS)

            if i < MAX_ITERATIONS:
                print(f"\nSleeping {INTERVAL_MINUTES} minutes until next cycle...")
                time.sleep(INTERVAL_MINUTES * 60)

        # Final summary
        if os.path.exists(OUTPUT_CSV):
            row_count = sum(1 for _ in open(OUTPUT_CSV)) - 1  # minus header
            print(f"\n{'='*60}")
            print(f"  COLLECTION COMPLETE")
            print(f"  Total rows in CSV: {row_count}")
            print(f"{'='*60}")
        else:
            print("\nNo data was collected.")
