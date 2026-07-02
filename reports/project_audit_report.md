# EcoGuard-ML Core: Comprehensive Machine Learning & System Audit Report
**Author:** Madhumitha  
**Role:** Developer  
**GitHub:** <GitHub Link Placeholder>  
**LinkedIn:** <LinkedIn Link Placeholder>  
**Email:** <Email Placeholder>  
**Date:** June 20, 2026  
**Audited System:** EcoGuard-ML Core Platform (Models, Datasets, Feature Engineering, Threat Forecasting, and Geospatial Intelligence)

---

## EXECUTIVE BRIEF
This audit presents a brutally honest diagnostic assessment of the **EcoGuard-ML Core** platform. The system is producing predictions that are inaccurate, ecologically unrealistic, and operationally dangerous for ranger dispatch. 

While the system's training pipelines output high accuracy (~92.5%) and high ROC-AUC (~93.8%), these metrics are **mathematical illusions** created by severe target leakage, severe class imbalance, and a catastrophic date-synthesis bug that forces Prophet to overfit to fake monthly cycles. Furthermore, the model has never been trained on real-world data; it is simply reverse-engineering a deterministic, synthetic linear formula.

---

## SECTION 1: MODEL PERFORMANCE AUDIT

Based on our inspection of `reports/model_metrics.json`, the performance profiles of the three trained models are as follows:

| Model | Accuracy | Precision (Class 1) | Recall (Class 1) | F1-Score | ROC-AUC | PR-AUC |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Logistic Regression** | 94.20% | 67.61% | 42.86% | 52.46% | 0.9460 | 0.6463 |
| **Random Forest** | 94.67% | 78.57% | 39.29% | 52.38% | 0.9442 | 0.6268 |
| **XGBoost (Classifier)** | 92.53% | 50.00% | 63.39% | 55.91% | 0.9376 | 0.6133 |

### Audit Findings:
1. **The High Accuracy Illusion:** The models report high accuracy (92.5% - 94.6%) and high ROC-AUC (~0.93 - 0.94). However, this is a classic consequence of **class imbalance**. Poaching incidents (`poaching_incident` = 1) constitute only **7.50%** of the dataset. A baseline dummy classifier that predicts "Safe" (0) for every single record would achieve **92.50% accuracy**. Thus, accuracy is a completely misleading metric and must not be used to evaluate this system.
2. **Poor Precision and Alert Fatigue:** The XGBoost model has a precision of only **50.00%** on the validation/test set. This means that **50% of all high-risk alerts flagged by the model are false alarms**. In field operations, a 50% false positive rate causes severe ranger alert fatigue, leading to wasted patrols, burned fuel, and a loss of trust in the command center's intelligence.
3. **Low Recall and Missed Incursions:** The Random Forest model has a recall of only **39.29%**, meaning it misses **60.71% of actual poaching incidents**. XGBoost has a recall of **63.39%**, which still misses **36.61%** of active incursions. 
4. **Low F1-Score:** The F1-scores for all models hover between **52.3% and 55.9%**. This proves that the models fail to balance precision and recall on the minority class, rendering them unusable for high-stakes operational planning.

---

## SECTION 2: DATASET AUDIT

The datasets audited are `data/raw/master_dataset.csv` (synthetic) and `data/processed/hybrid_dataset.csv` (real-world integrated).

### Audit Findings:
1. **Severe Synthetic Rule & Target Leakage:** The target label `poaching_incident` is not a label representing real-world observations. It is a deterministic threshold slice of a linear combination of the input features:
   ```python
   raw_score = (
       0.20 * road_risk +
       0.15 * ranger_risk +
       0.15 * sp_value +
       0.15 * hotspot_factor +
       0.15 * acoustic_factor +
       0.10 * water_risk +
       0.10 * nocturnal_risk +
       np.random.normal(0.0, 0.06)
   )
   threshold = np.percentile(threat_scores, 92.5)
   poaching_incident = 1 if raw_score >= threshold else 0
   ```
   Because the target label is generated directly from the same features used during training, the model is not learning ecological dynamics; it is simply reverse-engineering the weights (`0.20`, `0.15`, `0.10`) of this synthetic equation. The high ROC-AUC (~93.8%) is merely a reflection of the model successfully fitting this mathematical rule.
2. **Hybrid Dataset Disconnect:** The "Hybrid Data Integration Layer" (`notebooks/09_real_data_integration.ipynb`) merges NASA SRTM elevation, OSM roads, and Open-Meteo weather data to produce `data/processed/hybrid_dataset.csv`. However, **the model training pipeline (`03_feature_engineering.ipynb` and `04_model_training.ipynb`) is completely decoupled from this hybrid dataset**. The model still trains strictly on the raw synthetic dataset. The real-world data remains 100% unused in the actual machine learning model.
3. **Unrealistic Data Correlations:** Features like `latitude`, `longitude`, `elevation`, `temperature`, `humidity`, and `rainfall` have zero mathematical influence on the target label (they are omitted from the `raw_score` formula). Despite this, the models are fed these features, prompting them to learn spurious correlations from random coincidences in the data.

---

## SECTION 3: FEATURE ENGINEERING AUDIT

Audited `notebooks/03_feature_engineering.ipynb` and the backend `PredictionService`.

### Audit Findings:
1. **Production Preprocessing Scaling Bug:** During our audit, we discovered that continuous variables (`distance_to_road`, `distance_to_ranger_station`, `acoustic_risk`, `historical_incident_count`) were being passed **unscaled** to the model in the backend prediction service (`PredictionService`). Because XGBoost was trained on scaled features (Z-scores), passing raw distance values (e.g., `15000` meters instead of standard-scaled `-0.5`) caused the model to output wildly inaccurate and unrealistic risk probabilities in production. (Note: A localized patch was recently applied to serialize and load `scaler.pkl`, but it highlights a historical failure to synchronize preprocessing pipelines between research and production).
2. **Coordinate-Based Spatial Overfitting:** The feature pipeline feeds raw `latitude` and `longitude` coordinates to the model. Since XGBoost splits on these variables directly, it draws sharp rectangular decision boxes in space. Poaching risk in the real world is continuous and driven by physical access, not arbitrary coordinate thresholds. Training on coordinate values directly leads to severe spatial overfitting.
3. **Omission of Environmental Modifiers:** Weather features like `rainfall`, `temperature`, and `humidity` are cyclical or seasonal. While the feature engineering pipeline transforms `hour` and `month` cyclical coordinates, it fails to model non-linear environmental interactions (e.g., rainfall over 15mm rendering roads impassable and suppressing threat).

---

## SECTION 4: MODEL BEHAVIOR AUDIT

We generated predictions for **100 random samples** from the validation split. By merging the scaled predictions back with their raw values from `master_dataset.csv`, we identified severe conflicts with conservation domain logic:

### Top Domain Logical Conflicts Identified:
* **Conflict A: High Poaching Risk far from Access Roads (32% of High-Risk Cases)**
  * *Example Event:* `evt_dfd3484c` in `ZONE_B05` has a predicted poaching risk of **97.18%**, yet it is **5,474.1 meters (5.4 km)** away from the nearest road. Another case (`evt_d93b3a36`) has a predicted risk of **90.03%** while located **19,165.3 meters (19.1 km)** away from any road.
  * *Reason for Failure:* Poachers require nearby roads to access the reserve, escape, and transport heavy animal carcasses (e.g., elephants or rhinos). High-risk classifications in remote wilderness areas far from roads are highly unrealistic. The model makes this error because the synthetic threat score is **additive**. If acoustic risk, historical counts, and species values are high, their combined weights override the road distance penalty. Real-world threat factors are **multiplicative** (e.g., if accessibility is zero, threat is zero).
* **Conflict B: High Risk with Zero Target Animals Detected (13% of High-Risk Cases)**
  * *Example Event:* `evt_63738add` has a predicted risk of **99.42%**, and `evt_dd91d1fe` has a predicted risk of **97.07%**, but the species column indicates **"None Detected"**.
  * *Reason for Failure:* Poachers target high-value wildlife. If there are no target species present in an area, the active poaching risk should be zero. The model predicts high risk anyway because other linear terms (like road proximity and acoustic risk) sum up to exceed the threshold.
* **Conflict C: High Risk during Impassable Torrential Rain (8% of High-Risk Cases)**
  * *Example Event:* `evt_7b56361a` has a predicted risk of **77.54%** during **29.6 mm** of rainfall.
  * *Reason for Failure:* Heavy rain in East African reserves turns dirt tracks into mud, halting vehicular access and making tracking impossible. Poaching drops to near-zero. The model fails to capture this because weather variables like `rainfall` were omitted from the synthetic target formula and therefore have no predictive weight.

---

## SECTION 5: SHAP VALIDATION

Audited the SHAP summary plots and `reports/explainability_summary.md`.

### Audit Findings:
1. **Logical within a Spurious Framework:** The SHAP plots rank the top features as `acoustic_risk`, `distance_to_road`, `distance_to_ranger_station`, and `animal_density_score`. These explanations are logical *only* because they match the exact coefficients defined in the synthetic generation code.
2. **Reliance on Deterministic Artifacts:** The SHAP values confirm that the model relies heavily on `acoustic_risk` (mean SHAP value impact) and `distance_to_road`. However, because `acoustic_risk` itself is a synthetic feature generated using `distance_to_road` and `hour`, the model is relying on a nested, self-referential chain of synthetic variables.
3. **No Representation of Real-World Dynamics:** The SHAP validation gives a false sense of security. It proves the model is explainable, but it is explaining a model that has successfully memorized a fake, additive rule-based formula rather than capturing real-world poaching patterns.

---

## SECTION 6: FORECASTING AUDIT

Audited `notebooks/08_threat_forecasting.ipynb` and `reports/threat_forecasting_report.md`.

### Catastrophic Date-Synthesis Bug Discovered:
To perform time-series forecasting, the project synthesizes dates from the raw dataset. It does so using the following code:
```python
df_sorted = df.sort_values(by=['month', 'hour']).copy()
dates = []
for m in range(1, 13):
    df_m = df_sorted[df_sorted['month'] == m]
    n_rec = len(df_m)
    max_d = days_in_month[m]
    day_vals = [int(i * max_d / n_rec) + 1 for i in range(n_rec)]
    # ...
    for d in day_vals:
        dates.append(f"2025-{m:02d}-{d:02d}")
df_sorted['date'] = pd.to_datetime(dates)
```

#### Why this destroys the forecasting engine:
1. **Sorting Correlation:** The dataset is sorted by `month` and `hour` *before* assigning sequential days of the month.
2. **Hour is Mapped to Day of Month:** Within each month, records with low hours (e.g., `hour = 0, 1, 2`) are assigned to the beginning of the month (days 1-5). Records with daytime hours are assigned to the middle of the month (days 6-24). Records with late night hours (e.g., `hour = 22, 23`) are assigned to the end of the month (days 25-31).
3. **Artificial Monthly Periodic Signal:** The synthetic poaching risk formula assigns high risk to night hours (`hour >= 22` or `hour <= 4`). Because of this sorting, poaching incidents are heavily concentrated at the beginning of each month (days 1-6) and the end of each month (days 25-31), dipping to near-zero in the middle of the month (days 7-24).
4. **Prophet Overfitting:** When Prophet is trained on this time-series, it detects a strong monthly double-peak pattern. Because this pattern repeats exactly every single month, Prophet fits this fake cycle with near-perfect confidence.
5. **Operational Failure:** The 30-day forecast and the resulting ranger deployment recommendations are entirely artificial. They represent the sorted order of simulated records, not temporal trends in poaching.

---

## SECTION 7: GEOSPATIAL AUDIT

Audited `notebooks/06_geospatial_intelligence.ipynb` and the hotspot clustering reports.

### Audit Findings:
1. **DBSCAN Configuration:** DBSCAN is configured to use the haversine metric on radian coordinates:
   ```python
   db = DBSCAN(eps=2.0 / 6371.0, min_samples=5, metric='haversine')
   ```
   While this is mathematically correct for clustering coordinates on a sphere, the underlying spatial data makes the output meaningless.
2. **Uniform Coordinates Assumption:** The raw coordinates are simulated using uniform distributions:
   ```python
   latitudes = np.random.uniform(LAT_MIN, LAT_MAX, NUM_RECORDS)
   longitudes = np.random.uniform(LON_MIN, LON_MAX, NUM_RECORDS)
   ```
   Poaching incidents in real reserves do not occur uniformly. They cluster around watering holes, migratory routes, and border crossings. Uniform random coordinate generation completely lacks real-world spatial autocorrelation.
3. **Road Corridor Artifacts:** Since the synthetic risk formula assigns high threat risk to points close to roads, the poaching incidents are simply uniform points filtered by distance to the road lines. The DBSCAN clusters (hotspots) are therefore just random groupings of points along the roads. They do not represent localized poaching camps or hotspots; they are geometric artifacts of the road coordinates.

---

## SECTION 8: ROOT CAUSE ANALYSIS

Here are the top 10 reasons why EcoGuard-ML Core produces inaccurate/unrealistic predictions, ranked by severity:

1. **Target and Rule Leakage (Critical):** The target label `poaching_incident` is created via a deterministic mathematical formula of the input features. The model is simply reverse-engineering this formula, not learning ecological dynamics.
2. **Forecasting Date-Synthesis Sorting Bug (Critical):** Sorting by `month` and `hour` maps low/high hours to the beginning/end of each month, creating a fake, strong monthly double-peak periodicity that Prophet overfits to.
3. **Unused Real-World Features (High):** Real-world weather, OSM roads, and NASA SRTM data are compiled into `hybrid_dataset.csv` but are **completely excluded** from model training, leaving the models entirely synthetic.
4. **Additive threat logic vs. Multiplicative physical constraints (High):** Poaching risk is modeled additively. This allows high values of features like `acoustic_risk` to override absolute physical constraints (e.g., predicting high risk in areas 20km from the nearest road, or in areas with zero animals).
5. **Severe Class Imbalance & Dummy High Accuracy (High):** The 7.5% incident rate allows the models to report >92.5% accuracy while maintaining a precision of only 50.0%, causing massive false-positive alert rates in production.
6. **Omission of Meteorological Factors in Risk Logic (Medium):** Weather variables like temperature, humidity, and rainfall are omitted from the target risk equation, so the model cannot learn weather-driven deterrence (e.g., rain suppressing threat).
7. **Spatial Overfitting on Latitude/Longitude Coordinates (Medium):** Feeding raw coordinates directly into XGBoost results in rectangular decision boundaries that do not generalize.
8. **Uniform Geographic Simulation (Medium):** Simulating events uniformly across a grid box ignores terrain slope, river systems, and animal behavior, resulting in unrealistic spatial layouts.
9. **Production Preprocessing Scaling Mismatches (Medium):** The production API previously passed unscaled continuous features to a model trained on scaled Z-scores, producing garbage outputs in deployment.
10. **Acoustic Risk nested synthesis (Low):** `acoustic_risk` is simulated using `distance_to_road`, creating multi-collinearity and giving the model a nested path to overfit on road distance.

---

## SECTION 9: IMPROVEMENT PLAN

| Improvement Fix | Level | Description | Estimated Impact |
|:---|:---:|:---|:---:|
| **Synchronize Model Training with Hybrid Dataset** | Immediate | Modify `03_feature_engineering.ipynb` to load `data/processed/hybrid_dataset.csv` and train the model on real-world features (`real_temperature`, `real_rainfall`, `road_density`, `terrain_slope`). | **High**: Eliminates the synthetic buffer disconnect and trains the model on actual geographical/climatic data. |
| **Fix the Date-Synthesis Bug** | Immediate | Rewrite the date generation in `08_threat_forecasting.ipynb` and `09_real_data_integration.ipynb` to assign dates randomly or sequentially *without sorting by hour*, or simulate dates using a realistic temporal process. | **Critical**: Removes the fake monthly double-peak periodicity and stops Prophet from forecasting meaningless cycles. |
| **Change Risk Logic to Multiplicative Constraints** | Medium-Term | Change the target label formula (or modeling architecture) to use multiplicative constraints (e.g., Poaching Risk = Accessibility $\times$ Animal Presence $\times$ Acoustic Indicator). | **High**: Eliminates logical domain conflicts (e.g., zero risk when there are no roads or no animals). |
| **Implement Stratified Subsampling & Threshold Tuning** | Medium-Term | Apply SMOTE or random undersampling during feature engineering, and tune the XGBoost classification threshold to maximize F1-score rather than using a static 0.50 cutoff. | **High**: Reduces the false positive rate (precision) from 50% to under 15%, minimizing ranger alert fatigue. |
| **Drop Latitude/Longitude Coordinate Splitting** | Medium-Term | Remove raw `latitude` and `longitude` from modeling features, and rely instead on isotropic spatial variables (e.g., distance to boundaries, road density, slope). | **Medium**: Eliminates rectangular coordinate overfitting. |
| **Ingest Actual Poaching Data** | Long-Term | Replace synthetic target labels with actual historical poaching incident records collected from patrol logs (e.g., snare locations, camp footprints). | **Critical**: Ground-truths the model on real-world threat patterns instead of synthetic rules. |

---

## SECTION 10: FINAL VERDICT

1. **Is the model trustworthy?**  
   **NO.** The model is not trustworthy. It has only learned to reverse-engineer a deterministic, synthetic formula. Additionally, its low precision (50.0%) means that half of its alerts are false alarms, which would exhaust ranger patrol resources in the field.
2. **Is the dataset trustworthy?**  
   **NO.** The dataset is purely synthetic and suffers from severe target leakage. The integrated hybrid dataset contains real-world data, but because it is merged using a broken temporal link (hour-day mapping) and is completely ignored during model training, the dataset remains a synthetic sandbox.
3. **Is the forecasting trustworthy?**  
   **NO.** The forecasting engine is completely broken. Because the date synthesis pipeline sorts data by hour before assigning days of the month, it introduces a massive artificial double-peak monthly cycle. Prophet is forecasting a sorting artifact, not actual time-series trends.
4. **Is the geospatial intelligence trustworthy?**  
   **NO.** The geospatial hotspots are clusters of uniform random points filtered by proximity to simulated straight-line roads. They represent geometric artifacts of the simulation boundary, not real poaching threat centers.
5. **What is the single biggest problem in the project?**  
   The single biggest problem in the project is **Target/Synthetic Rule Leakage** combined with the **Catastrophic Date-Synthesis sorting bug**. The machine learning pipelines are completely isolated from real-world physics, ecological behaviors, or correct temporal progressions, creating a closed-loop system that generates mathematically high performance metrics but has zero real-world validity.
