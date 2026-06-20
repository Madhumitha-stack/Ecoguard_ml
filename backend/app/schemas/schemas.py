from pydantic import BaseModel, Field, field_validator
from typing import List

class HealthResponse(BaseModel):
    status: str = "healthy"

class PredictRequest(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate", ge=-90.0, le=90.0)
    longitude: float = Field(..., description="Longitude coordinate", ge=-180.0, le=180.0)
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage", ge=0.0, le=100.0)
    rainfall: float = Field(..., description="Rainfall in mm", ge=0.0)
    animal_density_score: float = Field(..., description="Animal density score index", ge=0.0)
    distance_to_road: float = Field(..., description="Distance to nearest road in meters", ge=0.0)
    distance_to_water: float = Field(..., description="Distance to water source in meters", ge=0.0)
    distance_to_ranger_station: float = Field(..., description="Distance to ranger station in meters", ge=0.0)
    elevation: float = Field(..., description="Elevation above sea level in meters")
    historical_incident_count: float = Field(..., description="Historical incident count in area", ge=0.0)
    acoustic_risk: float = Field(..., description="Acoustic threat index", ge=0.0, le=1.0)
    hour: int = Field(..., description="Hour of the day (0-23)", ge=0, le=23)
    month: int = Field(..., description="Month of the year (1-12)", ge=1, le=12)
    season: str = Field(..., description="Season name (Dry, Wet, Short Dry, Short Wet)")
    species: str = Field(..., description="Target species name")

    @field_validator('season')
    def validate_season(cls, v):
        valid = ["Dry", "Short Dry", "Short Wet", "Wet"]
        if v not in valid:
            raise ValueError(f"Season must be one of {valid}")
        return v

    @field_validator('species')
    def validate_species(cls, v):
        valid = ["Buffalo", "Elephant", "Lion", "None Detected", "Rhino", "Zebra"]
        if v not in valid:
            raise ValueError(f"Species must be one of {valid}")
        return v

class PredictResponse(BaseModel):
    risk_probability: float = Field(..., description="Poaching risk probability (0.0 to 1.0)", ge=0.0, le=1.0)
    risk_level: str = Field(..., description="Qualitative risk classification (Low, Medium, High)")

class ZoneItem(BaseModel):
    zone_id: str
    incident_count: int
    average_risk_score: float
    average_acoustic_threat: float
    historical_incidents: float

class HotspotItem(BaseModel):
    event_id: str
    zone_id: str
    latitude: float
    longitude: float
    cluster_label: int
    acoustic_risk: float
    animal_density_score: int

class PatrolItem(BaseModel):
    zone_id: str
    patrol_priority: str
    route_distance: float
    estimated_travel_time: float
    coverage_score: float

class ForecastItem(BaseModel):
    zone: str
    predicted_risk: float
    patrol_frequency: str
    resource_priority: str

class AlertItem(BaseModel):
    zone_id: str
    alert_type: str
    description: str
    priority_level: str
