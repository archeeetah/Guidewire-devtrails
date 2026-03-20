# SafeZone: AI-Powered Parametric Income Protection for Gig Workers

**Project for Guidewire DEVTrails 2026 Hackathon**

## 1. Core Vision & Strategy
SafeZone is an AI-powered parametric insurance platform designed exclusively to safeguard the livelihoods of India’s platform-based delivery partners. Our mission is to provide an automated financial safety net against income loss caused by uncontrollable external disruptions.

### Target Personas
- **Zomato/Swiggy Delivery Partners**: Facing extreme heatwaves or heavy monsoons.
- **Amazon/Flipkart Logistical Partners**: Facing unplanned curfews or market closures.
- **Zepto/Blinkit Partners**: Facing severe pollution (AQI > 400) or localized strikes.

## 2. The Weekly Premium Model
Gig workers operate on a week-to-week earning cycle. SafeZone aligns with this reality by structuring all policies on a **Weekly basis**.
- **Base Premium**: A low-cost entry fee (e.g., ₹20/week).
- **AI-Dynamic Adjustment**: Our risk model adjusts the premium based on the upcoming week's hyper-local weather forecast and historical disruption data for the user’s specific zone.

## 3. Parametric Triggers
SafeZone eliminates the need for manual claims. Payouts are triggered automatically when predefined external parameters are met:
- **Environmental**: Heavy Rain (>30mm in 3h), Extreme Heat (>45°C), Flooding.
- **Social/Operational**: Government-mandated curfews, Sudden zone closures (Simulated via platform APIs).

## 4. AI/ML Integration Plans
- **Dynamic Risk Assessment**: Processing weather and traffic data to predict income loss volatility per zone.
- **Intelligent Fraud Detection**:
    - **GPS Validation**: Cross-referencing claim triggers with the worker's real-time location.
    - **Anomaly Detection**: Identifying spoofed weather reporting or duplicate claim attempts.
- **Predictive Analytics**: Helping workers identify which hours/zones are most likely to be high-risk before the week starts.

## 5. Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion (Universal animations).
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL.
- **AI/ML**: Python (Scikit-learn/Prophet for time-series risk prediction).
- **Integrations**: OpenWeather API, Google Maps Platform (Traffic), Razorpay (Simulated payouts).

## 6. Development Plan (6-Week Roadmap)
- **Phase 1 (Ideation)**: Strategy Document & Prototype (Persona Selection).
- **Phase 2 (Automation)**: Policy Management & Automated Trigger Demo.
- **Phase 3 (Optimization)**: Advanced Fraud Detection & Multi-Persona Analytics Dashboard.

## 7. Adversarial Defense & Anti-Spoofing Strategy (Phase 1 - Market Crash Response)
When a coordinated fraud ring attempts to drain the platform using fake GPS signals to exploit environmental/curfew triggers, simple GPS validation is no longer enough. SafeZone employs a multi-layered, zero-trust logical architecture to defend the liquidity pool:

### A. Spotting the Faker vs. Genuinely Stranded Worker
**1. Trajectory & Velocity Degradation Curves**  
Real drivers reacting to a sudden flood or curfew do not "teleport" or instantly appear stationary. Their telemetry data will show an organic deceleration curve alongside route diversions. Fakers using GPS spoofing software typically jump coordinates instantaneously between lucrative payout zones, bypassing physical travel constraints.  
**2. Z-Axis (Altitude) Inconsistencies**  
Spoofing rings optimize for 2D map manipulation (X, Y). A worker stranded in a flooded urban underpass will reflect an altitude drop consistent with local topography. Most spoofers fail to fake the Z-axis, reporting a flat '0' or static sea-level altitude over hilly terrain.

### B. Data Fingerprints that Catch a Fraud Ring
**1. IMU (Inertial Measurement Unit) & Micro-Vibration Absences**  
A farm of emulators sitting on a desk has completely static gyroscope and accelerometer outputs. A genuinely stranded worker sitting on their bike in the rain will naturally generate micro-movements, device sway, and screen-tilt data.  
**2. Perfect Spatial Synchronicity (The Mathematical Impossibility)**  
If 500 payouts are claimed within a specific flood zone, genuine claims will cluster randomly across disparate time intervals along blocked topological arteries. If 500 pings hit our servers displaying perfectly equidistant spread or arriving at the exact same millisecond, the statistical variance drops to zero, triggering an immediate Liquidity Lockdown for that zone.  
**3. Network Vector Squeezes**  
Even if a syndicate spoofs 500 unique GPS locales, their network requests often exit out of a shared bottleneck (a single IP proxy, identical ISP routing tables, or a singular local cell-tower ID). Analyzing the underlying TCP headers easily collapses their 500 identities into a single attacker.

### C. Flagging Bad Actors Without Punishing Honest Ones
**1. Progressive Trust & Step-Up Verification**  
Instead of freezing funds, anomalous GPS behavior triggers a "Proof of Environment" challenge. We do not ban them; we simply require the app to activate the microphone for 3 seconds. The audio frequency of torrential monsoon rain and traffic is incredibly distinct and mathematically verifiable against the user's claimed environment. Fakers are denied payout by failing to provide the physical proof; honest workers seamlessly auto-verify in the background.  
**2. Consensus Grid Validation**  
We leverage trusted nodes (delivery partners with a >1 year history of honest claims and flawless trajectory data). If our "trusted nodes" operating in a specific Grid Cell are moving seamlessly at 30km/h, but a cluster of brand-new, unvetted accounts suddenly claims to be "stranded due to flooding" in that exact same Grid Cell, the new accounts are flagged for strict manual review, while the platform remains fluid for everyone else.
