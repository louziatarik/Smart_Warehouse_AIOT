
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal
import math
from fastapi.middleware.cors import CORSMiddleware

from database import (
    get_all_readings,
    save_reading,
    initialize_database,
    FACILITIES
)
from ai_model_v2 import MODEL_PATH, prepare_features

import joblib


class ESP32SensorReading(BaseModel):
    facility_id: Literal["warehouse"]
    device_id: Literal["esp32-wokwi-01"]
    temperature: float = Field(ge=-40, le=80)
    humidity: float = Field(ge=0, le=100)
    rule_status: Literal["NORMAL", "ANOMALY"]


initialize_database()

# Configurable demonstration thresholds
MIN_TEMPERATURE = 15.0
MAX_TEMPERATURE = 30.0

MIN_HUMIDITY = 30.0
MAX_HUMIDITY = 70.0


app = FastAPI(
    title="Smart Warehouse AIoT API",
    description="Multi-facility hybrid AI and rule-based monitoring",
    version="4.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5501",
        "http://127.0.0.1:5501"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Load AI Model V2
try:
    model = joblib.load(MODEL_PATH)
    print("AI Model V2 loaded successfully.")
except FileNotFoundError:
    model = None
    print("Warning: AI Model V2 not found. Train it first.")


def check_safety_thresholds(temperature, humidity):
    """Check configurable warehouse demonstration limits."""

    alerts = []

    if not MIN_TEMPERATURE <= temperature <= MAX_TEMPERATURE:
        alerts.append("TEMPERATURE_OUT_OF_RANGE")

    if not MIN_HUMIDITY <= humidity <= MAX_HUMIDITY:
        alerts.append("HUMIDITY_OUT_OF_RANGE")

    return alerts


def analyze_readings(readings):
    """Combine AI anomaly detection and threshold rules."""

    if not readings:
        return []

    # Oldest readings first
    chronological = sorted(
        readings,
        key=lambda reading: reading["id"]
    )

    features = prepare_features(chronological)

    if model is not None:
        predictions = model.predict(features)
        scores = model.decision_function(features)
    else:
        predictions = [0] * len(chronological)
        scores = [0.0] * len(chronological)

    results = []

    for reading, prediction, score in zip(
        chronological, predictions, scores
    ):

        temperature = float(reading["temperature"])
        humidity = float(reading["humidity"])

        ai_status = (
            "ANOMALY" if prediction == -1
            else "NORMAL" if model is not None
            else "UNKNOWN"
        )

        rule_alerts = check_safety_thresholds(
            temperature,
            humidity
        )

        rule_status = (
            "ANOMALY" if rule_alerts else "NORMAL"
        )

        if ai_status == "ANOMALY" or rule_status == "ANOMALY":
            final_status = "ANOMALY"
        elif ai_status == "UNKNOWN":
            final_status = "UNKNOWN"
        else:
            final_status = "NORMAL"

        results.append({
            "id": reading["id"],
            "timestamp": reading["timestamp"],
            "temperature": temperature,
            "humidity": humidity,
            "facility_id": reading["facility_id"],
            "ai_status": ai_status,
            "rule_status": rule_status,
            "rule_alerts": rule_alerts,
            "status": final_status,
            "anomaly_score": round(float(score), 4)
        })

    # Newest readings first
    return results[::-1]


def validate_facility(facility_id):
    """Validate a requested facility ID."""

    if facility_id is not None and facility_id not in FACILITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown facility ID: {facility_id}"
        )


@app.get("/")
def home():
    return {
        "message": "Smart Warehouse AIoT API is running",
        "status": "online",
        "monitoring_mode": "HYBRID",
        "facilities": len(FACILITIES)
    }


@app.get("/api/health")
def health():
    return {
        "api_status": "online",
        "ai_model_status": (
            "loaded" if model is not None else "not loaded"
        ),
        "ai_model_version": "V2",
        "ai_model_features": 4,
        "monitoring_mode": "HYBRID",
        "facility_count": len(FACILITIES)
    }


@app.get("/api/facilities")
def facilities():

    results = []

    for facility_id, facility_name in FACILITIES.items():

        readings = get_all_readings(facility_id)

        results.append({
            "id": facility_id,
            "name": facility_name,
            "total_readings": len(readings)
        })

    return {
        "total_facilities": len(results),
        "facilities": results
    }


@app.get("/api/readings")
def readings(
    limit: int = Query(default=50, ge=1, le=500),
    facility_id: str = None
):

    validate_facility(facility_id)

    all_readings = get_all_readings(facility_id)

    recent_readings = all_readings[:limit]

    return {
        "total": len(all_readings),
        "facility_id": facility_id,
        "readings": analyze_readings(recent_readings)
    }


@app.get("/api/summary")
def summary(facility_id: str = None):

    validate_facility(facility_id)

    all_readings = get_all_readings(facility_id)

    analyzed = analyze_readings(all_readings)

    anomaly_count = sum(
        item["status"] == "ANOMALY"
        for item in analyzed
    )

    normal_count = sum(
        item["status"] == "NORMAL"
        for item in analyzed
    )

    latest = analyzed[0] if analyzed else None

    return {
        "facility_id": facility_id,
        "total_readings": len(analyzed),
        "normal_readings": normal_count,
        "anomaly_readings": anomaly_count,
        "latest_reading": latest,
        "monitoring_mode": "HYBRID"
    }

@app.post("/api/sensors/esp32", status_code=201)
def receive_esp32_reading(data: ESP32SensorReading):
    """Receive a simulated ESP32 measurement from Node-RED."""

    if not math.isfinite(data.temperature) or not math.isfinite(data.humidity):
        raise HTTPException(
            status_code=422,
            detail="Temperature and humidity must be finite numbers."
        )

    reading = {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "temperature": data.temperature,
        "humidity": data.humidity,
        "facility_id": data.facility_id
    }

    try:
        save_reading(reading)
    except (ValueError, KeyError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    stored_readings = get_all_readings(data.facility_id)

    latest = analyze_readings(stored_readings)[0]

    return {
        "message": "ESP32 reading stored successfully",
        "device_id": data.device_id,
        "facility_id": data.facility_id,
        "esp32_rule_status": data.rule_status,
        "analysis": latest
    }
