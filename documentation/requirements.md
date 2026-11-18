
# Smart Warehouse AIoT Monitoring System

## 1. Project Overview

Smart Warehouse AIoT is an intelligent environmental monitoring system designed to monitor warehouse temperature and humidity.

The system combines Artificial Intelligence (AI) anomaly detection with configurable rule-based monitoring to identify unusual environmental conditions.

## 2. Project Objectives

- Monitor warehouse temperature and humidity.
- Collect and store sensor readings.
- Detect unusual environmental patterns using Machine Learning.
- Identify environmental readings outside configured limits.
- Display monitoring information through a web dashboard.
- Provide a centralized view of environmental anomalies.

## 3. Functional Requirements

### 3.1 Sensor Monitoring
- Collect temperature readings.
- Collect humidity readings.
- Validate incoming sensor data.
- Support simulated sensor data for development and testing.

### 3.2 Data Management
- Store readings in an SQLite database.
- Record timestamps for sensor readings.
- Retrieve historical readings.
- Provide summary statistics through the API.

### 3.3 AI Anomaly Detection
- Use an Isolation Forest machine learning model.
- Analyze temperature and humidity patterns.
- Consider changes between consecutive readings.
- Generate anomaly predictions and anomaly scores.

### 3.4 Rule-Based Monitoring
- Check temperature against configurable limits.
- Check humidity against configurable limits.
- Generate alerts when readings exceed configured limits.

Demonstration thresholds:
- Temperature: 15–30 °C.
- Humidity: 30–70%.

These are configurable demonstration values, not universal warehouse storage standards.

### 3.5 Hybrid Monitoring
- Combine AI predictions and rule-based alerts.
- Classify a reading as an anomaly when either method detects an issue.
- Identify the detection source.
- Provide a final monitoring status.

### 3.6 Web Dashboard
- Display current temperature and humidity.
- Display total, normal and anomalous readings.
- Display recent sensor readings.
- Display anomaly history.
- Provide visual environmental monitoring indicators.
- Show backend connection status.

## 4. Non-Functional Requirements

- The interface should be easy to understand.
- The API should respond reliably to dashboard requests.
- Sensor readings should be stored persistently.
- The system should validate incoming data.
- The software should use a modular architecture.
- The monitoring thresholds should be configurable.

## 5. Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| Database | SQLite |
| Machine Learning | Scikit-learn |
| AI Algorithm | Isolation Forest |
| Model Processing | StandardScaler |
| Frontend | HTML, CSS, JavaScript |
| Data Visualization | Chart.js |
| Model Storage | Joblib |

## 6. Current System Scope

The current implementation uses simulated environmental sensor readings.

Physical sensor hardware and real warehouse deployment are not yet integrated.

The system is intended as an academic AIoT prototype demonstrating environmental monitoring, machine learning anomaly detection and rule-based alerting.
