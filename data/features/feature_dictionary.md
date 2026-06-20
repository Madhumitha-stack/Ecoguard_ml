# EcoGuard-ML Core: Feature Dictionary

This document serves as the data dictionary for the model-ready datasets (`train.csv`, `validation.csv`, `test.csv`) stored in `data/features/`. Each dataset contains 29 columns: 2 identifiers, 1 target label, and 26 features.

---

## Preprocessed Feature Dictionary Schema

| Feature Name | Data Type | Description | Transformation Applied |
| :--- | :--- | :--- | :--- |
| **`event_id`** | String / Hash | Unique snippet ID of the telemetry observation. | **None** (Exposed as identifier; not used as model feature). |
| **`zone_id`** | String | Identifier mapping coordinate blocks to grid zones. | **None** (Exposed as identifier; not used as model feature). |
| **`latitude`** | Float | Decimal degrees of latitude coordinate. | **None** (Passed directly to represent absolute physical position). |
| **`longitude`** | Float | Decimal degrees of longitude coordinate. | **None** (Passed directly to represent absolute physical position). |
| **`temperature`** | Float | Ambient air temperature in degrees Celsius (°C). | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`humidity`** | Float | Relative humidity percentage (%). | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`rainfall`** | Float | Precipitation volume measured in millimeters (mm). | **Imputation & Scaling** (Seasonal median imputation of 155 missing values, followed by Z-Score Z-scaling). |
| **`animal_density_score`** | Float | Wildlife concentration index logged between `[0, 100]`. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`distance_to_road`** | Float | Distance in meters (m) to the closest road segment. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`distance_to_water`** | Float | Distance in meters (m) to the closest permanent lake/river. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`distance_to_ranger_station`** | Float | Distance in meters (m) to the closest ranger station base. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`elevation`** | Float | Elevation height in meters (m) above sea level. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`historical_incident_count`** | Float | Pre-seeded total poaching violations logged in the grid zone. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`acoustic_risk`** | Float | Real-time sound warnings index logged in `[0.0, 1.0]`. | **Z-Score Standardization** (Mean centered at 0, unit variance based on train split). |
| **`hour_sin`** | Float | Sine coordinate projection of the hour of the day. | **Cyclical Encoding**: $\sin(2\pi \cdot \text{hour} / 24)$ |
| **`hour_cos`** | Float | Cosine coordinate projection of the hour of the day. | **Cyclical Encoding**: $\cos(2\pi \cdot \text{hour} / 24)$ |
| **`month_sin`** | Float | Sine coordinate projection of the month of the year. | **Cyclical Encoding**: $\sin(2\pi \cdot \text{month} / 12)$ |
| **`month_cos`** | Float | Cosine coordinate projection of the month of the year. | **Cyclical Encoding**: $\cos(2\pi \cdot \text{month} / 12)$ |
| **`season_Dry`** | Integer (Binary) | Dry season indicator flag. | **One-Hot Encoding** (Value: `1` if Dry, `0` otherwise). |
| **`season_Wet`** | Integer (Binary) | Wet season indicator flag. | **One-Hot Encoding** (Value: `1` if Wet, `0` otherwise). |
| **`season_Short Dry`** | Integer (Binary) | Short dry season indicator flag. | **One-Hot Encoding** (Value: `1` if Short Dry, `0` otherwise). |
| **`season_Short Wet`** | Integer (Binary) | Short wet season indicator flag. | **One-Hot Encoding** (Value: `1` if Short Wet, `0` otherwise). |
| **`species_Elephant`** | Integer (Binary) | Primary animal present is Elephant. | **One-Hot Encoding** (Value: `1` if Elephant, `0` otherwise). |
| **`species_Rhino`** | Integer (Binary) | Primary animal present is Rhino. | **One-Hot Encoding** (Value: `1` if Rhino, `0` otherwise). |
| **`species_Lion`** | Integer (Binary) | Primary animal present is Lion. | **One-Hot Encoding** (Value: `1` if Lion, `0` otherwise). |
| **`species_Buffalo`** | Integer (Binary) | Primary animal present is Buffalo. | **One-Hot Encoding** (Value: `1` if Buffalo, `0` otherwise). |
| **`species_Zebra`** | Integer (Binary) | Primary animal present is Zebra. | **One-Hot Encoding** (Value: `1` if Zebra, `0` otherwise). |
| **`species_None Detected`** | Integer (Binary) | Baseline wildlife indicator. | **One-Hot Encoding** (Value: `1` if no species detected, `0` otherwise). |
| **`poaching_incident`** | Integer (Binary) | Threat label (0 = Safe observation, 1 = Poaching incident). | **None** (Target classification label variable). |
