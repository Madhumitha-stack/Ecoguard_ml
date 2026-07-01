import joblib
import pandas as pd
import numpy as np
import os
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'latitude', 'longitude', 'temperature', 'humidity', 'rainfall',
            'animal_density_score', 'distance_to_road', 'distance_to_water',
            'distance_to_ranger_station', 'elevation', 'historical_incident_count',
            'acoustic_risk', 'hour_sin', 'hour_cos', 'month_sin', 'month_cos',
            'season_Dry', 'season_Short Dry', 'season_Short Wet', 'season_Wet',
            'species_Buffalo', 'species_Elephant', 'species_Lion',
            'species_None Detected', 'species_Rhino', 'species_Zebra'
        ]
        self.load_model()
        self.load_scaler()

    def load_model(self):
        # Resolve path relative to project root or settings
        model_path = settings.MODEL_PATH
        # If absolute path not found, try traversing up
        if not os.path.exists(model_path):
            # Try traversing from app directory
            model_path = os.path.join(os.path.dirname(__file__), "..", "..", settings.MODEL_PATH)
            model_path = os.path.normpath(model_path)
            
        if not os.path.exists(model_path):
            logger.error(f"XGBoost model file not found at path: {settings.MODEL_PATH}")
            self.model = None
            return
            
        try:
            self.model = joblib.load(model_path)
            logger.info(f"Successfully loaded model from {model_path}")
        except Exception as e:
            logger.error(f"Failed to deserialize XGBoost model: {str(e)}")
            self.model = None

    def load_scaler(self):
        scaler_rel_path = "models/scaler.pkl"
        scaler_path = scaler_rel_path
        if not os.path.exists(scaler_path):
            scaler_path = os.path.join(os.path.dirname(__file__), "..", "..", scaler_rel_path)
            scaler_path = os.path.normpath(scaler_path)

        if not os.path.exists(scaler_path):
            logger.error(f"StandardScaler file not found at path: {scaler_rel_path}")
            self.scaler = None
            return

        try:
            self.scaler = joblib.load(scaler_path)
            logger.info(f"Successfully loaded scaler from {scaler_path}")
        except Exception as e:
            logger.error(f"Failed to deserialize StandardScaler: {str(e)}")
            self.scaler = None

    def predict(self, data) -> dict:
        if self.model is None:
            raise RuntimeError("Poaching risk model is not loaded.")

        # Compute cyclical temporal variables
        hour_sin = np.sin(2 * np.pi * data.hour / 24.0)
        hour_cos = np.cos(2 * np.pi * data.hour / 24.0)
        month_sin = np.sin(2 * np.pi * data.month / 12.0)
        month_cos = np.cos(2 * np.pi * data.month / 12.0)

        # One-hot encoded season
        season_Dry = 1.0 if data.season == "Dry" else 0.0
        season_Short_Dry = 1.0 if data.season == "Short Dry" else 0.0
        season_Short_Wet = 1.0 if data.season == "Short Wet" else 0.0
        season_Wet = 1.0 if data.season == "Wet" else 0.0

        # One-hot encoded species
        species_Buffalo = 1.0 if data.species == "Buffalo" else 0.0
        species_Elephant = 1.0 if data.species == "Elephant" else 0.0
        species_Lion = 1.0 if data.species == "Lion" else 0.0
        species_None_Detected = 1.0 if data.species == "None Detected" else 0.0
        species_Rhino = 1.0 if data.species == "Rhino" else 0.0
        species_Zebra = 1.0 if data.species == "Zebra" else 0.0

        # Build feature dict in exact model order
        feature_dict = {
            'latitude': data.latitude,
            'longitude': data.longitude,
            'temperature': data.temperature,
            'humidity': data.humidity,
            'rainfall': data.rainfall,
            'animal_density_score': data.animal_density_score,
            'distance_to_road': data.distance_to_road,
            'distance_to_water': data.distance_to_water,
            'distance_to_ranger_station': data.distance_to_ranger_station,
            'elevation': data.elevation,
            'historical_incident_count': data.historical_incident_count,
            'acoustic_risk': data.acoustic_risk,
            'hour_sin': hour_sin,
            'hour_cos': hour_cos,
            'month_sin': month_sin,
            'month_cos': month_cos,
            'season_Dry': season_Dry,
            'season_Short Dry': season_Short_Dry,
            'season_Short Wet': season_Short_Wet,
            'season_Wet': season_Wet,
            'species_Buffalo': species_Buffalo,
            'species_Elephant': species_Elephant,
            'species_Lion': species_Lion,
            'species_None Detected': species_None_Detected,
            'species_Rhino': species_Rhino,
            'species_Zebra': species_Zebra
        }

        # Create DataFrame
        df_input = pd.DataFrame([feature_dict])
        
        # Ensure column types and orders are strictly correct
        df_input = df_input[self.feature_names]

        # Scale numerical columns before model inference
        if self.scaler is not None:
            cols_to_scale = [
                'temperature', 'humidity', 'rainfall', 'distance_to_road',
                'distance_to_water', 'distance_to_ranger_station', 'elevation',
                'animal_density_score', 'acoustic_risk', 'historical_incident_count'
            ]
            df_input[cols_to_scale] = self.scaler.transform(df_input[cols_to_scale])

        # Call prediction
        prob = float(self.model.predict_proba(df_input)[0, 1])

        # Risk level determination based on model and operational guidelines
        if prob >= 0.50:
            risk_level = "High"
        elif prob >= 0.15:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return {
            "risk_probability": prob,
            "risk_level": risk_level
        }

# Global Service instance
prediction_service = PredictionService()
