import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ValidationError

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes, allowing frontend to make requests
CORS(app)

# Load the trained XGBoost model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml_model', 'traffic_model.pkl')

try:
    model = joblib.load(MODEL_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Pydantic schema for input validation
class TrafficPredictionInput(BaseModel):
    road_id: str
    hour: int
    day_of_week: int
    is_weekend: int
    distance: float
    duration: float
    duration_in_traffic: float

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict-traffic', methods=['POST'])
def predict_traffic():
    """
    Predict congestion index based on traffic parameters.
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
        
    try:
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        # Validate input using Pydantic
        validated_data = TrafficPredictionInput(**data)
        
        # Convert to Pandas DataFrame for the model
        # The model expects a DataFrame with the exact feature names and types
        input_data = pd.DataFrame([{
            'road_id': validated_data.road_id,
            'hour': validated_data.hour,
            'day_of_week': validated_data.day_of_week,
            'is_weekend': validated_data.is_weekend,
            'distance': validated_data.distance,
            'duration': validated_data.duration,
            'duration_in_traffic': validated_data.duration_in_traffic
        }])
        
        # Ensure road_id is categorical as expected by the trained model
        input_data['road_id'] = input_data['road_id'].astype('category')
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        # Ensure prediction is bounded between 0 and 1
        predicted_congestion = max(0.0, min(1.0, float(prediction)))
        
        return jsonify({
            "predicted_congestion": predicted_congestion,
            "status": "success"
        })
        
    except ValidationError as e:
        # Handle validation errors gracefully
        return jsonify({
            "error": "Validation Error",
            "details": e.errors()
        }), 422
    except Exception as e:
        # Catch-all for unexpected errors
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask API
    app.run(host='0.0.0.0', port=5000, debug=True)
