# Operations Research Report: Patrol Route Optimization
*Prepared for the Wildlife Conservation Command Center*
*Date: 2026-06-20*

## Route Optimization Summary
This report presents our operational routing analysis to optimize daily ranger patrol routes using the **EcoGuard-ML Core** threat predictions. By modeling the reserve as a connected graph and incorporating a localized terrain cost function (accounting for elevation gradients, off-road distance, and river proximity), we construct optimal patrol routes. 

Instead of routing rangers along straight-line paths, our terrain-aware A* routing engine navigates *around* high-difficulty obstacles (like steep ridges and thick marshlands), ensuring routes remain walkable and efficient for field forces.

---

## High-Priority Target Regions
Based on our multi-factor Priority Score (derived from ML risk probability, acoustic warning alerts, and historical poaching hotspots), the top 5 zones requiring urgent patrol presence are:

| Rank | Zone ID | Priority Score | Avg Risk Score | Avg Acoustic Alert | Historical incident Count |
|:---:|:---|:---:|:---:|:---:|:---:|
| 7 | ZONE_B02 | 100.00 | 0.4914 | 0.2852 | 33.0 |
| 6 | ZONE_B01 | 93.95 | 0.4561 | 0.2773 | 31.0 |
| 1 | ZONE_A01 | 65.99 | 0.1771 | 0.2678 | 24.0 |
| 2 | ZONE_A02 | 58.85 | 0.2182 | 0.2705 | 20.0 |
| 15 | ZONE_D04 | 41.80 | 0.0876 | 0.2571 | 15.0 |

*   Complete Patrol Plan CSV: [patrol_plan.csv](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/patrol_plan.csv)
*   Interactive Mapped Routes: [patrol_routes.html](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/reports/patrol_routes.html)

---

## Patrol Route Coverage Analysis
We generated 3 optimized patrol routes originating from our major ranger outposts:

1.  **North Ranger Station (`ZONE_A01`) Route**:
    *   **Deployment Coverage**: Covers northern reserve boundaries.
    *   **Total Distance**: 90.06 km
    *   **Estimated Walking Time**: 6.00 hours
2.  **Central Ranger Station (`ZONE_C01`) Route**:
    *   **Deployment Coverage**: Integrates high-risk hotspots like `ZONE_B02`.
    *   **Total Distance**: 76.77 km
    *   **Estimated Walking Time**: 5.12 hours
3.  **South Ranger Station (`ZONE_E01`) Route**:
    *   **Deployment Coverage**: Directs patrols around waterhole migration tracks.
    *   **Total Distance**: 62.93 km
    *   **Estimated Walking Time**: 4.20 hours

### Summary Performance Metrics
*   **Average Patrol Distance**: 76.59 km
*   **High-Risk Threat Coverage Rate**: 57.1%
*   **Total Routing Footprint**: 229.76 km
*   **Patrol Efficiency Index**: 2.487

---

## Operational Recommendations

### 1. Route Prioritization
*   The **Central Ranger Route** must receive the highest daily dispatch priority. It directly intersects the Serengeti's most critical threat corridors, including `ZONE_B02`, which carries a predicted poaching probability of `0.4914`.
*   Maximize patrol presence on the **South Ranger Route** during dry-season periods to protect animal density clusters.

### 2. Forward Outpost (Station) Additions
*   A new permanent ranger station should be constructed in **Region D (e.g. adjacent to ZONE_D02)**. Currently, Region D requires routes over 62.93 km from South Station, leading to delayed interception capabilities.

### 3. Overcoming Accessibility Hotspots
*   Establish temporary fly-camps in **high elevation/dense vegetation grids** during the dry season. These areas have high terrain cost scores (>8.0), making them difficult to access in routine 24-hour patrols.

---

## Future Improvements
1. **Dynamic Edge-Weight Updates**: Update edge travel costs dynamically using daily rainfall data. Wet weather increases soil clay stickiness, changing route walking times.
2. **UAV Patrol Integration**: Deploy quadcopter drone routes over high terrain-cost nodes where foot patrols are inefficient.
3. **Collar-Guided Interception**: Integrate real-time collared Elephant/Rhino coordinates to dynamically pull route paths toward active wildlife clusters.