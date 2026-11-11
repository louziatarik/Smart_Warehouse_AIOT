
import random
import time
from datetime import datetime

from database import initialize_database, save_reading
from ai_model import load_model


def read_sensor():
    """Generate simulated warehouse sensor readings."""

    temperature = round(random.uniform(18.0, 30.0), 2)
    humidity = round(random.uniform(35.0, 75.0), 2)

    return {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "temperature": temperature,
        "humidity": humidity
    }


def analyze_reading(model, temperature, humidity):
    """Use the trained AI model to detect unusual readings."""

    features = [[temperature, humidity]]

    prediction = model.predict(features)[0]
    score = model.decision_function(features)[0]

    status = "ANOMALY" if prediction == -1 else "NORMAL"

    return status, round(float(score), 4)


if __name__ == "__main__":

    print("SMART WAREHOUSE AI MONITORING SYSTEM")
    print("------------------------------------")

    initialize_database()

    try:
        # Load the trained model once before monitoring
        model = load_model()

        print("AI model loaded successfully.")
        print("Live monitoring started.")
        print("------------------------------------")

        while True:

            data = read_sensor()

            # Save the sensor reading
            save_reading(data)

            # Analyze the reading using AI
            status, score = analyze_reading(
                model,
                data["temperature"],
                data["humidity"]
            )

            print(f"Time: {data['timestamp']}")
            print(f"Temperature: {data['temperature']} °C")
            print(f"Humidity: {data['humidity']} %")
            print(f"AI Status: {status}")
            print(f"Anomaly Score: {score}")
            print("Status: Reading saved to database")
            print("------------------------------------")

            time.sleep(3)

    except FileNotFoundError:
        print("AI model not found. Train it first using:")
        print("python backend/ai_model.py")

    except KeyboardInterrupt:
        print("\nMonitoring stopped.")
