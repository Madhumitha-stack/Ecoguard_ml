# EcoGuard-ML Core: System Architecture Explanation

This document details the modular system design, showing how data streams move from reserve-level sensors to the command center user interface.

---

## 1. Modular System Design

The **EcoGuard-ML Core** architecture is structured into four decoupled layers, ensuring scalability, low latency, and single-responsibility patterns.

```text
+-------------------------------------------------------------+
|                     Ingestion Layer                         |
|   (Acoustic Stream, Climatic IoT Broadcast, GPS Collect)    |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                     Buffer & Cache Layer                    |
|             (MinIO Storage, Redis Queue Caching)            |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                    AI & Predictive Pipelines                |
|  (Acoustic Classify, XGBoost Risk Engine, Route A* Routing) |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                API Gateway & Operations Dashboard           |
|            (FastAPI Server, React Command Center)           |
+-------------------------------------------------------------+
```

---

## 2. Layer Analysis

### A. Ingestion Layer
In a deployment scenario, field-deployed hardware streams raw data:
*   **Acoustic Arrays:** Microphones capturing environmental sound waves continuously (streamed via RTMP or compressed RTSP streams).
*   **Climatic Nodes:** IoT sensors publishing ambient parameters (temperature, precipitation, humidity) on regular intervals over MQTT brokers.
*   **GPS Trackers:** Ranger coordinates updated in real-time.

### B. Message Queue & Buffer Caching
To handle burst rates and network dropouts:
*   **Audio Chunking:** Raw audio is partitioned into 5-second snippets and written to a fast blob storage repository (like MinIO).
*   **Redis Buffering:** Climatic summaries and GPS updates are queued in a Redis cache block, standardizing input structures for the forecasting engine.

### C. Predictive Modeling Layer
Composed of specialized analytical engines:
*   **Acoustic Threat Classifier:** Decodes sound snippets into Mel-spectrogram vectors and feeds them to a CNN to classify gunshots, chainsaw felling, off-road vehicle engines, or animal behavior.
*   **Spatiotemporal Risk Engine:** Evaluates the probability of active poaching incursions. Implemented using a tabular classifier (Random Forest) that evaluates spatial proximity metrics and live environmental parameters.
*   **Patrol Router:** Calculates terrain-aware waypoints using A* algorithms combined with Genetic Algorithms, aiming to maximize zone coverage while routing through target sectors.

### D. FastAPI Gateway
*   **Predict Service:** Decoupled service layer ([prediction_service.py](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/backend/app/services/prediction_service.py)) loaded with pre-trained models.
*   **Data Service:** Service layer ([data_service.py](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/backend/app/services/data_service.py)) reading processed GIS shapes and updating live alert vectors.
*   **CORS & Middleware:** Handles static file routing for compiled React assets, request logging, and CORS configurations.

---

## 3. Communication Protocols

*   **REST (HTTP/JSON):** Used for client-initiated dashboard configurations, system diagnostic queries, and manual coordinate evaluations.
*   **WebSockets:** Transmits immediate acoustic threat detections from the backend to the UI without client polling, keeping warning notifications sub-second.
*   **File Stream overlays:** Static geospatial vectors (`patrol_routes.html`, `incident_map.html`) are rendered natively within iframe dashboard elements, allowing Leaflet to plot maps without browser overhead.
