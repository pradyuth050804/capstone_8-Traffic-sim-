import os
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

def train_real_congestion_model(data_path, model_output_path):
    print(f"Loading data from {data_path}...")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)
    
    initial_rows = len(df)
    
    # Optional renaming to match standard naming if necessary
    # The data collector uses: distance_m, base_duration_s, traffic_duration_s
    # We will safely rename them if they exist to match the expected feature set.
    rename_map = {
        'distance_m': 'distance',
        'base_duration_s': 'duration',
        'traffic_duration_s': 'duration_in_traffic'
    }
    df = df.rename(columns=rename_map)
    
    # Drop rows with missing or invalid values
    df = df.dropna()
    print(f"Dropped {initial_rows - len(df)} rows with missing values. Total remaining: {len(df)}")
    
    # Define explicitly required features and target
    features = [
        'road_id', 'hour', 'day_of_week', 'is_weekend', 
        'distance', 'duration', 'duration_in_traffic'
    ]
    target = 'congestion_index'
    
    for f in features + [target]:
        if f not in df.columns:
            raise KeyError(f"Required column '{f}' is missing from the dataset. Found columns: {list(df.columns)}")
    
    # Ensure no division errors / infinite values
    df = df.replace([np.inf, -np.inf], np.nan).dropna()
    
    # Enforce logical physical constraints:
    # 1. Base duration must be positive
    # 2. Traffic duration cannot realistically be less than base empty-road duration
    pre_filter_len = len(df)
    df = df[(df['duration'] > 0) & (df['duration_in_traffic'] >= df['duration'])].copy()
    if pre_filter_len > len(df):
        print(f"Dropped {pre_filter_len - len(df)} rows violating duration constraints.")
    
    # Clip congestion_index between 0 and 1
    df[target] = df[target].clip(lower=0.0, upper=1.0)
    
    X = df[features].copy()
    y = df[target].copy()
    
    # Convert categorical feature 'road_id' to category data type
    X['road_id'] = X['road_id'].astype('category')
    
    # Perform train-test split (80/20)
    # If the dataset is too small (e.g. from a test run), fall back gracefully
    if len(df) < 10:
        print("WARNING: Dataset is too small (<10 rows). Train-test split may fail or be meaningless.")
        print("Falling back to train on entire dataset for testing purposes.")
        X_train, X_test, y_train, y_test = X, X.copy(), y, y.copy()
    else:
        print("Splitting data into 80% train and 20% test...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize XGBRegressor
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=150,
        learning_rate=0.1,
        max_depth=6,
        enable_categorical=True,
        random_state=42,
        n_jobs=-1
    )
    
    # Train model
    model.fit(X_train, y_train)
    
    # Model Evaluation
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    # R2 requires more than 1 sample to calculate effectively cleanly
    if len(y_test) > 1:
        r2 = r2_score(y_test, y_pred)
    else:
        r2 = float('nan')
    
    print("\n" + "="*30)
    print("      MODEL EVALUATION")
    print("="*30)
    print(f"RMSE : {rmse:.4f}")
    if not np.isnan(r2):
        print(f"R²   : {r2:.4f}")
    else:
        print("R²   : N/A (Test set too small)")
    
    # Feature Importance Ranking
    print("\n" + "="*30)
    print("  FEATURE IMPORTANCE RANKING")
    print("="*30)
    importance = model.get_booster().get_score(importance_type='weight')
    sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    
    for rank, (feat, score) in enumerate(sorted_importance, 1):
        print(f"{rank}. {feat}: {score}")
        
    # Save the trained model
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    joblib.dump(model, model_output_path)
    print(f"\nModel successfully saved to {os.path.abspath(model_output_path)}")

if __name__ == "__main__":
    # Ensure relative paths work by getting script directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Update to point to the new real dataset
    data_csv = os.path.join(base_dir, 'traffic_data_generator', 'real_traffic_data.csv')
    model_out = os.path.join(base_dir, 'ml_model', 'traffic_model.pkl')
    
    try:
        train_real_congestion_model(data_path=data_csv, model_output_path=model_out)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please run `collect_real_data.py` first to generate the dataset.")
