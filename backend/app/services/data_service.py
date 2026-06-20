import os
import pandas as pd
import logging
from typing import List

logger = logging.getLogger(__name__)

def resolve_path(rel_path: str) -> str:
    if os.path.exists(rel_path):
        return rel_path
    # Try traversing up relative to this script
    alt_path = os.path.join(os.path.dirname(__file__), "..", "..", rel_path)
    alt_path = os.path.normpath(alt_path)
    if os.path.exists(alt_path):
        return alt_path
    return rel_path

class DataService:
    def get_high_risk_zones(self) -> List[dict]:
        path = resolve_path("reports/high_risk_zones.csv")
        if not os.path.exists(path):
            logger.warning(f"File not found: {path}")
            return []
        try:
            df = pd.read_csv(path)
            # Replaces potential NaNs to make JSON serialization clean
            df = df.fillna(0)
            return df.to_dict(orient="records")
        except Exception as e:
            logger.error(f"Error reading high risk zones: {e}")
            return []

    def get_hotspot_clusters(self) -> List[dict]:
        path = resolve_path("reports/high_risk_clusters.csv")
        if not os.path.exists(path):
            logger.warning(f"File not found: {path}")
            return []
        try:
            df = pd.read_csv(path)
            df = df.fillna(0)
            return df.to_dict(orient="records")
        except Exception as e:
            logger.error(f"Error reading hotspots: {e}")
            return []

    def get_patrol_recommendations(self) -> List[dict]:
        path = resolve_path("reports/patrol_plan.csv")
        if not os.path.exists(path):
            logger.warning(f"File not found: {path}")
            return []
        try:
            df = pd.read_csv(path)
            df = df.fillna(0)
            # Map headers with spaces to Pydantic snake_case attributes
            # Original: Zone ID,Patrol Priority,Route Distance,Estimated Travel Time,Coverage Score
            mapped_records = []
            for _, row in df.iterrows():
                mapped_records.append({
                    "zone_id": row.get("Zone ID", ""),
                    "patrol_priority": row.get("Patrol Priority", ""),
                    "route_distance": float(row.get("Route Distance", 0.0)),
                    "estimated_travel_time": float(row.get("Estimated Travel Time", 0.0)),
                    "coverage_score": float(row.get("Coverage Score", 0.0))
                })
            return mapped_records
        except Exception as e:
            logger.error(f"Error reading patrol plan: {e}")
            return []

    def get_threat_forecasts(self) -> List[dict]:
        path = resolve_path("reports/forecast_patrol_recommendations.csv")
        if not os.path.exists(path):
            logger.warning(f"File not found: {path}")
            return []
        try:
            df = pd.read_csv(path)
            df = df.fillna(0)
            # Original: Zone,Predicted Risk,Patrol Frequency,Resource Priority
            mapped_records = []
            for _, row in df.iterrows():
                mapped_records.append({
                    "zone": row.get("Zone", ""),
                    "predicted_risk": float(row.get("Predicted Risk", 0.0)),
                    "patrol_frequency": row.get("Patrol Frequency", ""),
                    "resource_priority": row.get("Resource Priority", "")
                })
            return mapped_records
        except Exception as e:
            logger.error(f"Error reading threat forecasts: {e}")
            return []

    def get_warning_alerts(self) -> List[dict]:
        path = resolve_path("reports/warning_alerts.csv")
        if not os.path.exists(path):
            logger.warning(f"File not found: {path}")
            return []
        try:
            df = pd.read_csv(path)
            df = df.fillna(0)
            # Original: Zone ID,Alert Type,Description,Priority Level
            mapped_records = []
            for _, row in df.iterrows():
                mapped_records.append({
                    "zone_id": row.get("Zone ID", ""),
                    "alert_type": row.get("Alert Type", ""),
                    "description": row.get("Description", ""),
                    "priority_level": row.get("Priority Level", "")
                })
            return mapped_records
        except Exception as e:
            logger.error(f"Error reading warning alerts: {e}")
            return []

# Global Data Service instance
data_service = DataService()
