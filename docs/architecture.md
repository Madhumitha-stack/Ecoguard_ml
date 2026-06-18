# EcoGuard-ML Core: System Architecture

This document provides a conceptual architecture of the **EcoGuard-ML Core** platform, showing the flow of telemetry data from field sensors to predictive models and the Command Center dashboard.

---

## Architecture Diagram

```mermaid
graph TD
    %% Ingestion Layer
    subgraph Ingestion ["Ingestion Layer (Field Telemetry)"]
        A[Acoustic Sensors] -->|RTMP / Audio Streams| I1[Audio Stream Receiver]
        B[Climatic IoT Nodes] -->|MQTT / Weather Data| I2[Kafka Weather Topic]
        C[Ranger GPS Trackers] -->|Cellular/Satellite TCP| I3[Ranger Telemetry Collector]
    end

    %% Storage & Queue Layer
    subgraph DataQueue ["Message Queue & Storage"]
        I1 -->|Raw Audio Chunking| R1[(MinIO Raw Audio)]
        I2 -->|Buffering| K1[Redis Message Cache]
        I3 -->|Real-time Tracking| K1
    end

    %% AI/ML Pipelines
    subgraph Pipelines ["AI / Machine Learning Pipelines"]
        %% Acoustic Pipe
        R1 -->|Extract Mel-Spectrogram| M1[Acoustic Inference Service]
        M1 -->|CNN / ResNet Classification| O1[Acoustic Threat Event]
        
        %% Risk Pipe
        K1 -->|Feature Assembler| M2[Risk Forecasting Engine]
        M2 -->|XGBoost / LightGBM Classifier| O2[Spatiotemporal Risk Grid]
        
        %% Routing Pipe
        O2 -->|Risk Score Graph| M3[Patrol Optimization Engine]
        I3 -->|Start Coordinates| M3
        M3 -->|Genetic Algorithm / A* Pathing| O3[Optimized Patrol Routes]
    end

    %% User Layer
    subgraph Output ["Operations Command Dashboard"]
        O1 -->|WebSocket Alerts| D1[Overview & Alerts Panel]
        O2 -->|Layer Rendering| D2[Tactical Risk Heatmap]
        O3 -->|Vector Pathing Overlay| D3[Patrol Optimization View]
        M1 & M2 & M3 -->|Status Telemetry| D4[System Monitoring (Datadog Style)]
    end

    classDef default fill:#0b1329,stroke:#1e293b,color:#f3f4f6;
    classDef highlight fill:#10b981,stroke:#047857,color:#020617;
    class O1,O2,O3 highlight;
```

---

## Component Breakdown

### 1. Ingestion & Preprocessing
* **Acoustic Streams:** Field-deployed microphone arrays stream compressed audio. The preprocessor segments raw audio into 5-second chunks and extracts Mel-frequency cepstral coefficients (MFCCs) and spectrogram images.
* **Climatic IoT:** Weather sensors broadcast temperature, relative humidity, and precipitation data on regular intervals.
* **Geospatial Reference:** Core spatial attributes (distance to roads, water, ranger stations) are calculated using GIS shapefiles from the reserve map.

### 2. Machine Learning Modeling Layers

#### Acoustic Classifier
* **Model:** Convolutional Neural Network (CNN) trained on Mel-Spectrograms (e.g., MobileNetV3 or ResNet-18 modified for sound classification).
* **Classes:** Gunshot, Chainsaw, Vehicle, Human Activity, Animal Sounds.
* **Frequency:** Event-driven inference (executed whenever sound exceeds an amplitude threshold).

#### Spatiotemporal Risk Classifier
* **Model:** Tabular Gradient Boosting Model (e.g., XGBoost, CatBoost).
* **Inputs:** All 15 features defined in the [Dataset Schema](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/docs/dataset_schema.md) (weather conditions, temporal hour/month/season, spatial distances to roads/ranger bases, elevation, and historical animal concentration patterns).
* **Outputs:** Probability of a poaching incident occurring in a specific zone coordinate block over the next 24-hour and 7-day windows.

#### Patrol Route Router
* **Model/Algorithm:** Constrained A* routing combined with a Genetic Optimization Algorithm.
* **Inputs:** Active risk scores, patrol start locations, topography terrain constraints (elevation slopes), and ranger team availability.
* **Outputs:** GPS coordinates representing waypoint routes that maximize interception probabilities while staying within ranger travel-time thresholds.

### 3. API & Web Command Center
* **Backend Gateway:** Fast API server delivering REST endpoints for configuration, historic incident queries, and WebSocket channels for streaming real-time acoustic alarms.
* **Frontend Command Center:** React application displaying live tactical grids, acoustic waveform spectrogram logs, and system telemetry metrics.
