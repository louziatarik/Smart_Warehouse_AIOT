
from pathlib import Path

import joblib
from sklearn.ensemble import IsolationForest

from database import get_all_readings


# Model file location
MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "isolation_forest.joblib"
)


def train_model():
    """Train an Isolation Forest model using stored sensor readings."""

    readings = get_all_readings()

    if len(readings) < 20:
        raise ValueError(
            "Not enough sensor readings. Collect at least 20 readings first."
        )

    # Extract temperature and humidity
    features = [
        [reading[2], reading[3]]
        for reading in readings
    ]

    print("TRAINING AI ANOMALY DETECTION MODEL")
    print("-----------------------------------")
    print(f"Training records: {len(features)}")

    # Create and train the model
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42
    )

    model.fit(features)

    # Save trained model
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    # Check the training data
    predictions = model.predict(features)

    normal_count = sum(prediction == 1 for prediction in predictions)
    anomaly_count = sum(prediction == -1 for prediction in predictions)

    print("\nTRAINING COMPLETED")
    print("-----------------------------------")
    print(f"Normal readings: {normal_count}")
    print(f"Anomalies detected: {anomaly_count}")
    print(f"Model saved to: {MODEL_PATH}")


def load_model():
    """Load the previously trained model."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "AI model not found. Train the model first."
        )

    return joblib.load(MODEL_PATH)


def predict_anomaly(temperature, humidity):
    """Classify a new temperature and humidity reading."""

    model = load_model()

    prediction = model.predict([[temperature, humidity]])[0]
    anomaly_score = model.decision_function(
        [[temperature, humidity]]
    )[0]

    if prediction == -1:
        status = "ANOMALY"
    else:
        status = "NORMAL"

    return {
        "temperature": temperature,
        "humidity": humidity,
        "status": status,
        "anomaly_score": round(float(anomaly_score), 4)
    }


if __name__ == "__main__":

    train_model()

    print("\nTESTING AI MODEL")
    print("-----------------------------------")

    test_result = predict_anomaly(35.0, 90.0)

    print(f"Temperature: {test_result['temperature']} °C")
    print(f"Humidity: {test_result['humidity']} %")
    print(f"Status: {test_result['status']}")
    print(f"Anomaly score: {test_result['anomaly_score']}")
