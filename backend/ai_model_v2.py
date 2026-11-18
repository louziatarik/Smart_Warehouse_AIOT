
from pathlib import Path

import joblib
import numpy as np

from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from database import get_all_readings, FACILITIES


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "isolation_forest_v2.joblib"
)


def prepare_features(readings):
    """
    Prepare chronological sensor features separately
    for each facility.
    """

    readings = sorted(
        readings,
        key=lambda row: row["id"]
    )

    features = []
    previous_values = {}

    for reading in readings:

        facility_id = reading["facility_id"]

        temperature = float(reading["temperature"])
        humidity = float(reading["humidity"])

        previous = previous_values.get(facility_id)

        if previous is None:
            temperature_change = 0.0
            humidity_change = 0.0
        else:
            temperature_change = abs(
                temperature - previous["temperature"]
            )

            humidity_change = abs(
                humidity - previous["humidity"]
            )

        features.append([
            temperature,
            humidity,
            temperature_change,
            humidity_change
        ])

        previous_values[facility_id] = {
            "temperature": temperature,
            "humidity": humidity
        }

    return np.asarray(features, dtype=float)


def train_model():

    readings = get_all_readings()

    if len(readings) < 30:
        raise ValueError(
            "Collect at least 30 sensor readings before training."
        )

    features = prepare_features(readings)

    print("SMART WAREHOUSE AI MODEL V2")
    print("-----------------------------------")
    print("Training records:", len(features))
    print("Input features:", features.shape[1])

    print("\nRecords per facility:")

    for facility_id, facility_name in FACILITIES.items():
        count = sum(
            1 for reading in readings
            if reading["facility_id"] == facility_id
        )
        print(f"{facility_name}: {count}")

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("isolation_forest", IsolationForest(
            n_estimators=200,
            contamination=0.05,
            random_state=42
        ))
    ])

    model.fit(features)

    predictions = model.predict(features)

    normal_count = int(np.sum(predictions == 1))
    anomaly_count = int(np.sum(predictions == -1))

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    joblib.dump(model, MODEL_PATH)

    print("\nTRAINING COMPLETED")
    print("-----------------------------------")
    print("Normal classifications:", normal_count)
    print("Anomaly classifications:", anomaly_count)
    print(
        "Anomaly percentage:",
        round(anomaly_count / len(features) * 100, 2),
        "%"
    )
    print("Model saved to:", MODEL_PATH)


if __name__ == "__main__":
    train_model()
