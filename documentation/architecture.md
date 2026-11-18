# NEXUS IoT — Smart Warehouse AIoT System Architecture

## 1. Architecture Overview

The NEXUS IoT Smart Warehouse Monitoring System follows a modular architecture combining IoT communication, backend processing, database storage, machine learning, rule-based anomaly detection, and web visualization.

The system consists of seven main layers:

1. Sensor Data Layer
2. IoT Communication Layer
3. Backend Processing Layer
4. Database Layer
5. AI and Rule-Based Detection Layer
6. Hybrid Decision Layer
7. Web Dashboard and Alert Layer

The system monitors temperature and humidity across four facilities and identifies abnormal environmental conditions using Isolation Forest V2 and configurable threshold rules.

Two simulated sensor data sources are supported: a Python sensor simulator and a Wokwi ESP32 with a DHT22 sensor.

## 2. System Architecture

```text
             SENSOR DATA LAYER
                     |
          +----------+----------+
          |                     |
          v                     v
   Python Simulator       Wokwi ESP32
   Four Facilities        DHT22 Sensor
          |                     |
          |                     v
          |                MQTT Broker
          |                     |
          |                     v
          |                  Node-RED
          |               /     |     \
          |          Temperature |  Humidity
          |          Monitoring  |  Monitoring
          |                     |
          |                HTTP POST
          |                     |
          v                     v
      SQLite Storage      FastAPI Backend
          ^                     |
          +---------------------+
                                |
                                v
                         SQLite Storage
                                |
                                v
                        Isolation Forest V2
                                +
                         Rule-Based Engine
                                |
                                v
                         Hybrid Decision
                                |
                    +-----------+-----------+
                    |                       |
                    v                       v
              REST API Response      Node-RED AI Alerts
                    |
                    v
              NEXUS Dashboard
                    |
                    v
            Charts, Gauges, Alerts
```

The Python simulator writes simulated measurements directly to SQLite. The ESP32 workflow uses MQTT and Node-RED to deliver measurements to FastAPI, which validates and stores them.

The FastAPI backend performs hybrid analysis of stored readings. Its REST endpoints provide monitoring results to the dashboard, while the ESP32 ingestion endpoint returns the latest analysis to Node-RED.

## 3. Sensor Data Layer

### 3.1 Python Sensor Simulator

The Python simulator is implemented in `backend/sensor.py`.

It generates simulated temperature and humidity measurements for four facilities:

| Facility ID | Facility |
|---|---|
| `hq` | HQ - Tower 1 |
| `data-center` | Data Center A |
| `rnd` | R&D Lab |
| `warehouse` | Warehouse 4 |

Each reading includes a timestamp, temperature, humidity, and facility identifier.

Readings are validated before being stored in SQLite.

### 3.2 Wokwi ESP32 Sensor Simulation

The second data source is a simulated ESP32 microcontroller using Wokwi.

The simulated circuit includes:

- ESP32 DevKit microcontroller.
- DHT22 temperature and humidity sensor.
- Green LED for normal environmental conditions.
- Red LED for abnormal environmental conditions.
- Current-limiting resistors for the LEDs.

The ESP32 reads the DHT22 sensor and publishes measurements through MQTT.

The ESP32 integration currently supplies readings for Warehouse 4.

Physical sensor hardware has not been deployed.

## 4. IoT Communication Layer

### 4.1 MQTT Communication

The ESP32 publishes sensor measurements using the MQTT protocol.

Demonstration configuration:

| Parameter | Value |
|---|---|
| MQTT broker | `broker.emqx.io` |
| Port | `1883` |
| Topic | `nexus-iot-tarik-2026/warehouse/sensors` |
| Data format | JSON |
| Device ID | `esp32-wokwi-01` |
| Facility ID | `warehouse` |

Example MQTT payload:

```json
{
  "facility_id": "warehouse",
  "device_id": "esp32-wokwi-01",
  "temperature": 24.6,
  "humidity": 55,
  "rule_status": "NORMAL"
}
```

The MQTT broker is public and the connection is intended only for educational demonstration.

### 4.2 Node-RED Integration

Node-RED subscribes to the ESP32 MQTT topic and processes incoming measurements.

The flow contains the following components:

**MQTT Input:** Receives JSON sensor messages.

**Temperature Monitoring:** Checks whether temperature is within the configured demonstration range.

**Humidity Monitoring:** Checks whether humidity is within the configured demonstration range.

**FastAPI Forwarding:** Sends sensor measurements to the FastAPI ingestion endpoint using HTTP POST.

**AI Anomaly Alerts:** Processes the analysis returned by FastAPI and displays a green or red node status indicator.

**Debug Nodes:** Display incoming sensor measurements, monitoring results, and backend responses.

The Node-RED flow is exported to:

`documentation/nexus-iot-flow-final.json`

Node-RED performs communication and monitoring functions. The trained Isolation Forest model runs in the Python backend.

## 5. Backend Processing Layer

The backend is developed using Python and FastAPI.

Main components:

| File | Responsibility |
|---|---|
| `backend/main.py` | REST endpoints, sensor ingestion, and hybrid analysis |
| `backend/database.py` | SQLite database initialization, storage, and retrieval |
| `backend/sensor.py` | Python sensor simulation and validation |
| `backend/ai_model_v2.py` | AI feature preparation and model-related functionality |
| `backend/test_ai_model_v2.py` | Controlled AI scenario testing |

### 5.1 ESP32 Sensor Ingestion

The backend provides:

`POST /api/sensors/esp32`

This endpoint:

1. Receives a JSON measurement from Node-RED.
2. Validates the facility, device, temperature, humidity, and rule status.
3. Rejects non-finite sensor values.
4. Generates a timestamp.
5. Stores the measurement in SQLite.
6. Retrieves the facility's readings.
7. Performs hybrid anomaly analysis.
8. Returns the latest analyzed reading to Node-RED.

The current endpoint accepts the demonstration device `esp32-wokwi-01` for facility `warehouse`.

### 5.2 REST API

The backend also provides endpoints for:

- System health.
- Configured facilities.
- Environmental readings.
- Facility-specific monitoring summaries.

These endpoints allow the frontend to retrieve current and historical monitoring information.

## 6. Database Layer

SQLite stores environmental sensor readings in the `sensor_readings` table.

Stored information includes:

- Reading ID.
- Timestamp.
- Temperature.
- Humidity.
- Facility ID.

The database provides persistent storage for both Python-generated and ESP32-simulated readings.

Hybrid classifications and anomaly scores are calculated by the backend when readings are analyzed rather than being stored as separate fields in the sensor readings table.

## 7. AI Detection Layer

The system uses Isolation Forest V2 for anomaly detection.

The model analyzes four features:

1. Temperature.
2. Humidity.
3. Absolute temperature change.
4. Absolute humidity change.

A machine learning pipeline combines StandardScaler with Isolation Forest.

Model configuration:

| Parameter | Value |
|---|---|
| Algorithm | Isolation Forest |
| Number of estimators | 200 |
| Contamination | 0.05 |
| Feature count | 4 |
| Model storage | Joblib |

Saved model:

`models/isolation_forest_v2.joblib`

The model generates a classification and anomaly decision score.

The model's predictions depend on the training data and should not be interpreted as validated industrial safety decisions.

## 8. Rule-Based Monitoring Layer

The rule engine evaluates environmental measurements against configurable limits.

Current demonstration settings:

| Parameter | Minimum | Maximum |
|---|---:|---:|
| Temperature | 15°C | 30°C |
| Humidity | 30% | 70% |

Readings outside these limits trigger rule-based anomaly alerts.

These values are demonstration thresholds, not universal warehouse storage or safety standards.

## 9. Hybrid Decision Layer

The system combines machine learning and rule-based detection.

Decision logic:

- If the AI detects an anomaly, the final status is ANOMALY.
- If a configured environmental threshold is exceeded, the final status is ANOMALY.
- If both methods return normal results, the final status is NORMAL.
- If the AI model is unavailable and no rule alert exists, the system may report UNKNOWN.

The backend provides the following analysis fields:

| Field | Description |
|---|---|
| `ai_status` | Machine learning classification |
| `rule_status` | Rule-based classification |
| `status` | Final hybrid classification |
| `anomaly_score` | Isolation Forest decision score |
| `rule_alerts` | Triggered environmental threshold alerts |

The final hybrid status is used by the dashboard and Node-RED alert monitoring.

## 10. Web Dashboard and Alert Layer

The NEXUS IoT frontend uses:

- HTML for structure.
- CSS for styling.
- JavaScript for interactive monitoring.
- Chart.js for data visualization.

The dashboard displays:

- Facility-specific environmental measurements.
- Temperature and humidity gauges.
- Temperature history.
- AI and rule-based anomaly indicators.
- Hybrid monitoring status.
- Recent sensor readings.
- Anomaly history.
- Monitoring statistics.
- Backend connection status.

The dashboard periodically retrieves data through the FastAPI REST API without requiring full-page reloads.

### 10.1 Node-RED Alerts

Node-RED also displays monitoring indicators.

Temperature Monitoring and Humidity Monitoring use configured threshold rules.

AI Anomaly Alerts uses the final hybrid classification returned by FastAPI.

- Green indicator: NORMAL.
- Red indicator: ANOMALY.

The AI model is not executed inside Node-RED.

## 11. Integration Testing

The end-to-end ESP32 communication and anomaly detection pipeline was tested using Wokwi, MQTT, Node-RED, FastAPI, SQLite, and the NEXUS dashboard.

### Test 1 — Normal Environmental Conditions

**Input:**
- Temperature: 24.6°C
- Humidity: 55%

**Observed results:**
- ESP32 rule status: NORMAL.
- Temperature Monitoring: NORMAL.
- Humidity Monitoring: NORMAL.
- Isolation Forest V2: NORMAL.
- Final hybrid status: NORMAL.
- Fast