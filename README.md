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