import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_traffic_data(num_roads=60, days=90, start_date='2024-01-01', output_file='synthetic_traffic_data.csv'):
    """
    Generate a modular, synthetic traffic dataset that realistically mirrors urban congestion.
    """
    np.random.seed(42)
    start_dt = pd.to_datetime(start_date)
    
    # 1. Define Roads
    road_ids = [f"R_{str(i).zfill(3)}" for i in range(1, num_roads + 1)]
    capacities = np.random.randint(500, 3000, size=num_roads)
    base_speeds = np.random.randint(30, 65, size=num_roads)
    
    road_df = pd.DataFrame({
        "road_id": road_ids,
        "road_capacity": capacities,
        "base_speed": base_speeds
    })
    
    # 2. Time grid (hourly for 90 days)
    timestamps = [start_dt + timedelta(hours=i) for i in range(days * 24)]
    time_df = pd.DataFrame({"timestamp": timestamps})
    time_df["hour"] = time_df["timestamp"].dt.hour
    time_df["day_of_week"] = time_df["timestamp"].dt.dayofweek
    time_df["is_weekend"] = time_df["day_of_week"].isin([5, 6]).astype(int)
    
    # Daily weather factor (1.0 = clear, <1.0 = bad weather reducing speed)
    daily_dates = time_df["timestamp"].dt.date.unique()
    weather_factors = np.random.choice([1.0, 0.8, 0.6], size=len(daily_dates), p=[0.7, 0.2, 0.1])
    weather_df = pd.DataFrame({"date": daily_dates, "weather_factor": weather_factors})
    time_df["date"] = time_df["timestamp"].dt.date
    time_df = time_df.merge(weather_df, on="date")
    
    # 3. Merge roads and times using cross join
    df = time_df.assign(key=1).merge(road_df.assign(key=1), on="key").drop("key", axis=1)
    
    # 4. Compute Dynamic Factors
    df['peak_mult'] = 0.8 # Base Off-peak
    
    # Weekday rules
    df.loc[(df['is_weekend'] == 0) & (df['hour'] >= 8) & (df['hour'] <= 10), 'peak_mult'] = 1.8 # Morning peak
    df.loc[(df['is_weekend'] == 0) & (df['hour'] >= 17) & (df['hour'] <= 19), 'peak_mult'] = 2.2 # Evening peak (highest)
    df.loc[(df['is_weekend'] == 0) & (df['hour'] >= 0) & (df['hour'] <= 5), 'peak_mult'] = 0.1 # Night
    
    # Weekend rules
    df.loc[(df['is_weekend'] == 1), 'peak_mult'] = 0.6 # Weekend Base
    df.loc[(df['is_weekend'] == 1) & (df['hour'] >= 11) & (df['hour'] <= 16), 'peak_mult'] = 1.5 # Recreational mid-day
    df.loc[(df['is_weekend'] == 1) & (df['hour'] >= 0) & (df['hour'] <= 6), 'peak_mult'] = 0.1 # Weekend Night
    
    # Event Factor: Occasional events increasing traffic near specific roads
    df['event_factor'] = 1.0
    num_events = 15
    event_days = np.random.choice(daily_dates, size=num_events, replace=True)
    for ed in event_days:
        event_roads = np.random.choice(road_ids, size=5, replace=False)
        event_hour = np.random.randint(18, 22)
        
        # Boost event factor around event hour and target roads
        mask = (df['date'] == ed) & (df['road_id'].isin(event_roads)) & (df['hour'] >= event_hour - 2) & (df['hour'] <= event_hour + 2)
        df.loc[mask, 'event_factor'] = np.random.uniform(1.5, 3.0, size=mask.sum())
    
    # 5. Calculate vehicle count and congestion
    base_load = np.random.uniform(0.1, 0.4, size=len(df))
    # Add varying random noise
    random_noise = np.random.uniform(0.9, 1.1, size=len(df))
    
    df['vehicle_count'] = df['road_capacity'] * base_load * df['peak_mult'] * df['event_factor'] * random_noise
    
    # Weather might slightly reduce vehicle count willingness
    df['vehicle_count'] = df['vehicle_count'] * (df['weather_factor'] ** 0.5)
    df['vehicle_count'] = df['vehicle_count'].astype(int)
    
    # Cap vehicle count to a max absolute jammed capacity
    df['vehicle_count'] = np.minimum(df['vehicle_count'], (df['road_capacity'] * 1.5).astype(int))
    
    # Congestion Index Formula: (vehicle_count / road_capacity) adjusted by weather and peak multipliers.
    # We use effective_capacity = road_capacity * weather_factor
    effective_capacity = df['road_capacity'] * df['weather_factor']
    df['congestion_index'] = df['vehicle_count'] / effective_capacity
    df['congestion_index'] = np.clip(df['congestion_index'], 0, 1.0)
    
    # Average Speed: Reduced by congestion and weather_factor
    df['avg_speed'] = df['base_speed'] * (1 - 0.6 * (df['congestion_index']**2)) * df['weather_factor']
    df['avg_speed'] = np.maximum(df['avg_speed'], 5.0).round(1) # Ensure a minimum possible speed

    # 6. Format and Export
    final_cols = [
        'timestamp', 'road_id', 'hour', 'day_of_week', 'is_weekend',
        'weather_factor', 'event_factor', 'vehicle_count', 
        'road_capacity', 'avg_speed', 'congestion_index'
    ]
    
    out_df = df[final_cols]
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    out_df.to_csv(output_file, index=False)
    
    print(f"Dataset generated successfully!")
    print(f"Total rows: {len(out_df)}")
    print(f"Unique road segments: {num_roads}")
    print(f"Output saved to: {os.path.abspath(output_file)}")
    
    return out_df

if __name__ == "__main__":
    # Generate datasets on execution
    generate_traffic_data(num_roads=60, days=90, output_file='traffic_data_generator/synthetic_traffic_data.csv')
