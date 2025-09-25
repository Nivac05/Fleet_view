## FLEET VIEW
---

## 🌐 Overview

FleetView is a **real-time fleet monitoring and optimization system** that combines:

* **Backend (FastAPI + Python)** for APIs, optimization, and forecasting.
* **Frontend (Next.js React app)** for live dashboards.
* **Streaming layer** for chunk-based real-time updates.
* **Forecasting models** for demand prediction.
* **Optimization models** for repositioning and charging strategies.
* **Google Maps APIs** for live fleet route visualization.

Everything updates **in real time**. ⚡

---

## 📸 Dashboard Screenshots

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/72e7156c-2dd0-4aee-8871-dcf533b6a2d4" />
</p>

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/a1834294-5661-47b3-9bcb-0c331de7a903" />
</p>

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/12090d5e-41a2-4a87-8631-72551d12b5e5" />
</p>

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/70004ce1-2530-461b-8761-92b79e3cc767" />
</p>

---

## 🖥️ Backend Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate environment and run FastAPI backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

The backend exposes endpoints for:

* Fleet trip data
* Demand forecasts
* Optimization recommendations (EV vs ICE allocation, repositioning, charging)

---

## 🌐 Frontend Setup

```bash
# Inside sprint app
yarn install   # or npm install
yarn dev       # or npm run dev
```

The dashboard connects to the backend and streams **real-time updates**.

---

## 📊 Dashboard Walkthrough

### 🔹 1. Live KPIs Panel (Sidebar)

* Requests Served → **230**
* Average Wait Time → **5.4m**
* P90 Wait Time → **12.8m**
* EV vs ICE Trips → **98 / 89**
* Fleet Utilization → **74.5%**

👉 Updated live as trips stream in.

---

### 🔹 2. Live Fleet Map (Google Maps)

* Real-time trip trajectories.
* Green polylines show **active routes**.
* Smooth chunk-based streaming.

👉 Similar to ambulance navigation system.

---

### 🔹 3. Wait Time Distribution

* Histogram of passenger wait times.
* Most trips in **2–5 min window**.
* Tail extending to 15+ min.

👉 Service quality insights.

---

### 🔹 4. Trips by Fuel Type

* Stacked bar chart: EV vs ICE per hour.
* Peak between **16:00–20:00**.

👉 Helps monitor EV adoption & charging.

---

### 🔹 5. Utilization Over Time

* Line chart showing fleet utilization (65–75%).
* Detects idle dips early.

---

### 🔹 6. Demand Forecast

* Time-series forecast of ride demand.
* Spikes predicted around **18:00–20:00**.
* Auto-updates with stream.

👉 Powered by **XGBoost / time-series model**.

---

### 🔹 7. Decision Layer (Per-Zone Allocation)

* Table with zones (Downtown, IT Park, Mall, etc.).
* Demand (predicted + real).
* EV / ICE allocation.
* Unserved demand.

👉 Output from optimization model.

---

### 🔹 8. Reposition Moves

* EVs: **5 moved Downtown → IT Park**.
* ICE: **2 moved Hospital → Mall**.

👉 Live optimization strategies.

---

### 🔹 9. Fleet Status Table

* Vehicle ID (FVT-1001, …)
* Type (EV / ICE)
* SOC% (for EVs)
* Status (Busy, Free, Charging)

👉 Lets operators monitor **battery + availability**.

---

### 🔹 10. AI Suggestions (Popup)

* Natural-language GenAI insights:

  1. Dynamic Repositioning → move idle vehicles to hotspots.
  2. Optimized Charging → schedule off-peak.
  3. Enhanced Utilization → redistribute fleet.

---

## ⚡ Why FleetView is Powerful

* **Real-time streaming** → smooth, live updates.
* **Optimization models** → repositioning, charging, allocation.
* **Forecasting models** → predict demand spikes.
* **Maps integration** → live trip paths.
* **Decision support layer** → actionable AI insights.

👉 In short, FleetView = **Real-time Fleet Navigation + AI-powered Decision Making**.

---

## ✨ Author

👨‍💻 **Cavin Chandran**
💡 Built as part of **Fleet Optimization Project (BAEon Internship)**

---
