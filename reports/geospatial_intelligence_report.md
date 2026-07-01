# Geospatial Wildlife Threat Intelligence Report: EcoGuard-ML Core
*Prepared for the Wildlife Conservation Authority*
*Date: 2026-06-20*

## Executive Summary
This report delivers key spatial insights into wildlife poaching threat vectors within the reserve. Using density-based spatial clustering (DBSCAN) and localized machine learning threat predictions, we identify high-density poaching hotspots and rank management zones for patrol optimization. These models allow wildlife authorities to allocate ranger units effectively, maximizing field deterrent capabilities.

---

## Hotspot Cluster Analysis
We applied DBSCAN clustering to the coordinates of all active poaching incidents. With a clustering radius constraint of **2.0 km** and a density threshold of **5 incidents**, we identified:
*   **Total Hotspot Clusters**: 5
*   **Noise Points (Isolated Incidents)**: 266

These clusters point to systematic threat gateways, typically located near park access paths or adjacent to community boundaries. 

*   Detailed Cluster CSV Data: [high_risk_clusters.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/high_risk_clusters.csv)
*   Interactive Cluster Map: [hotspot_clusters.html](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/hotspot_clusters.html)

---

## Top 10 High-Risk Monitoring Zones
The table below ranks the top 10 most dangerous zones in the reserve based on predicted threat probability, active incidents, and historical footprints:

| Rank | Zone ID | Avg Predicted Risk | Active Incident Count | Avg Acoustic Risk | Historical Incidents |
|:---:|:---|:---:|:---:|:---:|:---:|
| 9 | ZONE_B04 | 0.1652 | 119 | 0.2945 | 1.0 |
| 6 | ZONE_B01 | 0.1609 | 23 | 0.2679 | 29.0 |
| 3 | ZONE_A03 | 0.1526 | 105 | 0.2857 | 6.0 |
| 8 | ZONE_B03 | 0.1456 | 100 | 0.2815 | 3.0 |
| 1 | ZONE_A01 | 0.1411 | 21 | 0.2684 | 18.0 |
| 2 | ZONE_A02 | 0.1362 | 22 | 0.2806 | 26.0 |
| 7 | ZONE_B02 | 0.1292 | 22 | 0.2638 | 22.0 |
| 4 | ZONE_A04 | 0.1171 | 75 | 0.2800 | 0.0 |
| 16 | ZONE_D01 | 0.1115 | 19 | 0.2660 | 7.0 |
| 5 | ZONE_A05 | 0.1057 | 19 | 0.2686 | 7.0 |

*   Complete Ranking CSV: [high_risk_zones.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/high_risk_zones.csv)
*   Interactive Risk Heatmap: [risk_heatmap.html](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/risk_heatmap.html)

---

## Tactical Ranger Patrol Recommendations
Ranger patrol priorities were computed using risk prediction metrics and real-time acoustic alert indices:
1. **High Priority Patrol Zones (Score >= 70)**: Requires **Daily patrols (2-3 times per 24 hours)**. Direct deployment instantly to zones like `ZONE_B04`.

2. **Medium Priority Patrol Zones (35 <= Score < 70)**: Requires **Bi-weekly patrols (3-4 times per week)**. Focus on access corridors and waterhole nodes.
3. **Low Priority Patrol Zones (Score < 35)**: Requires **Weekly routine patrols**.

*   Patrol Allocations CSV: [ranger_priorities.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/ranger_priorities.csv)

---

## Sensor Deployment Recommendations
*   **Acoustic Network Expansion**: Deploy supplementary acoustic sensors in `ZONE_B04` and adjacent clusters (Hotspots #0 and #1) to improve detection coverage.

*   **Grid Gaps**: Expand sensors along region boundaries where predicted threat probability is elevated but active incident density remains low.

## Future Monitoring Recommendations
1. **Dynamic Risk Ingestion**: Update spatial maps weekly with recent ranger patrol reports to prevent geographical model stale-out.
2. **Topographic Path-finding**: Integrate elevation grids with ranger priorities to compute path difficulty vectors, facilitating optimal route planning.