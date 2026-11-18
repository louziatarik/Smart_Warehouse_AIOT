# NEXUS IoT — Smart Warehouse AIoT Monitoring System

## 1. Project Overview

NEXUS IoT is an intelligent, multi-facility environmental monitoring prototype designed to monitor temperature and humidity using simulated sensor measurements.

The system combines Internet of Things (IoT) communication, Artificial Intelligence (AI) anomaly detection, rule-based environmental monitoring, and real-time web visualization.

It supports Python-generated sensor measurements and a Wokwi ESP32 simulation connected to a DHT22 temperature and humidity sensor.

The ESP32 publishes measurements through MQTT. Node-RED processes the incoming messages and forwards them to a FastAPI backend, where the readings are stored and analyzed using Isolation Forest V2 and configurable environmental thresholds.

The system is intended for academic demonstration and testing rather than production warehouse deployment.

## 2. Project Objectives

The main objectives are to:

- Monitor temperature and humidity across multiple facilities.
- Collect environmental measurements from simulated sensor sources.
- Demonstrate ESP32-based IoT sensor communication.
- Transmit environmental data using MQTT.
- Process sensor messages through Node-RED.
- Validate and store sensor readings in SQLite.
- Detect unusual environmental patterns using machine learning.
- Identify environmental measurements outside configured limits.
- Combine AI predictions and rule-based alerts.
- Display monitoring information through an interactive web dashboard.
- Provide centralized environmental anomaly monitoring.
- Demonstrate end-to-end communication between simulated IoT devices and an AI-powered backend.

## 3. Functional Requirements

### 3.1 Multi-Facility Monitoring

**FR-01:** The system shall support monitoring for four configured facilities:

- HQ - Tower 1 (`hq`)
- Data Center A (`data-center`)
- R&D Lab (`rnd`)
- Warehouse 4 (`warehouse`)

**FR-02:** The system shall associate sensor readings with their corresponding facility identifiers.

**FR-03:** The system shall allow users to view facility-specific monitoring information.

### 3.2 Sensor Data Acquisition

**FR-04:** The system shall collect temperature measurements.

**FR-05:** The system shall collect humidity measurements.

**FR-06:** The system shall support Python-generated environmental sensor readings.

**FR-07:** The system shall support simulated ESP32 sensor measurements using Wokwi.

**FR-08:** The ESP32 simulation shall use a DHT22 temperature and humidity sensor.

**FR-09:** The system shall validate incoming sensor measurements before database storage.

**FR-10:** The ESP32 simulation shall provide visual LED indicators for normal and abnormal environmental conditions.

### 3.3 MQTT Communication

**FR-11:** The ESP32 simulation shall publish sensor measurements using MQTT.

**FR-12:** MQTT messages shall contain structured JSON data.

**FR-13:** Sensor messages shall identify the device and facility.

**FR-14:** Node-RED shall subscribe to the configured MQTT topic.

**FR-15:** The system shall support transmission of simulated ESP32 readings to the backend through Node-RED.

Demonstration MQTT configuration:

| Parameter | Value |
|---|---|
| Broker | `broker.emqx.io` |
| Port | `1883` |
| Topic | `nexus-iot-tarik-2026/warehouse/sensors` |
| Facility ID | `warehouse` |
| Device ID | `esp32-wokwi-01` |

The public MQTT broker is used for educational demonstration purposes.

### 3.4 Node-RED Data Processing

**FR-16:** Node-RED shall receive MQTT sensor messages.

**FR-17:** Node-RED shall provide a temperature monitoring function.

**FR-18:** Node-RED shall provide a humidity monitoring function.

**FR-19:** Node-RED shall forward sensor measurements to FastAPI using HTTP POST.

**FR-20:** Node-RED shall receive the anomaly analysis returned by FastAPI.

**FR-21:** Node-RED shall display visual indicators for normal and abnormal monitoring results.

**FR-22:** Node-RED shall provide debugging information for sensor messages and API responses.

### 3.5 Backend Processing and Data Management

**FR-23:** The backend shall expose REST API endpoints using FastAPI.

**FR-24:** The backend shall validate incoming ESP32 measurements.

**FR-25:** The backend shall reject invalid or non-finite sensor measurements.

**FR-26:** The backend shall store sensor readings persistently in SQLite.

**FR-27:** Each stored reading shall include a timestamp and facility identifier.

**FR-28:** The backend shall provide access to historical readings.

**FR-29:** The backend shall provide facility-specific monitoring summaries.

**FR-30:** The backend shall return the analysis of an ingested ESP32 reading to Node-RED.

The ESP32 ingestion endpoint is:

`POST /api/sensors/esp32`

### 3.6 AI Anomaly Detection

**FR-31:** The system shall use an Isolation Forest machine learning model.

**FR-32:** The model shall analyze temperature and humidity measurements.

**FR-33:** The model shall consider changes between consecutive environmental readings.

**FR-34:** The model shall generate normal or anomaly classifications.

**FR-35:** The model shall generate anomaly decision scores.

The Isolation Forest V2 model uses four input features:

1. Temperature.
2. Humidity.
3. Absolute temperature change.
4. Absolute humidity change.

The model uses a StandardScaler and Isolation Forest pipeline.

### 3.7 Rule-Based Monitoring

**FR-36:** The system shall compare temperature measurements against configured thresholds.

**FR-37:** The system shall compare humidity measurements against configured thresholds.

**FR-38:** The system shall identify readings that exceed the configured environmental limits.

Demonstration thresholds:

| Parameter | Minimum | Maximum |
|---|---|---|
| Temperature | 15°C | 30°C |
| Humidity | 30% | 70% |

These are demonstration values rather than universal warehouse safety standards.

### 3.8 Hybrid Anomaly Detection

**FR-39:** The system shall combine AI predictions and rule-based results.

**FR-40:** A reading shall be classified as anomalous when either detection method identifies an anomaly.

**FR-41:** The backend shall report the final hybrid monitoring status.

**FR-42:** The backend shall identify the AI and rule-based detection results.

**FR-43:** The backend shall provide triggered rule alerts when applicable.

**FR-44