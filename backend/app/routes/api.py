from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.schemas.schemas import (
    HealthResponse,
    PredictRequest,
    PredictResponse,
    ZoneItem,
    HotspotItem,
    PatrolItem,
    ForecastItem,
    AlertItem
)
from app.services.prediction_service import prediction_service
from app.services.data_service import data_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health", response_model=HealthResponse, summary="Server Health Check")
def health_check():
    logger.debug("Health check endpoint hit.")
    return HealthResponse(status="healthy")

@router.post("/predict", response_model=PredictResponse, summary="Predict Poaching Incursion Risk")
def predict_risk(request: PredictRequest):
    # Structured Request Logging
    logger.info(f"Received prediction request: {request.model_dump()}")
    
    # Check if prediction service is loaded
    if prediction_service.model is None:
        logger.error("XGBoost prediction model is not loaded in backend application.")
        raise HTTPException(
            status_code=500,
            detail="Poaching risk prediction engine is offline (model file missing or failed to load)."
        )
        
    try:
        # Run prediction
        result = prediction_service.predict(request)
        
        # Structured Prediction Logging
        logger.info(
            f"Prediction complete. Target species: '{request.species}'. "
            f"Result: Probability={result['risk_probability']:.4f}, Level={result['risk_level']}"
        )
        return PredictResponse(
            risk_probability=result["risk_probability"],
            risk_level=result["risk_level"]
        )
    except Exception as e:
        logger.exception("Exception occurred during poaching risk prediction.")
        raise HTTPException(
            status_code=500,
            detail=f"Risk model inference failure: {str(e)}"
        )

@router.get("/zones/high-risk", response_model=List[ZoneItem], summary="Get High Risk Ranger Zones")
def get_high_risk_zones():
    logger.info("Fetching high risk ranger zones list.")
    zones = data_service.get_high_risk_zones()
    if not zones:
        raise HTTPException(status_code=404, detail="High risk zones file could not be read or is empty.")
    return zones

@router.get("/hotspots", response_model=List[HotspotItem], summary="Get Hotspot Clusters")
def get_hotspot_clusters():
    logger.info("Fetching hotspot threat clusters.")
    hotspots = data_service.get_hotspot_clusters()
    if not hotspots:
        raise HTTPException(status_code=404, detail="Hotspot clusters file could not be read or is empty.")
    return hotspots

@router.get("/patrols", response_model=List[PatrolItem], summary="Get Optimized Patrol Plans")
def get_patrol_recommendations():
    logger.info("Fetching optimized patrol dispatch routes.")
    patrols = data_service.get_patrol_recommendations()
    if not patrols:
        raise HTTPException(status_code=404, detail="Patrol plan file could not be read or is empty.")
    return patrols

@router.get("/forecast", response_model=List[ForecastItem], summary="Get Binned Threat Forecasts")
def get_threat_forecasts():
    logger.info("Fetching binned temporal threat forecasts.")
    forecasts = data_service.get_threat_forecasts()
    if not forecasts:
        raise HTTPException(status_code=404, detail="Forecast recommendations file could not be read or is empty.")
    return forecasts

@router.get("/alerts", response_model=List[AlertItem], summary="Get Early Warning Alerts")
def get_warning_alerts():
    logger.info("Fetching Early Warning acoustic and recidivism alerts.")
    alerts = data_service.get_warning_alerts()
    if not alerts:
        raise HTTPException(status_code=404, detail="Warning alerts file could not be read or is empty.")
    return alerts
