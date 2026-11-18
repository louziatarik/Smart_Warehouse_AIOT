
# Smart Warehouse AIoT System Architecture

## 1. Architecture Overview

The Smart Warehouse AIoT Monitoring System follows a modular architecture consisting of five main layers:

1. Sensor Data Layer
2. Backend Processing Layer
3. AI and Rule-Based Detection Layer
4. Database Layer
5. Web Dashboard Layer

The system combines machine learning anomaly detection with configurable environmental safety rules.

## 2. System Architecture

```text
       SENSOR DATA
            |
            v
   Temperature & Humidity
       Sensor Simulator
            |
            v
    DATA VALIDATION
            |
            v
       FASTAPI BACKEND
            |
      +-----+------+
      |            |
      v            v
  AI DETECTION   RULE ENGINE
  Isolation      Configurable
  Forest V2      Thresholds
      |            |
      +-----+------+
            |
            v
      HYBRID DECISION
            |
            v
       SQLITE DATABASE
            |
            v
        REST API
            |
            v
      WEB DASHBOARD
            |
            v
   Charts, Gauges, Alerts
```

## 3. Sensor Data Layer

The current prototype uses a Python sensor simulator.

It generates:
- Temperature readings.
- Humidity readings.
- Timestamps.

Readings are validated before database storage.

Physical sensor hardware is not currently connected.

## 4. Backend Processing Layer

The backend is developed using Python and FastAPI.

Main components:

- `main.py`: API endpoints and hybrid monitoring logic.
- `database.py`: SQLite database operations.
- `sensor.py`: Sensor data simulation and validation.
- `ai_model_v2.py`: AI model preparation and training.

The backend provides endpoints for:
- System health.
- Sensor readings.
- Monitoring summaries.

## 5. AI Detection Layer

The system uses Isolation Forest V2.

The model analyzes four features:

1. Temperature.
2. Humidity.
3. Absolute temperature change.
4. Absolute humidity change.

A StandardScaler and Isolation Forest pipeline is used.

The model produces:
- Normal or anomaly predictions.
- Anomaly decision scores.

## 6. Rule-Based Monitoring Layer

The rule engine checks environmental readings against configurable limits.

Current demonstration settings:

| Parameter | Minimum | Maximum |
|---|---:|---:|
| Temperature | 15 °C | 30 °C |
| Humidity | 30% | 70% |

These limits are configurable demonstration settings rather than universal storage standards.

## 7. Hybrid Decision Layer

The system combines AI and rule-based results.

Decision logic:

- AI detects anomaly → Final status: ANOMALY.
- Rules detect an exceeded limit → Final status: ANOMALY.
- Neither detects an issue → Final status: NORMAL.
- AI model unavailable and no rule alert → Final status: UNKNOWN.

This approach allows the system to identify both unusual patterns and configured environmental limit violations.

## 8. Database Layer

SQLite stores environmental sensor readings.

The database contains:

- Reading ID.
- Timestamp.
- Temperature.
- Humidity.

Monitoring classifications are calculated by the backend when readings are retrieved.

## 9. Web Dashboard Layer

The frontend uses:

- HTML for structure.
- CSS for presentation.
- JavaScript for dashboard functionality.
- Chart.js for data visualization.

The dashboard displays:
- Current environmental readings.
- Temperature and humidity gauges.
- Temperature history.
- Hybrid anomaly alerts.
- Recent sensor readings.
- Anomaly history.
- Backend connection status.

## 10. Technology Summary

| Layer | Technology |
|---|---|
| Sensor simulation | Python |
| Backend | FastAPI |
| AI | Scikit-learn |
| Algorithm | Isolation Forest |
| Feature scaling | StandardScaler |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Visualization | Chart.js |
| Model persistence | Joblib |

## 11. Current Limitations

- Sensor readings are simulated.
- Physical hardware integration is pending.
- The system has not been validated in a real warehouse.
- Detection performance requires further evaluation using labelled test data.
- Environmental thresholds must be configured for the intended warehouse and stored products.
