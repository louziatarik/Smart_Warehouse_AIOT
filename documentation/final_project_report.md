
# Smart Warehouse AIoT Monitoring System Using Hybrid AI Anomaly Detection

**Project Type:** Artificial Intelligence of Things (AIoT)

**Project Domain:** Smart Warehouse Monitoring

**Student:** Tarik Louzia

**University:** Dalian Polytechnic University

**Major:** Computer Science and Technology

**Academic Year:** 2026–2027

---

# Abstract

Warehouse environments require continuous environmental monitoring to help maintain appropriate storage conditions. Temperature and humidity variations may affect stored products, making timely anomaly identification important.

This project presents **NEXUS IoT — Smart Warehouse AIoT Monitoring System**, an intelligent multi-facility environmental monitoring prototype integrating Internet of Things communication, machine learning, rule-based anomaly detection, and real-time visualization.

The system supports two simulated data acquisition methods: a Python-based sensor simulator and a Wokwi ESP32 microcontroller connected to a simulated DHT22 temperature and humidity sensor. The ESP32 transmits environmental measurements using MQTT through an EMQX broker. Node-RED receives these messages, performs temperature and humidity monitoring, and forwards sensor data to a FastAPI backend.

The backend validates and stores measurements in an SQLite database. A trained Isolation Forest V2 model analyzes environmental patterns using temperature, humidity, and changes between consecutive readings. A configurable rule engine checks measurements against predefined environmental limits. The hybrid detection mechanism combines both methods to identify abnormal conditions.

An interactive web dashboard developed using HTML, CSS, JavaScript, and Chart.js provides facility-specific monitoring information, environmental measurements, historical data, statistics, and anomaly alerts. Node-RED additionally displays monitoring indicators based on the analysis returned by FastAPI.

The complete ESP32–MQTT–Node-RED–FastAPI integration was functionally tested under normal and high-temperature conditions. The tests demonstrated successful sensor message transmission, backend storage, and anomaly detection.

The resulting prototype demonstrates the integration of IoT communication, machine learning, database management, backend services, and web technologies within a modular environmental monitoring system. Physical sensor deployment and real-world warehouse validation remain future improvements.

**Keywords:** AIoT, Smart Warehouse, ESP32, DHT22, MQTT, Node-RED, Machine Learning, Isolation Forest, Hybrid Anomaly Detection, FastAPI, SQLite.

---

# 1. Introduction

## 1.1 Background

Warehouses play an important role in the storage and distribution of products. Environmental conditions, particularly temperature and humidity, can influence product quality and storage requirements.

Manual monitoring may not provide continuous analysis of environmental measurements. IoT technologies provide a way to collect environmental data automatically, while artificial intelligence can help identify unusual patterns in the collected measurements.

Combining these technologies can support more effective environmental monitoring.

## 1.2 Problem Statement

Warehouse environmental monitoring requires a system capable of collecting, storing, analyzing, and presenting temperature and humidity measurements.

A monitoring approach based only on predefined limits may fail to identify unusual patterns within otherwise acceptable measurements. Similarly, a machine learning model may not always identify absolute environmental limit violations.

This project addresses these limitations by combining machine learning anomaly detection with rule-based environmental checks.

## 1.3 Project Objectives

The main objectives are:

1. Develop a system for collecting temperature and humidity readings.
2. Simulate environmental sensor data.
3. Store measurements in an SQLite database.
4. Implement machine learning-based anomaly detection.
5. Implement configurable environmental safety rules.
6. Combine AI and rule-based results into a hybrid monitoring system.
7. Develop a REST API using FastAPI.
8. Create a web dashboard for displaying monitoring information.
9. Visualize historical temperature and humidity measurements.
10. Display anomaly alerts and detection sources.

## 1.4 Scope of the Project

The current project focuses on a software-based AIoT prototype.

Its implementation includes:

- Simulated temperature and humidity readings.
- Python-based data processing.
- SQLite database storage.
- Isolation Forest V2 anomaly detection.
- Rule-based environmental monitoring.
- Hybrid anomaly classification.
- FastAPI backend services.
- Browser-based monitoring dashboard.

 The current implementation includes simulated ESP32 and DHT22 sensor measurements, MQTT communication, and Node-RED integration with the FastAPI backend. Physical sensor hardware deployment and real-world warehouse validation remain outside the current project scope.

---


# 2. System Architecture

## 2.1 Architecture Overview

The NEXUS IoT Smart Warehouse AIoT Monitoring System uses a modular, multi-facility architecture that integrates simulated IoT sensors, MQTT communication, Node-RED processing, a FastAPI backend, SQLite database storage, hybrid anomaly detection, and a web dashboard.

The prototype monitors four facilities:

1. HQ - Tower 1 (`hq`).
2. Data Center A (`data-center`).
3. R&D Lab (`rnd`).
4. Warehouse 4 (`warehouse`).

The system consists of seven main layers:

1. **Sensor Data Layer:** Generates environmental measurements using a Python simulator or a simulated Wokwi ESP32 connected to a DHT22 sensor.
2. **IoT Communication Layer:** Transmits ESP32 readings using MQTT and processes them through Node-RED.
3. **Backend Processing Layer:** Handles sensor validation, API requests, database operations, and anomaly analysis.
4. **Database Layer:** Stores timestamped environmental readings with facility identifiers.
5. **AI and Rule-Based Detection Layer:** Uses Isolation Forest V2 and configurable environmental thresholds to identify anomalies.
6. **Hybrid Decision Layer:** Combines AI and rule-based classifications into a final monitoring status.
7. **Dashboard and Alert Layer:** Displays facility-specific monitoring information and provides Node-RED anomaly indicators.

All four facilities share the same FastAPI backend, SQLite database, and trained Isolation Forest V2 model.

The Python simulator supports all four facilities, while the Wokwi ESP32 integration currently targets Warehouse 4.

The implementation uses simulated environmental measurements. MQTT communication and Node-RED integration are operational, but physical sensor hardware has not been deployed.

## 2.2 Data Flow

The system supports two environmental data acquisition workflows.

### 2.2.1 Python Sensor Simulation Workflow

1. The Python sensor simulator generates temperature and humidity readings for the four configured facilities.
2. Each measurement is associated with a `facility_id`.
3. The measurements are validated and stored in SQLite.
4. The backend retrieves the stored environmental measurements.
5. Isolation Forest V2 analyzes temperature, humidity, and changes between readings.
6. The rule-based engine checks environmental measurements against configured thresholds.
7. Hybrid decision logic combines both classifications.
8. FastAPI provides facility-specific monitoring information through REST endpoints.
9. The JavaScript dashboard retrieves updated measurements and monitoring results periodically.
10. Users select facilities from the dashboard sidebar to view their environmental information.

### 2.2.2 ESP32, MQTT, and Node-RED Workflow

The second workflow demonstrates IoT communication using a simulated ESP32 microcontroller and DHT22 environmental sensor.

1. Wokwi simulates an ESP32 connected to a DHT22 sensor.
2. The ESP32 reads temperature and humidity measurements.
3. The ESP32 publishes the measurements as JSON messages using MQTT.
4. The EMQX public MQTT broker receives and distributes the messages.
5. Node-RED subscribes to the configured MQTT topic.
6. Node-RED processes temperature and humidity through separate monitoring functions.
7. Node-RED forwards the sensor measurements to FastAPI using HTTP POST.
8. FastAPI validates and stores the incoming readings in SQLite.
9. Isolation Forest V2 analyzes the measurements and environmental changes.
10. The rule-based engine evaluates the configured temperature and humidity limits.
11. Hybrid decision logic determines the final monitoring classification.
12. FastAPI returns the anomaly analysis to Node-RED.
13. Node-RED displays the monitoring results and anomaly indicators.
14. The NEXUS IoT dashboard retrieves the stored measurements and analysis through the REST API.

The ESP32 ingestion endpoint is:

`POST /api/sensors/esp32`

The MQTT configuration used for the demonstration is:

| Parameter | Value |
|---|---|
| Broker | `broker.emqx.io` |
| Port | `1883` |
| MQTT topic | `nexus-iot-tarik-2026/warehouse/sensors` |
| Facility ID | `warehouse` |
| Device ID | `esp32-wokwi-01` |

### 2.2.3 Hybrid Anomaly Detection Workflow

Both data acquisition methods use the same backend anomaly detection mechanism.

The trained Isolation Forest V2 model analyzes four features:

1. Temperature.
2. Humidity.
3. Absolute temperature change.
4. Absolute humidity change.

The rule engine evaluates measurements against the configured demonstration thresholds:

| Parameter | Minimum | Maximum |
|---|---|---|
| Temperature | 15°C | 30°C |
| Humidity | 30% | 70% |

The final classification is ANOMALY when either the AI model or the rule engine identifies an anomaly.

The backend provides AI status, rule status, hybrid status, anomaly score, and triggered rule alerts.

The shared AI model has not been independently validated for each facility.

## 2.3 Architecture Diagram

The system's architecture consists of two sensor data sources connected to a centralized monitoring backend.

```text
                  NEXUS IoT
             SENSOR DATA SOURCES
                      |
           +----------+----------+
           |                     |
           v                     v
    Python Simulator       Wokwi ESP32
     Four Facilities       DHT22 Sensor
           |                     |
           |                     v
           |                MQTT Broker
           |                     |
           |                     v
           |                  Node-RED
           |                     |
           |                 HTTP POST
           |                     |
           v                     v
      SQLite Database <---- FastAPI
           |                     |
           +----------+----------+
                      |
                      v
              Isolation Forest V2
                      +
                Rule-Based Engine
                      |
                      v
                Hybrid Decision
                      |
             +--------+--------+
             |                 |
             v                 v
        REST API          Node-RED Alerts
             |
             v
        NEXUS Dashboard
             |
             v
     Charts, Gauges, Statistics
        and Anomaly History
```

The architecture diagram is also available at:

![Smart Warehouse AIoT System Architecture](../screenshots/smart-warehouse-architecture.png)

The existing image represents an earlier architecture version and should be updated to show the ESP32, MQTT, and Node-RED components.

The completed system demonstrates the integration of simulated IoT communication, backend services, persistent storage, hybrid anomaly detection, and interactive monitoring within a centralized multi-facility architecture.

# 3. Technologies and Development Tools

The NEXUS IoT Smart Warehouse AIoT Monitoring System was developed using technologies for IoT simulation, communication, backend processing, machine learning, database management, and web visualization.

The following technologies were used during development and integration.

| Technology | Purpose |
|---|---|
| Python | Main programming language and environmental data processing |
| FastAPI | Backend REST API and ESP32 sensor ingestion |
| SQLite | Persistent environmental measurement storage |
| Scikit-learn | Machine learning implementation |
| Isolation Forest V2 | Environmental anomaly detection |
| StandardScaler | Machine learning feature scaling |
| Joblib | Trained AI model persistence |
| Wokwi | ESP32 and DHT22 hardware simulation |
| ESP32 | Simulated IoT microcontroller |
| DHT22 | Simulated temperature and humidity sensor |
| Arduino C++ | ESP32 firmware development |
| MQTT | IoT sensor data communication protocol |
| EMQX | Public MQTT broker for demonstration |
| Node-RED | IoT message processing, monitoring, and backend integration |
| HTTP/JSON | Communication between Node-RED and FastAPI |
| HTML | Dashboard structure |
| CSS | Dashboard styling |
| JavaScript | Frontend functionality and API communication |
| Chart.js | Environmental data visualization |
| Uvicorn | FastAPI application server |
| Visual Studio Code | Development environment |
| Git and GitHub | Version control and project repository management |

## 3.1 Development Environment

The project was developed using Visual Studio Code on Windows.

Python 3.13.15 was used for backend development and machine learning implementation. A Python virtual environment was created to manage dependencies.

The project separates backend, frontend, data, trained models, documentation, and screenshots into organized directories.

Git and GitHub were used to manage source code and track project development.

## 3.2 IoT Simulation Environment

The IoT component was developed using the Wokwi online simulation platform.

The simulated hardware consists of:

- ESP32 microcontroller.
- DHT22 temperature and humidity sensor.
- Green LED for normal environmental conditions.
- Red LED for abnormal environmental conditions.

The ESP32 firmware reads sensor measurements, evaluates demonstration thresholds, and publishes JSON messages through MQTT.

The simulated device uses the identifier `esp32-wokwi-01` and is associated with Warehouse 4.

Physical sensor hardware was not required for the simulation.

## 3.3 MQTT Communication Environment

MQTT was selected as the communication protocol between the simulated ESP32 and Node-RED.

The implementation uses the public EMQX broker at `broker.emqx.io` on port `1883`.

Sensor measurements are published to:

`nexus-iot-tarik-2026/warehouse/sensors`

MQTT allows the simulated ESP32 to publish environmental measurements while Node-RED subscribes to the configured topic.

The public broker is used only for educational demonstration.

## 3.4 Node-RED Development Environment

Node-RED was used to implement the IoT communication and monitoring workflow.

The implemented flow includes:

1. MQTT input for receiving ESP32 measurements.
2. Temperature monitoring function.
3. Humidity monitoring function.
4. HTTP request node for forwarding measurements to FastAPI.
5. FastAPI response monitoring.
6. AI anomaly alert function.
7. Debug nodes for inspecting messages and analysis results.

The complete flow was exported to:

`documentation/nexus-iot-flow-final.json`

The trained Isolation Forest model executes in the Python backend. Node-RED processes the returned analysis rather than running the machine learning model itself.

## 3.5 Backend and Frontend Development Tools

FastAPI provides REST endpoints for sensor ingestion, monitoring summaries, historical readings, and system health.

SQLite stores timestamped environmental measurements and facility identifiers.

Scikit-learn provides the Isolation Forest V2 model, which is combined with configurable environmental threshold rules.

The frontend was developed using HTML, CSS, JavaScript, and Chart.js.

The NEXUS IoT dashboard provides multi-facility monitoring, environmental gauges, historical charts, statistics, and anomaly alerts.

The frontend communicates with FastAPI using HTTP requests and periodically refreshes monitoring information.

---

# 4. Database Design

## 4.1 Database Overview

The project uses SQLite as its database management system.

SQLite was selected because it is lightweight and can be integrated directly with Python.

The database file is:

`data/warehouse.db`


## 4.2 Database Table

The system uses a SQLite table named `sensor_readings` to store environmental measurements from four monitored facilities.

| Field | Data Type | Description |
|---|---|---|
| id | INTEGER | Unique reading identifier and primary key |
| timestamp | TEXT | Date and time of the measurement |
| temperature | REAL | Temperature measurement in degrees Celsius |
| humidity | REAL | Relative humidity percentage |
| facility_id | TEXT | Identifier of the monitored facility |

The `id` field automatically increases for each new measurement.

The `facility_id` field identifies the facility associated with each reading.

The system currently supports four facilities:

| Facility ID | Facility Name |
|---|---|
| `hq` | HQ - Tower 1 |
| `data-center` | Data Center A |
| `rnd` | R&D Lab |
| `warehouse` | Warehouse 4 |

The database supports facility-specific filtering, allowing the backend to retrieve measurements for an individual facility.

Existing historical readings were preserved during the database upgrade and assigned to Data Center A.

The current implementation uses one SQLite database for all four facilities.


## 4.3 Database Operations

The database module supports:

- Database initialization.
- Creation of the sensor readings table.
- Insertion of environmental measurements.
- Retrieval of stored readings.
- Retrieval of recent measurements.

The database maintains the historical measurements used by the monitoring system.

---

# 5. Artificial Intelligence Implementation

## 5.1 Machine Learning Algorithm

The project uses the Isolation Forest algorithm from Scikit-learn.

Isolation Forest is an unsupervised machine learning algorithm designed to identify observations that differ from learned data patterns.

The current V2 model uses four input features:

1. Temperature.
2. Humidity.
3. Absolute temperature change.
4. Absolute humidity change.

Including environmental changes allows the model to analyze both measurement values and changes between consecutive readings.

## 5.2 Model Architecture and Configuration

The V2 model uses a processing pipeline containing StandardScaler and Isolation Forest.

| Parameter | Value |
|---|---|
| Algorithm | Isolation Forest |
| Model version | V2 |
| Number of estimators | 200 |
| Contamination | 0.05 |
| Random state | 42 |
| Input features | 4 |
| Feature scaling | StandardScaler |

The trained model is saved using Joblib at:

`models/isolation_forest_v2.joblib`

This allows the backend to load the trained model without retraining it every time the application starts.

## 5.3 Anomaly Detection Process

The model analyzes environmental readings and returns a prediction:

- **Normal (1):** The observation is not classified as anomalous.
- **Anomaly (-1):** The observation is classified as unusual compared with learned patterns.

The model also provides an anomaly decision score.

The score helps indicate how an observation relates to the model's learned decision boundary. It should not be interpreted as a probability of an environmental problem.

## 5.4 Model Testing

The V2 model was tested using controlled environmental scenarios.

| Scenario | AI Classification |
|---|---|
| Normal environment | NORMAL |
| High temperature | NORMAL |
| High humidity | NORMAL |
| Rapid temperature change | ANOMALY |

These tests demonstrated an important limitation: the model can identify unusual patterns but may not independently detect every absolute environmental limit violation.

This motivated the addition of rule-based monitoring.

The tests are controlled functional checks and do not represent a formal accuracy evaluation using a labelled dataset.

## 5.5 AI Model Limitations

The model learns patterns from the available simulated training data.

Its predictions depend on the characteristics of the training dataset. It does not directly predict product spoilage or determine whether conditions are safe for specific products.

Additional representative data and formal evaluation would be necessary before using the model in a real warehouse.

---

# 6. Rule-Based Environmental Monitoring

## 6.1 Purpose

The rule-based monitoring component complements machine learning by checking whether environmental measurements exceed configured limits.

Unlike the AI model, which identifies unusual patterns, the rule engine directly checks temperature and humidity values against predefined thresholds.

## 6.2 Configured Thresholds

The current prototype uses the following demonstration settings:

| Parameter | Minimum | Maximum |
|---|---:|---:|
| Temperature | 15 °C | 30 °C |
| Humidity | 30% | 70% |

These are configurable project demonstration limits. They are not universal warehouse standards or validated storage requirements for specific products.

## 6.3 Rule-Based Detection

The rule engine checks each measurement.

Possible alerts include:

- `TEMPERATURE_OUT_OF_RANGE`
- `HUMIDITY_OUT_OF_RANGE`

A reading is classified as a rule-based anomaly if either configured environmental limit is exceeded.

---

# 7. Hybrid AI and Rule-Based Detection

## 7.1 Hybrid Monitoring Approach

The main improvement in the current project is the integration of AI-based anomaly detection and rule-based environmental monitoring.

The two methods have complementary purposes:

- Isolation Forest identifies unusual environmental patterns.
- The rule engine detects violations of configured temperature and humidity limits.

Combining both methods provides a more comprehensive monitoring approach than using either method independently.

## 7.2 Hybrid Decision Logic

The final classification follows these rules:

| AI Result | Rule Result | Final Classification |
|---|---|---|
| ANOMALY | NORMAL | ANOMALY |
| NORMAL | ANOMALY | ANOMALY |
| ANOMALY | ANOMALY | ANOMALY |
| NORMAL | NORMAL | NORMAL |
| Model unavailable | NORMAL | UNKNOWN |

If both methods identify an issue, the dashboard can indicate that both AI and rules detected it.

The system also identifies the detection source:

- AI
- RULES
- AI + RULES
- UNKNOWN


## 7.3 Hybrid Testing

The hybrid anomaly detection system was evaluated using four controlled environmental scenarios.

Each scenario was processed using Isolation Forest V2 and the rule-based environmental monitoring component.

The final hybrid classification was determined by combining both detection results.

### Test Results

| Test Scenario | AI Result | Rule Result | Final Hybrid Result |
|---|---|---|---|
| Normal warehouse conditions (24°C, 55%) | NORMAL | NORMAL | NORMAL |
| High temperature (45°C, 55%) | NORMAL | ANOMALY | ANOMALY |
| Very high humidity (24°C, 95%) | NORMAL | ANOMALY | ANOMALY |
| Rapid temperature increase (35°C, 55%) | ANOMALY | ANOMALY | ANOMALY |

### Analysis

The normal environmental scenario was classified as NORMAL by both detection methods.

In the high-temperature scenario, Isolation Forest V2 classified the reading as NORMAL. However, the rule-based component identified that the temperature exceeded the configured maximum of 30°C.

Similarly, the very-high-humidity scenario was classified as NORMAL by the AI model, while the rule-based component detected that humidity exceeded the configured maximum of 70%.

In the rapid-temperature-increase scenario, both the AI model and rule-based component classified the reading as anomalous.

These results demonstrate the complementary behavior of the two monitoring methods.

The hybrid system successfully identified the three abnormal conditions in the controlled scenarios, even when the AI model alone did not classify all of them as anomalies.

### Testing Limitations

These tests verify the functional behavior of the hybrid classification logic for the selected scenarios.

They do not establish real-world anomaly detection accuracy, precision, recall, or production-level reliability.

Additional representative datasets and formal evaluation would be required before deployment in an operational warehouse.


# 8. Backend Development

## 8.1 FastAPI Backend

The NEXUS IoT backend was developed using Python and FastAPI.

It connects environmental sensor data sources, SQLite database storage, Isolation Forest V2 anomaly detection, configurable environmental threshold rules, and the web dashboard.

The backend also provides an HTTP interface for receiving simulated ESP32 sensor measurements forwarded through Node-RED.

The main backend components include:

| File | Responsibility |
|---|---|
| `main.py` | REST API endpoints, ESP32 sensor ingestion, and hybrid monitoring logic |
| `database.py` | SQLite database initialization, storage, and retrieval |
| `sensor.py` | Python-based environmental sensor simulation |
| `ai_model_v2.py` | AI feature preparation and Isolation Forest V2 model functionality |
| `test_ai_model_v2.py` | Controlled machine learning scenario testing |
| `main_backup.py` | Backup of an earlier backend implementation |

The backend is responsible for validating sensor measurements, storing environmental readings, preparing machine learning inputs, evaluating environmental thresholds, and returning monitoring results.

## 8.2 API Endpoints

The FastAPI backend provides REST endpoints for accessing system information, environmental measurements, facility information, and hybrid anomaly detection results.

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Returns the API running status |
| `/api/health` | GET | Returns API status, AI model information, and monitoring mode |
| `/api/facilities` | GET | Returns information about the four monitored facilities |
| `/api/readings` | GET | Retrieves sensor readings and hybrid anomaly classifications |
| `/api/summary` | GET | Returns monitoring statistics and the latest sensor reading |
| `/api/sensors/esp32` | POST | Receives simulated ESP32 measurements and returns hybrid anomaly analysis |

### 8.2.1 Facility-Specific Monitoring

The `/api/readings` and `/api/summary` endpoints support facility-specific data retrieval using the `facility_id` query parameter.

For example:

`GET /api/readings?limit=50&facility_id=data-center`

This request retrieves up to 50 recent readings associated with Data Center A.

`GET /api/summary?facility_id=warehouse`

This request returns monitoring statistics for Warehouse 4.

### 8.2.2 ESP32 Sensor Ingestion

The endpoint:

`POST /api/sensors/esp32`

receives environmental sensor measurements forwarded from Node-RED.

The current implementation supports the simulated ESP32 device `esp32-wokwi-01` associated with Warehouse 4.

Example request payload:

```json
{
  "facility_id": "warehouse",
  "device_id": "esp32-wokwi-01",
  "temperature": 24.6,
  "humidity": 55,
  "rule_status": "NORMAL"
}
```

The endpoint performs the following operations:

1. Receives a JSON measurement from Node-RED.
2. Validates the facility identifier and device identifier.
3. Validates temperature and humidity values.
4. Rejects invalid or non-finite measurements.
5. Generates a timestamp for the incoming reading.
6. Stores the measurement in SQLite.
7. Retrieves the relevant facility's sensor readings.
8. Performs hybrid AI and rule-based anomaly analysis.
9. Returns the latest analyzed reading to Node-RED.

The response includes a confirmation message, the device and facility identifiers, the ESP32 rule status, and the backend analysis.

The analysis contains fields such as:

| Field | Description |
|---|---|
| `id` | Stored reading identifier |
| `timestamp` | Reading timestamp |
| `temperature` | Environmental temperature |
| `humidity` | Environmental humidity |
| `facility_id` | Associated monitoring facility |
| `ai_status` | Isolation Forest V2 classification |
| `rule_status` | Backend rule-based classification |
| `rule_alerts` | Environmental threshold alerts |
| `status` | Final hybrid monitoring status |
| `anomaly_score` | Isolation Forest decision score |

The endpoint enables Node-RED to display the hybrid monitoring result without executing the machine learning model inside Node-RED.

### 8.2.3 API Health Monitoring

The `/api/health` endpoint provides information about:

- Backend availability.
- AI model loading status.
- AI model version.
- Number of AI input features.
- Hybrid monitoring mode.
- Number of configured facilities.

The API exchanges information with Node-RED and the frontend using JSON.

### 8.2.4 Frontend Communication

The frontend communicates with FastAPI using JavaScript Fetch API requests.

Cross-Origin Resource Sharing (CORS) is configured to support communication between the local frontend server and the backend.

The backend runs on port `8000`.

For the current demonstration setup, the frontend is served locally on port `5500`.

The dashboard periodically requests updated monitoring information without requiring full-page reloads.

## 8.3 Node-RED and FastAPI Integration

Node-RED acts as an intermediary between the simulated ESP32 MQTT publisher and the FastAPI backend.

The communication workflow is:

1. The simulated ESP32 publishes temperature and humidity measurements through MQTT.
2. Node-RED subscribes to the configured MQTT topic.
3. The Temperature Monitoring function evaluates the temperature measurement.
4. The Humidity Monitoring function evaluates the humidity measurement.
5. An HTTP request node sends the sensor payload to FastAPI.
6. FastAPI validates, stores, and analyzes the measurement.
7. Node-RED receives the HTTP response.
8. The AI Anomaly Alerts function processes the returned hybrid classification.
9. Node-RED displays normal or anomaly status indicators.

The Node-RED flow was exported to:

`documentation/nexus-iot-flow-final.json`

The integration separates communication processing from machine learning inference.

Node-RED handles message routing and monitoring indicators, while FastAPI performs the backend anomaly analysis.

## 8.4 Backend Execution

The backend is launched using Uvicorn:

```powershell
python -m uvicorn main:app --reload --app-dir backend
```

The local API address is:

`http://127.0.0.1:8000`

Interactive API documentation is available at:

`http://127.0.0.1:8000/docs`

The frontend can be started from the project root using:

```powershell
python -m http.server 5500
```

Dashboard URL:

`http://127.0.0.1:5500/frontend/index.html`

Node-RED is available locally at:

`http://127.0.0.1:1880`

The complete integration requires the FastAPI backend, Node-RED, and Wokwi simulation to be running during the ESP32 demonstration.

---
# 9. Frontend Dashboard Development

## 9.1 Dashboard Overview

The frontend provides a browser-based interface for monitoring warehouse environmental conditions.

It was developed using HTML, CSS, JavaScript, and Chart.js.

The dashboard retrieves monitoring information from the FastAPI backend.

## 9.2 Dashboard Features

The dashboard includes:

1. Temperature monitoring.
2. Humidity monitoring.
3. Total sensor readings.
4. Normal and anomalous reading statistics.
5. Temperature and humidity charts.
6. Recent sensor readings table.
7. Hybrid anomaly history.
8. AI and rule-based detection source indicators.
9. Environmental alert messages.
10. Backend connection status.

## 9.3 Hybrid Alert Display

The dashboard distinguishes between different detection sources.

Examples include:

- `AI + SAFETY ALERT`
- `ENVIRONMENTAL LIMIT EXCEEDED`
- `AI ANOMALY DETECTED`
- `HYBRID MONITORING ACTIVE`

The readings table also displays the final classification and its detection source.


## 9.4 Dashboard Data Updates

The dashboard automatically retrieves updated monitoring information from the FastAPI backend every five seconds.

JavaScript uses the Fetch API to request facility-specific sensor readings and monitoring statistics without reloading the entire webpage.

The automatic update process refreshes:

- Current temperature and humidity measurements.
- Total, normal, and anomalous reading statistics.
- Temperature and humidity visualizations.
- Recent sensor readings.
- Hybrid anomaly history.
- Monitoring alerts and backend connection status.

Users can switch between four monitored facilities:

1. HQ - Tower 1.
2. Data Center A.
3. R&D Lab.
4. Warehouse 4.

Each facility has independently generated simulated sensor readings stored with a unique facility identifier.

The dashboard preserves its scroll position during automatic updates, allowing users to inspect historical records without interruption.

The frontend is served locally using Python's HTTP server on port 5500. FastAPI is configured to permit cross-origin requests from the local frontend.

---

# 10. System Testing and Results

## 10.1 Testing Environment

The NEXUS IoT Smart Warehouse AIoT Monitoring System was tested in a local Windows development environment using:

- Python environmental sensor simulator.
- Wokwi ESP32 and DHT22 simulation.
- MQTT communication through the public EMQX broker.
- Node-RED message processing and monitoring flows.
- FastAPI backend and ESP32 ingestion endpoint.
- SQLite database.
- Isolation Forest V2 anomaly detection model.
- Rule-based environmental monitoring.
- Hybrid AI and rule-based classification.
- Browser-based NEXUS IoT dashboard.
- Chart.js visualizations.

The testing focused on functional correctness, component integration, environmental threshold detection, and real-time monitoring behavior.

## 10.2 Functional Testing

The main software components were tested to verify their integration.

| Test | Expected Result | Result |
|---|---|---|
| Database initialization | SQLite database initializes successfully | Passed |
| Sensor simulation | Simulated environmental readings are generated | Passed |
| Multi-facility simulation | Readings are generated for four facilities | Passed |
| Database storage | Readings are stored with facility identifiers | Passed |
| AI model loading | Isolation Forest V2 loads successfully | Passed |
| AI scenario testing | Model returns classifications and scores | Passed |
| Temperature threshold test | Temperature violations are detected | Passed |
| Humidity threshold test | Humidity violations are detected | Passed |
| Hybrid classification | AI and rule-based results are combined | Passed |
| API health check | Backend reports online status | Passed |
| Facility information endpoint | API provides configured facility information | Passed |
| Facility-specific summary | API returns monitoring statistics for a selected facility | Passed |
| Facility-specific readings | API retrieves readings for a selected facility | Passed |
| Frontend connection | Dashboard communicates with FastAPI | Passed |
| CORS configuration | Frontend requests from the configured local server are accepted | Passed |
| Dashboard visualization | Measurements, statistics, and charts are displayed | Passed |
| Facility navigation | Users can select monitored facilities | Passed |
| Hybrid anomaly history | Historical anomalies and detection sources are displayed | Passed |
| Automatic data refresh | Dashboard retrieves updated data periodically | Passed |
| Dashboard scroll stability | Automatic updates do not reload the entire page | Passed |

### Testing Observations

The backend health endpoint confirmed that Isolation Forest V2 was loaded with four input features and that hybrid monitoring was active.

Facility-specific API requests successfully returned monitoring statistics.

Controlled AI tests demonstrated that the rule engine detected temperature and humidity violations that the AI model alone did not identify.

The dashboard successfully displayed hybrid anomaly history after the frontend server and CORS configuration were corrected.

Automatic dashboard updates use JavaScript requests rather than full-page reloads, allowing the interface to remain stable during monitoring.

## 10.3 ESP32 and MQTT Integration Testing

The simulated ESP32 and DHT22 sensor were tested using the Wokwi simulation platform.

The ESP32 was configured to publish environmental measurements to the MQTT broker:

`broker.emqx.io:1883`

MQTT topic:

`nexus-iot-tarik-2026/warehouse/sensors`

The Node-RED MQTT input node subscribed to this topic and received the sensor messages.

The integration tests verified that:

1. The simulated ESP32 generated environmental measurements.
2. MQTT messages were published to the configured broker.
3. Node-RED received the messages.
4. Temperature and humidity monitoring functions processed the readings.
5. Node-RED forwarded the sensor data to FastAPI using HTTP POST.
6. FastAPI stored and analyzed the readings.
7. Node-RED received the backend response and displayed monitoring results.

The end-to-end integration was successfully demonstrated using normal and abnormal environmental measurements.

## 10.4 Normal Environmental Condition Test

A controlled normal environmental scenario was tested using the following measurements:

| Parameter | Value |
|---|---|
| Temperature | 24.6°C |
| Humidity | 55% |
| Facility | Warehouse 4 |
| Device | `esp32-wokwi-01` |
| Expected rule classification | NORMAL |
| Observed monitoring result | NORMAL |

The ESP32 simulation generated measurements within the configured environmental limits.

Node-RED received the MQTT message and forwarded the reading to FastAPI.

The backend processed the measurement and returned the monitoring analysis.

The Node-RED flow displayed the normal environmental condition.

This test demonstrated that the integrated system could process a normal sensor reading through the complete communication pipeline.

## 10.5 Abnormal Environmental Condition Test

A controlled high-temperature scenario was tested using the following measurements:

| Parameter | Value |
|---|---|
| Temperature | 40.5°C |
| Humidity | 55% |
| Facility | Warehouse 

# 11. Limitations and Future Improvements

## 11.1 Current Limitations

The NEXUS IoT Smart Warehouse AIoT Monitoring System is a functional educational prototype that integrates simulated IoT sensors, MQTT communication, Node-RED, FastAPI, SQLite, and hybrid anomaly detection.

Although the main components have been successfully integrated and tested, the system has several limitations.

1. **Simulated Sensor Hardware:** The system uses a Python sensor simulator and a Wokwi-based ESP32 with a simulated DHT22 sensor. Physical sensors have not been deployed in a real warehouse.

2. **Demonstration MQTT Infrastructure:** MQTT communication has been implemented using the public EMQX broker. The current configuration is intended for demonstration and does not provide a production-grade private broker, encrypted communication, or authenticated device access.

3. **Limited Training Data:** Isolation Forest V2 was trained using simulated environmental measurements rather than a representative real-world warehouse dataset.

4. **Shared AI Model:** All four monitored facilities use the same trained Isolation Forest V2 model. Separate facility-specific models have not been trained or validated.

5. **Local Deployment:** FastAPI, SQLite, Node-RED, and the frontend dashboard operate in a local development environment. A production cloud deployment has not been implemented.

6. **Demonstration Thresholds:** The configured temperature range of 15–30°C and humidity range of 30–70% are educational demonstration settings. Actual environmental requirements depend on the products and equipment being monitored.

7. **Limited Model Evaluation:** Controlled tests verify selected detection behaviors, but formal machine learning performance measurements, including precision, recall, and false-positive rates, have not been established.

8. **No Physical Actuation:** The simulated ESP32 uses LED indicators, and Node
# 12. Conclusion

This project presented the design, development, and testing of **NEXUS IoT: Smart Warehouse AIoT Monitoring System Using Hybrid AI Anomaly Detection**.

The system integrates environmental sensor simulation, IoT communication, backend processing, database storage, machine learning, rule-based monitoring, and a web-based dashboard into a unified environmental monitoring prototype.

The project was developed using two complementary data acquisition approaches. The first uses a Python-based sensor simulator to generate environmental measurements for four monitored facilities. The second uses a simulated ESP32 microcontroller and DHT22 sensor in Wokwi to publish temperature and humidity measurements through MQTT.

The ESP32 integration uses the EMQX MQTT broker and Node-RED to receive, process, and forward sensor measurements to the FastAPI backend. This demonstrates an end-to-end IoT communication workflow connecting simulated hardware to backend anomaly detection.

The backend uses SQLite for environmental data storage and Isolation Forest V2 for machine learning-based anomaly detection. The AI model analyzes temperature, humidity, and changes in environmental measurements. A rule-based engine evaluates configurable temperature and humidity limits.

The main technical contribution is the **hybrid anomaly detection approach**, which combines machine learning with environmental threshold rules. This allows the system to identify unusual environmental patterns while also detecting violations of predefined operating limits.

The NEXUS IoT dashboard provides multi-facility monitoring, environmental gauges, historical charts, reading statistics, and anomaly history. Its integration with FastAPI allows users to observe stored environmental measurements and monitoring results through a