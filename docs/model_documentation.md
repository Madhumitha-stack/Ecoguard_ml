# EcoGuard-ML Core: Machine Learning Documentation

This document describes the data engineering, mathematical formulas, feature design, training process, and evaluation metrics for the **EcoGuard-ML Core** risk prediction model.

---

## 1. Multiplicative Probability Formulation

To prevent target leakage and unrealistic correlation parameters (where risk was deterministically derived from static linear score boundaries), the simulation logic uses a multiplicative stochastic probability formulation. The probability of a poaching incident occurring at a given time and coordinate is defined as:

$$P(\text{Incident}) = P_{\text{nocturnal}} \times P_{\text{rain}} \times P_{\text{road}} \times P_{\text{ranger\_deterrence}} \times \text{Attractors}$$

Where:
1.  **Temporal nocturnal Risk ($P_{\text{nocturnal}}$):** Peak risk is modeled at night and pre-dawn, represented by:
    $$P_{\text{nocturnal}} = 0.5 + 0.4 \times \cos\left(\frac{2\pi \times (\text{hour} - 2)}{24}\right)$$
2.  **Rainfall Suppression ($P_{\text{rain}}$):** Heavy rain suppresses poacher movement:
    $$P_{\text{rain}} = \exp(-0.02 \times \text{rainfall})$$
3.  **Road Accessibility Corridor ($P_{\text{road}}$):** Shorter distance to access roads increases risk:
    $$P_{\text{road}} = \exp\left(-\frac{\text{distance\_to\_road}}{2500}\right)$$
4.  **Ranger Post Deterrence ($P_{\text{ranger\_deterrence}}$):** Proximity to ranger posts suppresses risk:
    $$P_{\text{ranger\_deterrence}} = 1.0 - 0.85 \times \exp\left(-\frac{\text{distance\_to\_ranger\_station}}{4000}\right)$$
5.  **Acoustic & Wildlife Attractors ($\text{Attractors}$):** Risk scaling factor derived from animal concentrations and immediate sound triggers:
    $$\text{Attractors} = \left(0.3 + 0.7 \times \frac{\text{animal\_density\_score}}{100}\right) \times (1.0 + 1.5 \times \text{acoustic\_risk})$$

The final target binary label `poaching_incident` is sampled stochastically using a Bernoulli trial:
$$\text{poaching\_incident} \sim \text{Bernoulli}(P(\text{Incident}))$$

---

## 2. Spatial Hotspot Modeling (Gaussian Mixtures)

Instead of dispersing coordinates uniformly, spatial locations are simulated around key geographical attractors:
*   **Waterholes & Rivers:** Simulated using a Gaussian distribution centered near water features to represent wildlife concentration points.
*   **Border Corridors:** Multi-modal clusters modeled using a Gaussian Mixture Model (GMM) representing key entry points along reserve boundaries where poachers are likely to cross.
*   **Ranger Posts:** Patrol start coordinates dispersed around ranger outposts with decreasing frequency.

---

## 3. Temporal De-biasing Strategy

Original iterations mapped timestamps to cyclic features by tying hours directly to monthly indices, creating artificial, highly predictable cyclic peaks that overfit forecasting engines (like Prophet). 
*   **The Fix:** Timestamps are generated chronologically using exponential arrival intervals representing poaching incidents. The time of day (hour) is evaluated independently and shuffled before day assignments to prevent date-hour correlation leakage.

---

## 4. Feature Engineering

1.  **Temporal Cyclic Encoding:** The `hour` is mapped to sine and cosine parameters to preserve temporal continuity between `23:00` and `00:00`:
    $$\text{hour\_sin} = \sin\left(\frac{2\pi \times \text{hour}}{24}\right), \quad \text{hour\_cos} = \cos\left(\frac{2\pi \times \text{hour}}{24}\right)$$
    $$\text{month\_sin} = \sin\left(\frac{2\pi \times \text{month}}{12}\right), \quad \text{month\_cos} = \cos\left(\frac{2\pi \times \text{month}}{12}\right)$$
2.  **GIS distance Features:** Coordinates are projected to local coordinate reference systems (UTM) to output distance parameters in meters rather than degrees.
3.  **Leakage-Free Standard Scaling:** The standard scaler is fitted strictly on the training matrix and used to transform the test and validation sets independently to prevent data leakage.

---

## 5. Model Evaluation Metrics

The retrained classifiers were evaluated on a stratified test partition:

| Model | Accuracy | Precision (Threat) | Recall (Threat) | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 95.27% | 76.12% | 48.11% | 0.5896 | 0.9268 |
| **Random Forest** | **95.67%** | **82.54%** | **49.06%** | **0.6154** | **0.9252** |
| **XGBoost Classifier** | 93.53% | 53.72% | 61.32% | 0.5727 | 0.9236 |

*Evaluation:*
*   The **Random Forest** classifier achieved the highest F1-score (**0.6154**), making it the chosen production model.
*   The normalized ROC-AUC values of **~0.925** indicate that the model is highly robust, avoiding the artificial over-indexing of previous leaky pipelines.

---

## 6. Scientific Explainability (SHAP Audit)

SHAP values were calculated on the Random Forest ensemble using `TreeExplainer`:
1.  **`distance_to_road`** ($|SHAP| = 0.0449$): The strongest indicator. Proximity to road corridors correlates strongly with incident probability.
2.  **`hour_cos`** ($|SHAP| = 0.0288$): Captures nocturnal cycles. Late-night and early-morning incidents are significantly more common.
3.  **`animal_density_score`** ($|SHAP| = 0.0170$): Confirms that poachers target wildlife hotspots.
4.  **`acoustic_risk`** ($|SHAP| = 0.0166$): Shows that active sensor detections of acoustic anomalies immediately flag zones as high risk.
5.  **`distance_to_ranger_station`** ($|SHAP| = 0.0047$): Validates ranger post deterrence effects.
