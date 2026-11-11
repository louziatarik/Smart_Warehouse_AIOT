# Smart Warehouse AIoT Monitoring System

An AI-powered warehouse monitoring prototype that simulates temperature and humidity readings, stores sensor data, and detects unusual environmental patterns using machine learning.

## Project Overview

The Smart Warehouse AIoT Monitoring System is designed to demonstrate how Internet of Things (IoT) technologies and Artificial Intelligence (AI) can support warehouse environmental monitoring.

The system generates simulated temperature and humidity readings, stores them in a local SQLite database, and uses an Isolation Forest machine learning model to identify abnormal patterns.

A web-based dashboard provides real-time-style monitoring, historical readings, visualizations, and anomaly alerts.

**Note:** This project currently uses simulated sensor data. Physical sensors and MQTT communication are not implemented.
## Project Screenshots

### System Architecture
![Smart Warehouse Architecture](screenshots/smart-warehouse-architecture.png)

### Dashboard Preview
![Smart Warehouse Dashboard](screenshots/smart-warehouse-dashboard.png)
## Main Features

- Simulated temperature and humidity monitoring.
- Automatic sensor data storage using SQLite.
- AI-based anomaly detection using Isolation Forest.
- FastAPI backend for accessing monitoring data.
- Interactive web dashboard.
- Temperature trend visualization using Chart.js.
- Environmental monitoring gauges.
- Anomaly alerts and system status indicators.
- Recent sensor readings table.

## Technologies Used

| Component | Technology |
|---|---|
| Programming language | Python |
| Backend framework | FastAPI |
| Machine learning | Scikit-learn |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Data visualization | Chart.js |
| Model storage | Joblib |
| API server | Uvicorn |

## System Architecture

The system follows this workflow:

1. **Data Simulation:** A Python sensor simulator generates temperature and humidity readings.
2. **Data Storage:** Sensor readings are saved in an SQLite database.
3. **AI Detection:** An Isolation Forest model analyzes readings and identifies unusual patterns.
4. **Backend API:** FastAPI provides endpoints for retrieving sensor data and monitoring summaries.
5. **Dashboard:** The frontend retrieves data from the API and displays readings, charts, gauges, and alerts.

## Project Structure

```text
Smart_Warehouse_AIOT/
│
├── backend/
│   ├── ai_model.py
│   ├── database.py
│   ├── main.py
│   └── sensor.py
│
├── data/
├── documentation/
│   ├── architecture.md
│   ├── requirements.md
│   └── final_project_report.md
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── hardware/
├── models/
│   └── isolation_forest.joblib
│
├── screenshots/
├── requirements.txt
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/louziatarik/Smart_Warehouse_AIOT.git
cd Smart_Warehouse_AIOT
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the backend API

From the project root:

```bash
python -m uvicorn main:app --reload --app-dir backend
```

The API will be available at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 5. Start the sensor simulator

Open a second terminal, activate the virtual environment, and run:

```bash
python backend/sensor.py
```

The simulator will generate and store new sensor readings.

### 6. Open the dashboard

Open `frontend/index.html` using Visual Studio Code Live Server.

The dashboard will retrieve monitoring data from the backend API.

## AI Anomaly Detection

The project uses the Isolation Forest algorithm from Scikit-learn.

The model analyzes temperature and humidity patterns and classifies readings as either:

- **Normal:** A reading consistent with the patterns learned by the model.
- **Anomaly:** A reading identified as unusual by the model.

The model is trained using stored sensor readings and saved as:

`models/isolation_forest.joblib`

Anomaly detection is based on the training data and is intended for demonstration purposes. It does not independently determine whether warehouse products are safe.

## Dashboard

The dashboard provides:

- Current temperature and humidity.
- Total sensor readings.
- Normal readings and detected anomalies.
- Temperature trend chart.
- Illustrative warehouse floor plan.
- AI-generated anomaly notifications.
- Recent sensor reading history.

## Project Documentation

Additional documentation is available in the `documentation/` directory:

- `architecture.md` — System architecture.
- `requirements.md` — Functional and technical requirements.
- `final_project_report.md` — Project report.

## Future Improvements

- Integration with physical temperature and humidity sensors.
- MQTT communication for sensor data transmission.
- Multiple warehouse monitoring zones.
- More advanced historical data analysis.
- Improved anomaly detection and notification mechanisms.

## Author

**Tarik Louzia**

Computer Science and