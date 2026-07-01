# Operations Briefing: Wildlife Threat Forecasting
*Prepared for the Wildlife Conservation Command Center*
*Date: 2026-06-20*

## Executive Summary
This report delivers predictive threat intelligence for the upcoming **30-day forecast horizon** in the reserve. Using the Prophet additive forecasting model, we analyze historical trends, diurnal variations, and seasonal poaching cycles. 

Our models indicate that poaching threat levels are highly seasonal, showing significant escalations during the dry transitions when weather conditions favor vehicular accessibility and animal grouping. These predictive models enable wildlife authorities to allocate patrol assets *before* incursions occur.

---

## 30-Day Poaching Trend Forecast
Our daily Prophet model forecasts poaching counts across the reserve network:
*   **Forecast Horizon**: 30 Days (Jan 1, 2026 to Jan 30, 2026)
*   **Model Baseline MAE**: 0.6327
*   **Model Baseline RMSE**: 0.7693

*   Daily Forecast Visualizations: [forecast_30day.png](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/forecast_30day.png)
*   7-Day Zoom Comparison: [forecast_7day.png](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/forecast_7day.png)

---

## Top 10 Binned Zone Forecasts
The table below displays the 30-day forecasted threat averages, risk classifications, and escalation directions for the reserve's top 10 zones:

| Zone ID | Historical Avg (30d) | Forecasted Avg (30d) | Future Threat Level | Escalation Risk |
|:---|:---:|:---:|:---:|:---:|
| ZONE_B02 | 0.633 | 0.452 | High | Low |
| ZONE_B01 | 0.133 | 0.362 | High | High |
| ZONE_A02 | 0.300 | 0.102 | Medium | Low |
| ZONE_A01 | 0.100 | 0.112 | Medium | Medium |
| ZONE_B05 | 0.033 | 0.121 | Medium | High |
| ZONE_A04 | 0.167 | 0.068 | Medium | Low |
| ZONE_D02 | 0.067 | 0.735 | High | High |
| ZONE_D04 | 0.000 | 0.110 | Medium | Low |
| ZONE_E02 | 0.033 | 0.114 | Medium | High |
| ZONE_D01 | 0.067 | 0.086 | Medium | High |

*   Complete Zone Forecast Visualizations: [zone_forecasts.png](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/zone_forecasts.png)

---

## Conservation Early Warning Alerts
The Early Warning System flagged the following zones based on temporal and sensor telemetry anomalies:
1.  **Late-Night Poaching Anomalies (Night Ratio > 40%)**:
    *   Grids like `ZONE_B02` and `ZONE_B01` show high night-time incident frequencies, indicating poachers exploit the cover of darkness. Focus patrols between **22:00 and 04:00**.
2.  **Acoustic Risk Index Escalation**:
    *   Acoustic sensors report alert counts (gunshots, chainsaws) rising in Region B and Region D, suggesting active incursions.
3.  **Hotspot Recidivism**:
    *   Historical target sectors remain highly vulnerable.

*   Detailed Warning Alerts Log: [warning_alerts.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/warning_alerts.csv)

---

## Tactical Resource Allocations
We recommend reallocating field forces according to forecasted threat probabilities:
*   **Highest Priority (ZONE_D02)**: Requires **Daily patrols (2-3 times per 24 hours)**. Predicts 0.735 average daily incidents.

*   **Region B grids**: Establish permanent checkpoints along northern boundary access roads.
*   **Low Risk Zones**: Reallocate ranger resources from low-risk grids to training and administrative duties during heavy rain cycles.

*   Patrol Allocations Log: [forecast_patrol_recommendations.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/forecast_patrol_recommendations.csv)

---

## Future Improvements
1. **Stan Integration**: Incorporate holidays and local climate indicators directly into the Prophet model parameters.
2. **Dynamic Regressors**: Incorporate real-time daily weather predictions as dynamic regressors to capture rain-fade effects on poaching.
3. **Collar Telemetry Loops**: Stream GPS path data from collared herds directly into the time-series models to adapt to animal movement shifts.