
# Smart Warehouse Temperature and Humidity Monitoring System with AI-Based Anomaly Detection

**Project Type:** Artificial Intelligence of Things (AIoT)

**Project Domain:** Smart Warehouse Monitoring

**Student:** Tarik Louzia

**University:** Dalian Polytechnic University

**Major:** Computer Science and Technology

**Academic Year:** 2026–2027

---

# Abstract

Warehouse environments require continuous monitoring to maintain suitable temperature and humidity conditions for stored products. Traditional monitoring methods may depend on manual inspection and may not identify unusual environmental changes quickly.

This project presents a Smart Warehouse Temperature and Humidity Monitoring System based on Artificial Intelligence of Things (AIoT). The system collects temperature and humidity readings through a Python-based sensor simulator, processes and stores the data in an SQLite database, and applies a machine learning model to identify unusual environmental patterns.

The AI component uses the Isolation Forest algorithm for anomaly detection. A FastAPI backend provides access to sensor readings and monitoring statistics, while a web-based dashboard developed with HTML, CSS, JavaScript, and Chart.js displays environmental measurements, historical charts, and anomaly alerts.

The current implementation is a functional software prototype using simulated sensor data. It demonstrates how IoT data processing, machine learning, database management, and web technologies can be integrated into a warehouse monitoring application. Physical sensor integration and MQTT communication are considered future improvements.

**Keywords:** AIoT, Smart Warehouse, Internet of Things, Machine Learning, Isolation Forest, FastAPI, SQLite, Environmental Monitoring.

---

# 1. Introduction

## 1.1 Background

Warehouses play an important role in the storage and distribution of products. Environmental conditions, particularly temperature and humidity, can influence product quality and storage conditions.

Traditional monitoring approaches may require employees to check environmental measurements manually. This can make it difficult to identify unusual changes continuously.

The Internet of Things (IoT) provides a way to collect environmental information automatically through connected sensors. Artificial Intelligence (AI) can further improve monitoring by analyzing collected data and identifying unusual patterns.

By combining these technologies, an AIoT-based warehouse monitoring system can provide continuous environmental observation and support faster identification of abnormal readings.

## 1.2 Problem Statement

Monitoring temperature and humidity is important in warehouse environments. However, manual monitoring can be time-consuming and may not provide continuous analysis of environmental measurements.

There is a need for a system that can collect environmental data, store historical readings, analyze measurements automatically, and present monitoring information through an accessible interface.

This project addresses this need by developing a software prototype that combines simulated sensor readings, machine learning-based anomaly detection, database storage, and a web dashboard.

## 1.3 Project Objectives

The main objectives of this project are:

1. Develop a system for collecting temperature and humidity readings.
2. Simulate environmental sensor data for warehouse monitoring.
3. Store collected readings in an SQLite database.
4. Apply machine learning to identify unusual environmental patterns.
5. Develop a REST API using FastAPI.
6. Create a web dashboard for displaying real-time monitoring information.
7. Visualize historical temperature and humidity measurements.
8. Display AI anomaly alerts to help users identify unusual readings.

## 1.4 Scope of the Project

The current project focuses on developing and testing a software-based AIoT prototype.

The implementation includes simulated environmental data generation, Python-based processing, SQLite storage, Isolation Forest anomaly detection, a FastAPI backend, and a browser-based dashboard.

The current prototype does not yet include physical sensor connections or MQTT communication. These features can be integrated in future development stages.

---

# 2. System Architecture

## 2.1 Architecture Overview

The Smart Warehouse AIoT Monitoring System follows a layered architecture that separates data generation, processing, AI analysis, storage, and user interaction.

The architecture consists of the following components:

### 1. Data Generation Layer

This layer generates temperature and humidity measurements using a Python-based sensor simulator.

The simulator produces environmental readings at regular intervals to represent the behavior of warehouse monitoring sensors.

### 2. Edge Processing Layer

Python processes the generated sensor readings before they are stored.

The processing component prepares the temperature and humidity values for further analysis.

### 3. Artificial Intelligence Layer

The system uses the Isolation Forest machine learning algorithm to identify unusual environmental readings.

The trained model analyzes temperature and humidity values and classifies measurements as either normal or anomalous.

### 4. Data Storage Layer

An SQLite database stores the collected sensor readings.

Each record contains:
- Reading ID
- Timestamp
- Temperature
- Humidity

### 5. Backend Application Layer

The backend is developed using FastAPI.

It provides REST API endpoints for:
- Checking system health.
- Retrieving sensor readings.
- Retrieving monitoring statistics.
- Providing AI analysis results.

### 6. Presentation Layer

The presentation layer is a web-based dashboard developed using HTML, CSS, JavaScript, and Chart.js.

It displays:
- Latest temperature measurements.
- Latest humidity measurements.
- Total stored readings.
- Normal and anomalous readings.
- Historical environmental charts.
- AI anomaly alerts.

## 2.2 Data Flow

The system follows this data flow:

1. The Python simulator generates temperature and humidity readings.
2. Python processes the generated measurements.
3. The readings are stored in the SQLite database.
4. The trained Isolation Forest model analyzes the measurements.
5. FastAPI provides the readings and analysis results through REST endpoints.
6. The web dashboard retrieves the information from the API.
7. Chart.js visualizes historical measurements, while the dashboard displays monitoring statistics and anomaly alerts.

## 2.3 Architecture Diagram

The system architecture diagram is included as:

`../screenshots/system_architecture.png`

---

# 3. Technologies and Development Tools

The project uses the following technologies:

| Technology | Purpose |
|---|---|
| Python | Main programming language and data processing |
| FastAPI | Backend REST API |
| SQLite | Sensor data storage |
| Scikit-learn | Machine learning and anomaly detection |
| Isolation Forest | Identification of unusual readings |
| Joblib | Saving and loading the trained model |
| HTML | Dashboard structure |
| CSS | Dashboard styling |
| JavaScript | Frontend functionality |
| Chart.js | Environmental data visualization |
| Uvicorn | Running the FastAPI application |
| Visual Studio Code | Development environment |

## 3.1 Development Environment

The project was developed using Visual Studio Code on Windows.

Python 3.13.15 was used as the programming environment. A Python virtual environment was created to manage project dependencies.

The backend and frontend were developed as separate components within the same project directory.

---

# 4. Database Design

## 4.1 Database Overview

The project uses SQLite as its database management system.

SQLite was selected because it is lightweight, easy to integrate with Python, and suitable for a software prototype that stores environmental sensor measurements.

The database file is named:

`warehouse.db`

It is located in the project's `data` directory.

## 4.2 Database Table

The system uses a table named `sensor_readings`.

| Field | Data Type | Description |
|---|---|---|
| id | INTEGER | Unique reading identifier |
| timestamp | TEXT | Date and time of measurement |
| temperature | REAL | Temperature in Celsius |
| humidity | REAL | Relative humidity percentage |

The `id` field is the primary key and automatically increases for each new record.

The timestamp, temperature, and humidity fields are required.

## 4.3 Database Operations

The Python database module provides the following operations:

- Initialize the database and create the sensor readings table.
- Insert new environmental measurements.
- Retrieve stored sensor readings.
- Retrieve recent measurements for dashboard visualization.

The database allows the application to maintain historical environmental measurements.

---

# 5. Artificial Intelligence Implementation

## 5.1 Machine Learning Algorithm

The project uses the Isolation Forest algorithm from the Scikit-learn library.

Isolation Forest is an unsupervised machine learning algorithm designed to identify unusual observations in datasets.

Unlike supervised classification algorithms, it does not require manually labeled normal and anomalous examples during training.

In this project, the model analyzes two input features:

- Temperature (°C)
- Humidity (%)

## 5.2 Model Training

The model is trained using environmental readings stored in the SQLite database.

The implementation uses the following configuration:

| Parameter | Value |
|---|---|
| Algorithm | Isolation Forest |
| Number of estimators | 100 |
| Contamination | 0.05 |
| Random state | 42 |
| Input features | Temperature and humidity |

The contamination parameter represents the expected proportion of unusual observations used by the model during training.

The trained model is saved using Joblib in:

`models/isolation_forest.joblib`

This allows the application to load the trained model without training it every time the monitoring system starts.

## 5.3 Anomaly Detection Process

When a new sensor reading is generated, the AI model analyzes its temperature and humidity values.

The model returns a prediction:

- **Normal (1):** The reading is not identified as an anomaly.
- **Anomaly (-1):** The reading is identified as unusual compared with the learned data patterns.

The model also calculates a decision score that indicates how the observation relates to its learned decision boundary.

A negative decision score indicates an anomalous observation.

## 5.4 Model Testing

The trained model was tested using an example environmental measurement:

| Parameter | Test Value |
|---|---:|
| Temperature | 35.0 °C |
| Humidity | 90.0% |
| Expected model classification | Anomaly |

The test produced an anomaly classification, demonstrating that the trained model can identify measurements that differ from its learned baseline.

## 5.5 AI Model Limitations

The model identifies unusual patterns based on the training data. It does not directly predict product spoilage or determine whether warehouse conditions are safe for specific products.

Reliable product-safety assessment would require product-specific environmental limits and additional validation using representative warehouse data.

---

# 6. Backend Development

## 6.1 FastAPI Backend

The backend was developed using FastAPI, a Python framework for building REST APIs.

It connects the SQLite database, the trained machine learning model, and the web dashboard.

The backend is responsible for retrieving sensor measurements, performing AI analysis, and providing monitoring information to the frontend.

## 6.2 API Endpoints

The application provides the following endpoints:

| Endpoint | Method | Function |
|---|---|---|
| `/` | GET | Checks whether the API is running |
| `/api/health` | GET | Checks API and AI model status |
| `/api/readings` | GET | Retrieves sensor readings and AI classifications |
| `/api/summary` | GET | Provides monitoring statistics and the latest reading |

The API returns information in JSON format.

## 6.3 Backend Execution

The FastAPI application is launched using Uvicorn.

The backend runs locally at:

`http://127.0.0.1:8000`

FastAPI also provides an interactive API documentation interface at:

`http://127.0.0.1:8000/docs`

---

# 7. Frontend Dashboard Development

## 7.1 Dashboard Overview

The frontend provides a graphical interface for monitoring warehouse environmental conditions.

It was developed using HTML, CSS, JavaScript, and Chart.js.

The dashboard communicates with the FastAPI backend to retrieve the latest environmental measurements and AI analysis results.

## 7.2 Dashboard Features

The dashboard includes the following features:

1. **Temperature Monitoring:** Displays the latest temperature measurement.
2. **Humidity Monitoring:** Displays the latest humidity measurement.
3. **Total Readings:** Displays the number of stored sensor measurements.
4. **AI Anomalies:** Displays the number of readings classified as anomalous.
5. **Normal Readings:** Displays the number of readings classified as normal.
6. **Environmental Charts:** Visualizes historical temperature and humidity measurements.
7. **Sensor Readings Table:** Displays recent measurements with timestamps and AI classifications.
8. **AI Alerts:** Displays a visual notification when the latest reading is classified as anomalous.
9. **Connection Status:** Indicates whether the frontend can communicate with the backend.

## 7.3 Automatic Dashboard Updates

The JavaScript application periodically requests updated information from the backend.

The refresh interval is three seconds.

This allows the dashboard to display new sensor readings without requiring the user to reload the webpage manually.

---

# 8. System Testing and Results

## 8.1 Testing Environment

The complete software prototype was tested locally on Windows.

The testing environment included:

- Python sensor simulator.
- SQLite database.
- Trained Isolation Forest model.
- FastAPI backend.
- Web-based dashboard.
- Chart.js visualizations.

## 8.2 Functional Testing

The following tests were performed:

| Test | Expected Result | Status |
|---|---|---|
| Database initialization | Database created successfully | Passed |
| Sensor simulation | New readings generated | Passed |
| Database insertion | Sensor readings stored | Passed |
| AI model loading | Trained model loaded | Passed |
| Anomaly detection | Unusual readings identified | Passed |
| API health check | API reports online | Passed |
| API model status | AI model reports loaded | Passed |
| Dashboard connection | Frontend communicates with backend | Passed |
| Automatic refresh | Dashboard updates periodically | Passed |
| Data visualization | Temperature and humidity charts displayed | Passed |
| AI alert display | Anomaly notification displayed when applicable | Passed |

## 8.3 Testing Results

The testing demonstrated that the main software components work together successfully.

The sensor simulator generated environmental readings, the SQLite database stored the measurements, and the Isolation Forest model analyzed the data.

The FastAPI backend provided the monitoring information to the frontend, where the dashboard displayed measurements, statistics, historical charts, and AI classifications.

The results confirm that the software prototype successfully demonstrates the integration of IoT-style data generation, machine learning, backend services, and web-based monitoring.

## 8.4 Screenshots

The following screenshots should be included as evidence of the implementation:

- System architecture diagram.
- Running sensor simulator.
- AI model training and testing output.
- FastAPI backend running successfully.
- API health endpoint.
- Main dashboard.
- Temperature and humidity charts.
- Sensor readings table.
- AI anomaly alert.

Screenshots are stored in the project's `screenshots` directory.

---

# 9. Limitations and Future Improvements

## 9.1 Current Limitations

Although the prototype successfully demonstrates the integration of AI and IoT concepts, several limitations remain:

1. **Simulated Sensor Data:** The current implementation uses a Python simulator instead of physical temperature and humidity sensors.
2. **No MQTT Communication:** The current prototype communicates through local REST API requests rather than MQTT.
3. **Limited Training Data:** The machine learning model uses a relatively small dataset of simulated environmental measurements.
4. **Local Deployment:** The application currently runs on a local computer and is not deployed to a cloud platform.
5. **Product-Specific Conditions:** The model does not yet consider different environmental requirements for different warehouse products.

## 9.2 Future Improvements

Several improvements could be introduced in future versions:

- Integrate physical temperature and humidity sensors.
- Use an ESP32 or Raspberry Pi for real-time sensor data collection.
- Implement MQTT for IoT communication.
- Expand the training dataset using real warehouse measurements.
- Introduce product-specific environmental thresholds.
- Develop more advanced monitoring and notification features.
- Deploy the backend and database to a remote server.
- Improve dashboard functionality with additional analytics.

These improvements would help transform the current software prototype into a more complete warehouse monitoring solution.

---

# 10. Conclusion

This project presented the design and development of a Smart Warehouse Temperature and Humidity Monitoring System based on Artificial Intelligence of Things (AIoT).

The prototype integrates environmental data generation, Python-based processing, SQLite database management, machine learning-based anomaly detection, a FastAPI backend, and a web-based monitoring dashboard.

The Isolation Forest algorithm was implemented to identify unusual temperature and humidity patterns. The dashboard provides an accessible interface for viewing environmental measurements, historical data, monitoring statistics, and AI alerts.

The development process demonstrated how different technologies can be integrated into a single monitoring application.

Although the current implementation relies on simulated sensor data, it provides a foundation for future development involving physical IoT devices, MQTT communication, and real-world warehouse monitoring.

Overall, the project demonstrates the practical application of Artificial Intelligence and Internet of Things technologies in a smart warehouse environment.
