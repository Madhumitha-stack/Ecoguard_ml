# EcoGuard-ML Core: Wildlife Threat Intelligence Platform

**EcoGuard-ML Core** is an AI-powered Threat Intelligence Platform designed to assist wildlife conservation agencies in protecting ecosystems. The system integrates real-time telemetry from remote reserve zones to detect active poaching, predict spatiotemporal threat risks, analyze acoustic sensor anomalies, and compute optimized, terrain-aware ranger patrol routes.

---

## Project Directory Structure

```text
ecoguard_ml/
├── data/
│   ├── raw/                  # Original unmodified sensor data dumps (acoustic wavs, weather telemetry)
│   ├── processed/            # Cleaned, aggregated, and tabularized features ready for model runs
│   └── features/             # Intermediate engineered features (spectrogram vectors, temporal grids)
│
├── docs/
│   ├── dataset_schema.md     # Specifications for the 16 columns of telemetry data features
│   ├── problem_statement.md  # Detailed overview of the poaching challenge and project objectives
│   └── architecture.md       # Diagram and breakdown of ingestion, AI modeling, and dashboards
│
├── notebooks/
│   ├── 01_dataset_creation.ipynb       # Simulation and creation of acoustic & spatial telemetry data
│   ├── 02_eda.ipynb                    # Exploratory analysis of ecological risk patterns
│   └── 03_feature_engineering.ipynb    # Code to build features (distance layers, weather matrices)
│
├── models/                   # Saved model weights (XGBoost classifiers, Acoustic ResNets)
│
├── reports/                  # Generated performance reports, figures, and telemetry tables
│
└── README.md                 # Main workspace documentation
```

---

## Core Documentation References

- **[Dataset Schema](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/docs/dataset_schema.md):** Defines each variable logged by reserve sensors, including meteorological data, distance metrics, animal concentrations, and the target indicator label `poaching_incident`.
- **[Problem Statement](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/docs/problem_statement.md):** Contextualizes the threat landscapes (poaching, chainsaw operations, vehicle violations) and outlines operational objectives for field forces.
- **[System Architecture](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/docs/architecture.md):** Maps how telemetry flows through ingestion pipelines, message caches, convolutional & tree-based models, and back to the command center user interface.

---

## Notebook Pipelines

1. **`notebooks/01_dataset_creation.ipynb`**: Responsible for generating realistic synthetic telemetry representing reserve parameters. It handles coordinate projection, simulating seasonal weather, and modeling poaching events based on accessibility metrics.
2. **`notebooks/02_eda.ipynb`**: Conducts spatial heat-mapping and correlation checks. It helps analyze which distances (e.g., roads vs. water) strongly influence poaching risk and plots seasonal risk shifts.
3. **`notebooks/03_feature_engineering.ipynb`**: Prepares features for modeling. This includes mapping timestamps to cyclic features (sine/cosine of hours), standardizing climatic metrics, and producing train/val/test splits saved in `data/features/`.
