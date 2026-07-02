# EcoGuard-ML Core: API Documentation

The **EcoGuard-ML Core** platform relies on a high-performance REST API built with FastAPI. Inputs are validated dynamically using Pydantic models.

---

## 1. Global API Configuration

*   **Default Port:** `8001`
*   **Base URL:** `http://127.0.0.1:8001`
*   **Format:** JSON (UTF-8 encoded)
*   **Interactive Docs UI:**
    *   **Swagger UI:** `http://127.0.0.1:8001/docs`
    *   **Redoc:** `http://127.0.0.1:8001/redoc`

---

## 2. API Schema Reference

The routing layer relies on schema definitions declared in [schemas.py](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/backend/app/schemas/schemas.py).

### Predict Request Schema (`PredictRequest`)
```json
{
  "latitude": -2.1245,
  "longitude": 34.8912,
  "temperature": 25.4,
  "humidity": 60.0,
  "rainfall": 0.0,
  "animal_density_score": 75.0,
  "distance_to_road": 1200.0,
  "distance_to_water": 3400.0,
  "distance_to_ranger_station": 8500.0,
  "elevation": 1420.0,
  "historical_incident_count": 8.0,
  "acoustic_risk": 0.8,
  "hour": 23,
  "month": 7,
  "season": "Dry",
  "species": "Elephant"
}
```
*Constraints:*
*   `latitude`: `[-90.0, 90.0]`
*   `longitude`: `[-180.0, 180.0]`
*   `humidity`: `[0.0, 100.0]`
*   `acoustic_risk`: `[0.0, 1.0]`
*   `hour`: `[0, 23]`
*   `month`: `[1, 12]`
*   `season`: Must be one of `["Dry", "Wet", "Short Dry", "Short Wet"]`
*   `species`: Must be one of `["Elephant", "Rhino", "Lion", "Buffalo", "Zebra", "None Detected"]`

---

## 3. Endpoints Documentation

### 1. Health Status check
*   **Endpoint:** `/health`
*   **HTTP Method:** `GET`
*   **Description:** Inspects server health and verify routing is operational.
*   **Response Body (`HealthResponse`):**
    ```json
    {
      "status": "healthy"
    }
    ```

### 2. Predict Poaching Risk
*   **Endpoint:** `/predict`
*   **HTTP Method:** `POST`
*   **Description:** Computes the likelihood of a poaching incident based on spatial, temporal, and climatic factors.
*   **Request Payload:** See `PredictRequest` schema above.
*   **Response Body (`PredictResponse`):**
    ```json
    {
      "risk_probability": 0.7248,
      "risk_level": "High"
    }
    ```
*   **Status Codes:**
    *   `200 OK` — Prediction computed.
    *   `422 Unprocessable Entity` — Missing attributes or value range out of bounds.
    *   `500 Internal Server Error` — Model loading error or internal exception.

### 3. Get High Risk Ranger Zones
*   **Endpoint:** `/zones/high-risk`
*   **HTTP Method:** `GET`
*   **Description:** Retrieves all reserve management sectors ordered by current poaching indicators.
*   **Response Body (`List[ZoneItem]`):**
    ```json
    [
      {
        "zone_id": "ZONE_B04",
        "incident_count": 12,
        "average_risk_score": 0.782,
        "average_acoustic_threat": 0.65,
        "historical_incidents": 14.0
      }
    ]
    ```

### 4. Get Hotspot Clusters
*   **Endpoint:** `/hotspots`
*   **HTTP Method:** `GET`
*   **Description:** Fetches geographic coordinates of threat density clusters.
*   **Response Body (`List[HotspotItem]`):**
    ```json
    [
      {
        "event_id": "evt_a9b8c7d6",
        "zone_id": "ZONE_B04",
        "latitude": -3.41285,
        "longitude": 35.90124,
        "cluster_label": 1,
        "acoustic_risk": 0.65,
        "animal_density_score": 78
      }
    ]
    ```

### 5. Get Optimized Patrol Plans
*   **Endpoint:** `/patrols`
*   **HTTP Method:** `GET`
*   **Description:** Retrieves waypoint segments and priorities for ranger patrols.
*   **Response Body (`List[PatrolItem]`):**
    ```json
    [
      {
        "zone_id": "ZONE_B04",
        "patrol_priority": "High",
        "route_distance": 8420.5,
        "estimated_travel_time": 185.0,
        "coverage_score": 92.4
      }
    ]
    ```

### 6. Get Threat Forecasts
*   **Endpoint:** `/forecast`
*   **HTTP Method:** `GET`
*   **Description:** Retrieves temporal trend predictions for reserve sectors.
*   **Response Body (`List[ForecastItem]`):**
    ```json
    [
      {
        "zone": "ZONE_B04",
        "predicted_risk": 0.8124,
        "patrol_frequency": "Daily",
        "resource_priority": "Critical"
      }
    ]
    ```

### 7. Get Warning Alerts
*   **Endpoint:** `/alerts`
*   **HTTP Method:** `GET`
*   **Description:** Streams live warning alerts (e.g. gunshot, vehicle violation, chainsaw felling).
*   **Response Body (`List[AlertItem]`):**
    ```json
    [
      {
        "zone_id": "ZONE_B04",
        "alert_type": "Gunshot",
        "description": "Active weapon fire detected by acoustic node 12.",
        "priority_level": "Critical"
      }
    ]
    ```
