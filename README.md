# ShramShield: AI-Powered Parametric Income Protection for Gig Workers

**Project for Guidewire DEVTrails 2026 Hackathon**

## 1. Core Vision & Strategy
ShramShield is an AI-powered parametric insurance platform designed exclusively to safeguard the livelihoods of India’s platform-based delivery partners. Our mission is to provide an automated financial safety net against income loss caused by uncontrollable external disruptions.

### Target Personas
- **Zomato/Swiggy Delivery Partners**: Facing extreme heatwaves or heavy monsoons.
- **Amazon/Flipkart Logistical Partners**: Facing unplanned curfews or market closures.
- **Zepto/Blinkit Partners**: Facing severe pollution (AQI > 400) or localized strikes.

### Problem Statement  

India’s gig delivery workforce operates in highly volatile working conditions where **income depends on uncontrollable environmental and operational factors**.

Common income disruption causes include:

- Heavy rainfall and floods  
- Extreme heat and high pollution levels  
- Traffic congestion and curfews  
- Sudden order demand drops  
- Platform outages  

Existing insurance solutions are **reactive, slow, and not aligned with daily wage earning cycles.**

ShramShield AI addresses this gap through **predictive, automated parametric income protection.**

# 🌐 Why Progressive Web App (PWA)?  

We selected a **PWA architecture** to maximise accessibility for gig workers.

### Benefits  

- Works on low-storage smartphones  
- Offline-first capability  
- No app store dependency  
- Faster onboarding and updates  
- Cross-platform compatibility  
- Reduced data consumption  

This ensures **scalable adoption across diverse worker segments.**

## 2. The Weekly Premium Model
Gig workers operate on a week-to-week earning cycle. ShramShield aligns with this reality by structuring all policies on a **Weekly basis**.
- **Base Premium**: A low-cost entry fee (e.g., ₹20/week).
- **AI-Dynamic Adjustment**: Our risk model adjusts the premium based on the upcoming week's hyper-local weather forecast and historical disruption data for the user’s specific zone.

## Base Premium Threshold (Example)

| Weekly Earnings | Premium Percentage |
|---------------|------------------|
| Less than ₹500 | 5% |
| ₹500 – ₹1500 | 10% |
| ₹1500 – ₹3000 | 15% |

Final weekly premium is computed as a percentage of estimated weekly earnings with a minimum base premium floor

## Hyper-Local Risk Adjustment  

Premium is dynamically modified using AI-based risk factors:

- Flood-prone delivery zone → higher premium  
- Historically safe zone → premium discount  
- Forecasted high disruption week → increased coverage  

Example:

- Calculated Premium = ₹60/week  
- Safe zone discount = ₹2  
- Final Premium = ₹58/week  


## 3. Parametric Triggers
ShramShield eliminates the need for manual claims. Payouts are triggered automatically when predefined external parameters are met:
- **Environmental**: Heavy Rain (>30mm in 3h), Extreme Heat (>45°C), Flooding.
- **Social/Operational**: Government-mandated curfews, Sudden zone closures (Simulated via platform APIs).

## 4. AI/ML Integration Plans
- **Dynamic Risk Assessment**: Processing weather and traffic data to predict income loss volatility per zone.
  **Suggested Models:**  Gradient Boosting, Random Forest
  
- **Intelligent Fraud Detection**:
    - **GPS Validation**: Cross-referencing claim triggers with the worker's real-time location.
    - **Anomaly Detection**: Identifying spoofed weather reporting or duplicate claim attempts.
- **Predictive Analytics**: Helping workers identify which hours/zones are most likely to be high-risk before the week starts.

- **Behavioural Risk Score**:  
Inspired by credit scoring systems.
AI evaluates:
- Worker reliability  
- Working hour consistency  
- Claim frequency patterns  
- Location switching behaviour  

Stable workers receive **lower premium incentives.**

## 5️⃣ AI Earnings Stabilizer Recommendation Engine  

The platform acts as an **income guidance assistant** by suggesting:
- Optimal working hours  
- Safer delivery zones  
- High demand time slots  

This enhances worker productivity beyond insurance coverage.

# Voice-First Accessibility  
To improve usability for diverse worker demographics:

- Hindi / Tamil voice claim assistant  (Example languages)
- Voice-guided onboarding  
- Chatbot support  

This ensures **inclusive digital access.**

## 5. Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion,Mapbox/Leaflet..
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL.
- **AI/ML**: Python (Scikit-learn/Prophet for time-series risk prediction),LightGBM / XGBoost.
- **Integrations**: OpenWeather API, Google Maps Platform (Traffic), Razorpay (Simulated payouts).
- **Cloud Deployment**: AWS

# 🔗 Public APIs & Integrations  

### Weather Data  
OpenWeatherMap  
https://openweathermap.org/api  

### Air Quality Index  
OpenAQ  
https://openaq.org  

### Traffic Data  
TomTom Traffic API  
https://developer.tomtom.com  

### Maps & Geospatial Visualization  
Mapbox SDK  
https://www.mapbox.com  

### Payment Gateway Simulation  
Razorpay Test Mode  
https://razorpay.com/docs/payments/payments/test-card-details  

### Voice Processing  
Web Speech API  
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API  

## 6. Development Plan (6-Week Roadmap)
- **Phase 1 (Ideation)**: Strategy Document & Prototype (Persona Selection).
- **Phase 2 (Automation)**: Policy Management & Automated Trigger Demo.
- **Phase 3 (Optimization)**: Advanced Fraud Detection & Multi-Persona Analytics Dashboard.

## 7. 🚨 Adversarial Defense & Anti-Spoofing Strategy (Phase 1)

During large-scale disruption events such as severe weather alerts, curfews, or sudden demand crashes, ShramShield must safeguard its automated parametric payout system from coordinated GPS-spoofing fraud rings attempting to drain the insurance liquidity pool.

To address this threat, ShramShield implements a **multi-layered zero-trust validation architecture** combining behavioural mobility intelligence, sensor fusion, spatial analytics, and confidence-based payout decision logic.

### A. Differentiating Genuine vs Spoofed Stranded Workers  

ShramShield’s AI engine analyses real-world movement physics and telemetry degradation patterns rather than relying on static GPS coordinates.

- **Trajectory & Velocity Degradation Curves:**  
  Genuine delivery partners reacting to floods or curfews exhibit organic deceleration patterns, route diversions, and stoppage clusters.  
  Spoofers typically generate unrealistic coordinate “teleportation” jumps between payout-eligible zones.

- **Z-Axis Terrain & Altitude Consistency:**  
  Real disruptions occurring in underpasses, flyovers, or water-logged roads produce measurable elevation deviations aligned with local topography.  
  GPS spoofing tools often simulate only 2-dimensional location vectors.

- **IMU Sensor Fusion Validation:**  
  Accelerometer and gyroscope micro-vibrations generated by real field conditions (device sway, rain-induced movement, bike idle oscillations) help distinguish genuine stranded workers from emulator-based spoofing farms.

These behavioural mobility signals feed into the **Behavioural Confidence component** of ShramShield’s claim validation engine.

### B. Data Fingerprints for Detecting Coordinated Fraud Rings  

ShramShield extends fraud detection beyond individual devices by analysing macro-level claim distribution intelligence.

- **Perfect Spatial Synchronicity Detection:**  
  Genuine disruption claims show stochastic geographic clustering, whereas spoofed claims often demonstrate mathematically uniform spatial spread or identical timestamp bursts.

- **Temporal Claim Surge Analytics:**  
  Statistically improbable high-density claim submissions within narrow time windows trigger automated anomaly flags.

- **Network Vector Correlation:**  
  Fraud rings frequently route multiple spoofed identities through shared proxy gateways, identical ISP routing paths, or common cellular tower identifiers.  
  Network fingerprint clustering enables early syndicate detection.

- **Demand-Signal Cross Validation:**  
  Claimed disruption zones are correlated with real delivery demand drops, congestion indices, and platform operational signals to verify authenticity.

These macro fraud indicators contribute to the **Cluster Confidence component** of the payout decision model.

### C. Fair Handling of Flagged Claims (UX Balance Mechanism)

ShramShield ensures that fraud prevention does not unintentionally penalize honest gig workers facing genuine network disruptions or severe environmental conditions.

- **Progressive Trust & Step-Up Verification:**  
  Claims exhibiting moderate anomaly scores trigger passive “Proof-of-Environment” validation such as short ambient audio sampling or activity confirmation prompts rather than immediate payout denial.

- **Consensus Grid Validation via Trusted Workers:**  
  Claims are cross-verified against high-reliability delivery partners operating within the same geo-grid.  
  If trusted nodes display normal mobility while new accounts report simultaneous disruption, suspicious accounts are flagged for secondary verification.

This adaptive workflow preserves **automation speed, worker trust, and liquidity pool stability.**

### D. Integration with Claim Confidence Scoring Engine  

All adversarial signals are aggregated into ShramShield’s **Claim Confidence Scoring framework**, which determines automated payout eligibility using weighted environmental, behavioural, and cluster intelligence metrics.

This ensures that ShramShield maintains a **resilient parametric insurance architecture capable of withstanding large-scale spoofing syndicates while delivering real-time livelihood protection to genuinely affected workers.**

# 🏗️ ShramShield – Phase 1 System Architecture (Foundation Prototype)

                    🌐 External Disruption Data Sources
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │   🌧️ OpenWeather API     🌫️ OpenAQ API     🚦 Traffic Mock │
 │                                                          │
 └───────────────┬───────────────────────┬──────────────────┘
                 │                       │
                 ▼                       ▼

              🔄 Data Fetch & Preprocessing Layer
        (Scheduled API polling via FastAPI background tasks)

                             │
                             ▼

                 🧠 AI Risk Scoring Service
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │  🔹 Zone Risk Prediction (Scikit-learn prototype model)   │
 │  🔹 Behavioural Risk Score Engine (Rule + Score logic)    │
 │  🔹 Basic Fraud Signal Detection (GPS pattern checks)     │
 │                                                          │
 │            Python FastAPI Microservice                    │
 │                                                          │
 └──────────────────────────┬───────────────────────────────┘
                            │
                            ▼

                  ⚡ Parametric Trigger Engine
        (Threshold Logic for Rainfall / AQI / Demand Drop)

                            │
                            ▼

                🧾 Core Application Service Layer
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │  🔹 User Onboarding & Profile Management                 │
 │  🔹 Weekly Premium Calculator Module                     │
 │  🔹 Policy Creation Workflow                             │
 │  🔹 Automated Claim Simulation                           │
 │                                                          │
 │            FastAPI + SQLAlchemy Backend                  │
 │                                                          │
 └──────────────────────────┬───────────────────────────────┘
                            │
                            ▼

                    💳 Payout Simulation Layer
                    (Razorpay Sandbox Integration)

                            │
                            ▼

                     ☁️ Data Storage Layer
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │  🔹 PostgreSQL (User, Policy, Claim Data)                │
 │  🔹 Local ML Dataset (CSV / JSON for prototype training) │
 │                                                          │
 └──────────────────────────┬───────────────────────────────┘
                            │
                            ▼

                 📱 Progressive Web App Frontend
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │  🔹 Next.js PWA Interface                                │
 │  🔹 Weekly Premium Dashboard                             │
 │  🔹 Risk Indicator & Heatmap Visualization               │
 │  🔹 Claim Status & Notification UI                       │
 │                                                          │
 └──────────────────────────────────────────────────────────┘


                ⚙️ Phase-1 Development Infrastructure
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │  🔹 GitHub Version Control                               │
 │  🔹 Local FastAPI + Next.js Development                  │
 │  🔹 Optional Docker for reproducible setup               │
 │                                                          │
 └──────────────────────────────────────────────────────────┘

