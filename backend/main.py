
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_all_readings
from ai_model import load_model


app = FastAPI(
    title="Smart Warehouse AIoT API",
    description="API for warehouse temperature and humidity monitoring",
    version="1.0.0"
)


# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Load the trained AI model
try:
    model = load_model()
    print("AI model loaded successfully.")
except FileNotFoundError:
    model = None
    print("Warning: AI model not found. Train it first.")


def analyze_readings(readings):
    """Add AI predictions to database readings."""

    if not readings:
        return []

    features = [
        [reading[2], reading[3]]
        for reading in readings
    ]

    if model is not None:
        predictions = model.predict(features)
        scores = model.decision_function(features)
    else:
        predictions = [0] * len(readings)
        scores = [0.0] * len(readings)

    results = []

    for reading, prediction, score in zip(
        readings, predictions, scores
    ):

        results.append({
            "id": reading[0],
            "timestamp": reading[1],
            "temperature": reading[2],
            "humidity": reading[3],
            "status": (
                "ANOMALY" if prediction == -1
                else "NORMAL" if model is not None
                else "UNKNOWN"
            ),
            "anomaly_score": round(float(score), 4)
        })

    return results


@app.get("/")
def home():
    return {
        "message": "Smart Warehouse AIoT API is running",
        "status": "online"
    }


@app.get("/api/health")
def health():
    return {
        "api_status": "online",
        "ai_model_status": (
            "loaded" if model is not None else "not loaded"
        )
    }


@app.get("/api/readings")
def readings(limit: int = 50):

    limit = max(1, min(limit, 500))

    all_readings = get_all_readings()

    recent_readings = all_readings[:limit]

    return {
        "total": len(all_readings),
        "readings": analyze_readings(recent_readings)
    }


@app.get("/api/summary")
def summary():

    all_readings = get_all_readings()

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
        "total_readings": len(analyzed),
        "normal_readings": normal_count,
        "anomaly_readings": anomaly_count,
        "latest_reading": latest
    }
