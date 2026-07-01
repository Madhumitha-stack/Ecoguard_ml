# Geospatial Wildlife Threat Intelligence Report: EcoGuard-ML Core
*Prepared for the Wildlife Conservation Authority*
*Date: 2026-06-20*

## Executive Summary
This report delivers key spatial insights into wildlife poaching threat vectors within the reserve. Using density-based spatial clustering (DBSCAN) and localized machine learning threat predictions, we identify high-density poaching hotspots and rank management zones for patrol optimization. These models allow wildlife authorities to allocate ranger units effectively, maximizing field deterrent capabilities.

---

## Hotspot Cluster Analysis
We applied DBSCAN clustering to the coordinates of all active poaching incidents. With a clustering radius constraint of **2.0 km** and a density threshold of **5 incidents**, we identified:
*   **Total Hotspot Clusters**: 19
*   **Noise Points (Isolated Incidents)**: 417

These clusters point to systematic threat gateways, typically located near park access paths or adjacent to community boundaries. 

*   Detailed Cluster CSV Data: [high_risk_clusters.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/high_risk_clusters.csv)
*   Interactive Cluster Map: [hotspot_clusters.html](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/hotspot_clusters.html)

---

## Top 10 High-Risk Monitoring Zones
The table below ranks the top 10 most dangerous zones in the reserve based on predicted threat probability, active incidents, and historical footprints:

| Rank | Zone ID | Avg Predicted Risk | Active Incident Count | Avg Acoustic Risk | Historical Incidents |
|:---:|:---|:---:|:---:|:---:|:---:|
| 7 | ZONE_B02 | 0.4914 | 159 | 0.2852 | 33.0 |
| 6 | ZONE_B01 | 0.4561 | 149 | 0.2773 | 31.0 |
| 2 | ZONE_A02 | 0.2182 | 68 | 0.2705 | 20.0 |
| 1 | ZONE_A01 | 0.1771 | 51 | 0.2678 | 24.0 |
| 10 | ZONE_B05 | 0.1341 | 37 | 0.2696 | 6.0 |
| 4 | ZONE_A04 | 0.0898 | 25 | 0.2633 | 6.0 |
| 17 | ZONE_D02 | 0.0883 | 27 | 0.2718 | 5.0 |
| 19 | ZONE_D04 | 0.0876 | 24 | 0.2571 | 15.0 |
| 22 | ZONE_E02 | 0.0766 | 20 | 0.2523 | 1.0 |
| 16 | ZONE_D01 | 0.0725 | 24 | 0.2706 | 3.0 |

*   Complete Ranking CSV: [high_risk_zones.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/high_risk_zones.csv)
*   Interactive Risk Heatmap: [risk_heatmap.html](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/risk_heatmap.html)

---

## Tactical Ranger Patrol Recommendations
Ranger patrol priorities were computed using risk prediction metrics and real-time acoustic alert indices:
1. **High Priority Patrol Zones (Score >= 70)**: Requires **Daily patrols (2-3 times per 24 hours)**. Direct deployment instantly to zones like `ZONE_B02`.

2. **Medium Priority Patrol Zones (35 <= Score < 70)**: Requires **Bi-weekly patrols (3-4 times per week)**. Focus on access corridors and waterhole nodes.
3. **Low Priority Patrol Zones (Score < 35)**: Requires **Weekly routine patrols**.

*   Patrol Allocations CSV: [ranger_priorities.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/ranger_priorities.csv)

---

## Sensor Deployment Recommendations
*   **Acoustic Network Expansion**: Deploy supplementary acoustic sensors in `ZONE_B02` and adjacent clusters (Hotspots #0 and #1) to improve detection coverage.

*   **Grid Gaps**: Expand sensors along region boundaries where predicted threat probability is elevated but active incident density remains low.

## Future Monitoring Recommendations
1. **Dynamic Risk Ingestion**: Update spatial maps weekly with recent ranger patrol reports to prevent geographical model stale-out.
2. **Topographic Path-finding**: Integrate elevation grids with ranger priorities to compute path difficulty vectors, facilitating optimal route planning.