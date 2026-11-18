
import random
import time
from datetime import datetime

import joblib

from database import (
    initialize_database,
    save_reading,
    FACILITIES
)
from ai_model_v2 import MODEL_PATH


def read_sensor(facility_id):
    """Generate an independent simulated reading."""

    return {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "temperature": round(random.uniform(18.0, 30.0), 2),
        "humidity": round(random.uniform(35.0, 75.0), 2),
        "facility_id": facility_id
    }


def validate_reading(data):
    """Validate simulated sensor readings."""

    temperature = data.get("temperature")
    humidity = data.get("humidity")

    if not isinstance(temperature, (int, float)):
        return False

    if not isinstance(humidity, (int, float)):
        return False

    if not (0 <= temperature <= 60):
        return False

    if not (0 <= humidity <= 100):
        return False

    if data.get("facility_id") not in FACILITIES:
        return False

    return True


def analyze_reading(
    model,
    temperature,
    humidity,
    previous_temperature=None,
    previous_humidity=None
):
    """Analyze a reading using AI Model V2."""

    if previous_temperature is None:
        temperature_change = 0.0
        humidity_change = 0.0
    else:
        temperature_change = abs(
            temperature - previous_temperature
        )
        humidity_change = abs(
            humidity - previous_humidity
        )

    features = [[
        temperature,
        humidity,
        temperature_change,
        humidity_change
    ]]

    prediction = model.predict(features)[0]
    score = model.decision_function(features)[0]

    status = "ANOMALY" if prediction == -1 else "NORMAL"

    return status, round(float(score), 4)


if __name__ == "__main__":

    print("NEXUS IoT - MULTI-FACILITY MONITORING")
    print("------------------------------------")

    initialize_database()

    try:
        model = joblib.load(MODEL_PATH)

        print("AI Model V2 loaded successfully.")
        print("Facilities:", len(FACILITIES))
        print("Sensor validation: ENABLED")
        print("Monitoring interval: 3 seconds")
        print("------------------------------------")

        # Keep previous readings separately for each facility.
        previous_readings = {
            facility_id: {
                "temperature": None,
                "humidity": None
            }
            for facility_id in FACILITIES
        }

        while True:

            for facility_id, facility_name in FACILITIES.items():

                data = read_sensor(facility_id)

                if not validate_reading(data):
                    print(
                        f"WARNING: Invalid reading rejected "
                        f"for {facility_name}."
                    )
                    continue

                previous = previous_readings[facility_id]

                status, score = analyze_reading(
                    model,
                    data["temperature"],
                    data["humidity"],
                    previous["temperature"],
                    previous["humidity"]
                )

                save_reading(data)

                print(f"Facility: {facility_name}")
                print(f"Time: {data['timestamp']}")
                print(f"Temperature: {data['temperature']} °C")
                print(f"Humidity: {data['humidity']} %")
                print(f"AI Status: {status}")
                print(f"Anomaly Score: {score}")
                print("Status: Reading saved")
                print("------------------------------------")

                previous_readings[facility_id] = {
                    "temperature": data["temperature"],
                    "humidity": data["humidity"]
                }

            time.sleep(3)

    except FileNotFoundError:
        print("AI Model V2 not found. Train it first using:")
        print("python backend/ai_model_v2.py")

    except KeyboardInterrupt:
        print("\nMulti-facility monitoring stopped.")
