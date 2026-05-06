<div align="center">

<h1>🛡️ ShramShield</h1>

<h3>AI-Powered Parametric Insurance for India's Gig Economy</h3>

<p>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Hackathon-Guidewire%20DEVTrails%202026-blue?style=for-the-badge" alt="Hackathon"/>
  <img src="https://img.shields.io/badge/Platform-PWA-orange?style=for-the-badge" alt="PWA"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-teal?style=for-the-badge" alt="FastAPI"/>
</p>

<p><em>Automated financial safety nets for India's 15 million+ delivery partners — triggered by real-world disruptions, paid out in real time.</em></p>

---

</div>

## 📌 Table of Contents

- [Vision](#-vision)
- [Problem Statement](#-problem-statement)
- [Why PWA](#-why-pwa)
- [Weekly Premium Model](#-weekly-premium-model)
- [Parametric Trigger System](#-parametric-trigger-system)
- [AI and ML Integration](#-aiml-integration)
- [Adversarial Defense](#-adversarial-defense--anti-spoofing)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Demo Guide](#-demo-guide)
- [Project Status](#-project-status)

---

## 🎯 Vision

**ShramShield** is an AI-powered parametric insurance platform designed exclusively to safeguard the livelihoods of India's platform-based delivery partners.

Our mission: provide an **automated financial safety net** against income loss caused by uncontrollable external disruptions — no paperwork, no delays, no manual claims.

### 👥 Target Personas

| Platform Partner | Primary Risk Triggers |
|---|---|
| 🛵 Zomato / Swiggy | Extreme heatwaves, heavy monsoons |
| 📦 Amazon / Flipkart | Government curfews, market closures |
| ⚡ Zepto / Blinkit | Severe pollution (AQI > 400), localized strikes |

---

## ⚠️ Problem Statement

India's gig delivery workforce operates in **highly volatile conditions** where income depends entirely on uncontrollable external factors.

> *When it rains, they lose. When AQI spikes, they lose. When a curfew hits, they lose. Existing insurance doesn't care.*

**Common income disruption triggers:**

- 🌧️ Heavy rainfall and floods
- 🌡️ Extreme heat and high pollution levels
- 🚦 Traffic congestion and government-imposed curfews
- 📉 Sudden order demand drops
- 💻 Platform outages

**Existing solutions are reactive, slow, and misaligned with daily wage cycles.**
ShramShield addresses this through **predictive, automated parametric income protection.**

---

## 🌐 Why PWA?

A **Progressive Web App architecture** was chosen to maximize accessibility for gig workers across India.

| Benefit | Impact |
|---|---|
| Works on low-storage smartphones | Reaches budget device users |
| Offline-first capability | Functions in low-connectivity zones |
| No app store dependency | Zero installation friction |
| Cross-platform compatibility | Android, iOS, Desktop — one codebase |
| Reduced data consumption | Cost-effective for data-limited workers |

> PWA ensures **scalable adoption across all worker segments**, regardless of device tier.

---

## 💰 Weekly Premium Model

Gig workers operate on a **week-to-week earning cycle**. ShramShield aligns with this reality by structuring all policies weekly.

### Base Premium Tiers

| Weekly Earnings | Premium Percentage | Minimum Floor |
|---|---|---|
| Below ₹500 | 5% | ₹49/week |
| ₹500 – ₹1,500 | 10% | ₹49/week |
| ₹1,500 – ₹3,000 | 15% | ₹49/week |

### 📍 Hyper-Local AI Risk Adjustment

Premiums are dynamically adjusted based on the worker's specific delivery zone and upcoming week forecast:

```
Base Premium:         ₹60/week
Safe Zone Discount:  - ₹2
─────────────────────────────
Final Premium:        ₹58/week
```

**Factors that influence adjustment:**
- 🔴 Flood-prone delivery zone → **premium increase**
- 🟢 Historically safe zone → **premium discount**
- 🟡 High-disruption week forecasted → **coverage increase**

---

## ⚡ Parametric Trigger System

ShramShield **eliminates manual claims entirely**. Payouts fire automatically when predefined external thresholds are crossed.

### Trigger Conditions

| Category | Trigger | Threshold |
|---|---|---|
| 🌧️ Rain | Heavy Rainfall | > 30mm in 3 hours |
| 🌡️ Heat | Extreme Temperature | > 45°C |
| 🌫️ Pollution | Air Quality Index | > 400 AQI |
| 🚧 Operational | Government Curfew | Mandate issued |
| 📍 Zone | Sudden Zone Closure | Platform API signal |

> **Zero paperwork. Zero waiting. Payout happens automatically.**

---

## 🤖 AI&ML Integration

### 1. Dynamic Risk Assessment
- Processes real-time weather and traffic data to predict income loss volatility per delivery zone
- **Models:** Gradient Boosting, Random Forest

### 2. Intelligent Fraud Detection
- **GPS Validation** — Cross-references claim triggers with worker's real-time location
- **Anomaly Detection** — Identifies spoofed weather data or duplicate claim attempts

### 3. Predictive Zone Analytics
- Helps workers identify **high-risk hours and zones** before the week begins
- Enables proactive route and schedule planning

### 4. Behavioural Risk Score
Inspired by credit scoring systems, the AI evaluates:

| Signal | Weight |
|---|---|
| Worker reliability history | High |
| Working hour consistency | Medium |
| Claim frequency patterns | High |
| Location switching behaviour | Medium |

> ✅ Stable, consistent workers receive **lower premium incentives.**

---

### 🎙️ AI Earnings Stabilizer

Acts as a personal **income guidance assistant**, recommending:
- Optimal working hours for maximum earnings
- Safer delivery zones to minimize disruption exposure
- High-demand time slots for productivity boosts

---

## 🛡️ Adversarial Defense & Anti-Spoofing

During large-scale disruption events, ShramShield's automated payout system must be protected from **coordinated GPS-spoofing fraud rings**.

### A. Detecting Genuine vs. Spoofed Workers

| Signal | Genuine Worker | GPS Spoofer |
|---|---|---|
| Trajectory Pattern | Organic deceleration, route diversions | Coordinate "teleportation" jumps |
| Z-Axis Altitude | Matches local topography (underpasses, flyovers) | Flat 2D simulation only |
| IMU Sensor Data | Real vibrations: rain, idle oscillations, sway | Clean/empty sensor readings |

### B. Coordinated Fraud Ring Detection

- **Spatial Synchronicity** — Genuine claims cluster stochastically; spoofed claims spread uniformly
- **Temporal Surge Analytics** — Improbable claim bursts within narrow time windows trigger flags
- **Network Fingerprinting** — Shared proxy gateways, ISPs, or cell tower IDs reveal syndicate routing
- **Demand Signal Cross-Validation** — Claimed zones must correlate with real delivery demand drops

### C. Fair Handling of Flagged Claims

ShramShield ensures fraud prevention **never penalizes honest workers** facing network disruptions:

- **Step-Up Verification** — Moderate anomaly scores trigger passive proof-of-environment checks (ambient audio sampling, activity confirmation prompts) rather than immediate denial
- **Consensus Grid Validation** — Claims are cross-verified against trusted delivery partners in the same geo-grid

### D. Claim Confidence Scoring Engine

All signals feed into a unified scoring framework:

```
Claim Confidence Score
├── Environmental Signal     (Weather API + AQI confirmation)
├── Behavioural Confidence   (GPS trajectory + IMU fusion)
└── Cluster Confidence       (Network + spatial fraud indicators)
          ↓
   Automated Payout Decision
```

---

## 🏗 System Architecture

```
          🌐 External Disruption Data Sources
 ┌──────────────────────────────────────────────┐
 │  🌧️ OpenWeather API  🌫️ OpenAQ  🚦 Traffic    │
 └────────────────┬─────────────────────────────┘
                  │
                  ▼
       🔄 Data Fetch & Preprocessing Layer
    (FastAPI background tasks — scheduled polling)
                  │
                  ▼
          🧠 AI Risk Scoring Service
 ┌──────────────────────────────────────────────┐
 │  Zone Risk Prediction  (scikit-learn)         │
 │  Behavioural Risk Score (rule + score logic)  │
 │  Fraud Signal Detection (GPS pattern checks)  │
 └────────────────┬─────────────────────────────┘
                  │
                  ▼
       ⚡ Parametric Trigger Engine
   (Rainfall / AQI / Demand Drop thresholds)
                  │
                  ▼
       🧾 Core Application Service Layer
 ┌──────────────────────────────────────────────┐
 │  User Onboarding & Profile Management         │
 │  Weekly Premium Calculator                    │
 │  Policy Creation Workflow                     │
 │  Automated Claim Processing                   │
 │  FastAPI + SQLAlchemy Backend                 │
 └────────────────┬─────────────────────────────┘
                  │
                  ▼
       💳 Payout Simulation Layer
       (Razorpay Sandbox Integration)
                  │
                  ▼
          ☁️ Data Storage Layer
 ┌──────────────────────────────────────────────┐
 │  PostgreSQL  (User, Policy, Claim Data)       │
 │  Local ML Dataset  (CSV/JSON for training)    │
 └────────────────┬─────────────────────────────┘
                  │
                  ▼
      📱 Progressive Web App Frontend
 ┌──────────────────────────────────────────────┐
 │  Next.js PWA Interface                        │
 │  Weekly Premium Dashboard                     │
 │  Risk Indicator & Heatmap Visualization       │
 │  Claim Status & Notification UI               │
 └──────────────────────────────────────────────┘

          ⚙️ Development Infrastructure
 ┌──────────────────────────────────────────────┐
 │  GitHub Version Control                       │
 │  Local FastAPI + Next.js Development          │
 │  Optional Docker for Reproducible Setup       │
 └──────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend** | FastAPI (Python 3.10+), SQLAlchemy (SQLite) |
| **Trigger Engine** | Custom Python Parametric Logic |
| **Weather Data** | OpenWeatherMap API (Rainfall & Temperature) |
| **Air Quality** | OpenWeatherMap Air Pollution API (AQI) |
| **Geocoding** | OpenStreetMap Nominatim (Reverse Geocoding) |
| **Payments** | Razorpay Sandbox |
| **Deployment** | Docker, GitHub, Local FastAPI + Next.js |

---

## 🎬 Demo Guide

> Follow this end-to-end flow to demonstrate ShramShield to judges.

### Step 1 — Worker Onboarding (`/login`)

1. Start the **7-Step Onboarding Wizard**
2. **AI ID Scanner** — Upload any image; watch ShramShield Vision AI scan and verify the worker ID in real time
3. **Auto-Detect Location** — Uses browser Geolocation API to instantly find the worker's city
4. **UPI Payout Setup** — Link a simulated UPI ID (e.g., `user@okicici`) for parametric payouts

### Step 2 — Worker Portal (`/portal`)

1. View the **Live Risk Radar** — pulls real weather data from the worker's specific zone
2. Purchase a **Weekly Insurance Plan** via simulated UPI payment

### Step 3 — God Mode Simulator (`/dashboard`)

> *This is the Admin / Judge view.*

1. Enter a city name (e.g., `Mumbai` or `Pune`) and click **"Execute Weather Event"**
2. Watch the **Live Engine Output** fetch real-time telemetry
3. If the city has heavy rain or high pollution → watch **Razorpay Auto-Payout** trigger
4. Check the **Automated Audit Log** for the permanent transaction record

---

## ♿ Voice-First Accessibility

To ensure inclusive access across diverse worker demographics:

- 🎙️ **Hindi / Tamil Voice Claim Assistant**
- 🗣️ **Voice-Guided Onboarding**
- 💬 **Chatbot Support**

---

## ✅ Project Status

> **ShramShield is fully functional and production-ready for DEVTrails 2026.**

| Module | Status |
|---|---|
| FastAPI Backend with Parametric Trigger Engine | ✅ Complete |
| User, Policy & Payout Ledger Database | ✅ Complete |
| Mobile-First PWA Dashboard | ✅ Complete |
| Admin Disruption Simulator | ✅ Complete |
| Live OpenWeatherMap API Integration | ✅ Complete |
| AI Vision KYC Document Scanner | ✅ Complete |
| Hardware-Accelerated Mobile Animations (60fps) | ✅ Complete |

---

<div align="center">

**Built with ❤️ for India's gig workforce**

*ShramShield — Because every delivery partner deserves a safety net.*

</div>
