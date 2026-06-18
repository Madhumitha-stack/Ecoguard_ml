# EcoGuard-ML Core: Dataset Schema

This document defines the schema for the sensor, environment, and threat telemetry database utilized by the **EcoGuard-ML Core** platform. Each record represents a unified telemetry event logged from reserve grid blocks, incorporating spatial, climatic, and threat labels.

---

## Telemetry Feature Schema

| Column Name | Data Type | Allowed Range | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| **`event_id`** | String / UUID | Format: `evt_[a-f0-9]{8}` | Unique identifier for the telemetry reporting event. | `"evt_a9b8c7d6"` |
| **`zone_id`** | String | Format: `ZONE_[A-Z]\d{2}` | Unique identifier of the reserve grid sector or management zone. | `"ZONE_B04"` |
| **`latitude`** | Float | `[-90.0, 90.0]` | Latitude coordinate of the sensor group/incident report in decimal degrees (e.g., East African Rift region). | `-3.41285` |
| **`longitude`** | Float | `[-180.0, 180.0]` | Longitude coordinate of the sensor group/incident report in decimal degrees. | `35.90124` |
| **`temperature`** | Float | `[-10.0, 55.0]` | Ambient air temperature at the time of recording in degrees Celsius (°C). | `27.4` |
| **`humidity`** | Float | `[0.0, 100.0]` | Relative humidity percentage (%) recorded by the weather telemetry group. | `64.2` |
| **`rainfall`** | Float | `[0.0, 300.0]` | Precipitation volume measured in millimeters (mm) over the preceding 24-hour cycle. | `12.8` |
| **`animal_density`** | Float | `[0.0, 1.0]` | Normalized density score representing historical and real-time animal migratory tracking in the area. | `0.78` |
| **`distance_to_road`** | Float | `[0.0, 100000.0]` | Distance in meters (m) to the nearest road, trail, or access corridor. | `1540.2` |
| **`distance_to_water`** | Float | `[0.0, 50000.0]` | Distance in meters (m) to the closest permanent or seasonal water body (river, lake, watering hole). | `432.5` |
| **`distance_to_ranger_station`** | Float | `[0.0, 150000.0]` | Distance in meters (m) to the nearest operational ranger patrol outpost. | `7410.0` |
| **`elevation`** | Float | `[-50.0, 6000.0]` | Elevation of the location in meters (m) above mean sea level. | `1684.0` |
| **`hour`** | Integer | `[0, 23]` | Hour of the day in 24-hour format (Local Standard Time). | `21` |
| **`month`** | Integer | `[1, 12]` | Numerical representation of the month of the year (1 = January, 12 = December). | `6` |
| **`season`** | String | `["Dry", "Wet", "Short Dry", "Short Wet"]` | Categorized ecological season characterization based on local meteorological profiles. | `"Dry"` |
| **`species`** | String | `["Elephant", "Rhino", "Lion", "Buffalo", "Zebra", "None"]` | The primary animal species detected or tracked in proximity to the sensor logging the event. | `"Elephant"` |
| **`historical_incident_count`** | Integer | `[0, 100]` | Total number of verified poaching or border violations historically logged in the zone over the last 36 months. | `14` |
| **`acoustic_risk`** | Float | `[0.0, 1.0]` | Normalized index representing raw warning alerts (gunshots, chainsaws, off-road vehicles) recorded by acoustic nodes in the zone over the last 6 hours. | `0.65` |
| **`poaching_incident`** | Integer (Binary) | `[0, 1]` | Target classification label. `1` indicates an active poaching threat, snare discovery, or illegal boundary violation; `0` indicates no threat detected. | `1` |

