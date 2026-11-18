
import joblib
import numpy as np

from ai_model_v2 import MODEL_PATH

# Demonstration thresholds used by the FastAPI backend.
MIN_TEMPERATURE = 15.0
MAX_TEMPERATURE = 30.0
MIN_HUMIDITY = 30.0
MAX_HUMIDITY = 70.0

model = joblib.load(MODEL_PATH)

test_cases = [
    {
        "name": "Normal warehouse conditions",
        "temperature": 24.0,
        "humidity": 55.0,
        "temperature_change": 0.2,
        "humidity_change": 0.5
    },
    {
        "name": "High temperature",
        "temperature": 45.0,
        "humidity": 55.0,
        "temperature_change": 0.2,
        "humidity_change": 0.5
    },
    {
        "name": "Very high humidity",
        "temperature": 24.0,
        "humidity": 95.0,
        "temperature_change": 0.2,
        "humidity_change": 0.5
    },
    {
        "name": "Rapid temperature increase",
        "temperature": 35.0,
        "humidity": 55.0,
        "temperature_change": 10.0,
        "humidity_change": 0.5
    }
]

print("\nSMART WAREHOUSE AI V2 - HYBRID SCENARIO TEST")
print("=" * 55)

for case in test_cases:
    features = np.array([[
        case["temperature"],
        case["humidity"],
        case["temperature_change"],
        case["humidity_change"]
    ]], dtype=float)

    prediction = model.predict(features)[0]
    score = model.decision_function(features)[0]

    ai_status = "ANOMALY" if prediction == -1 else "NORMAL"

    temperature = case["temperature"]
    humidity = case["humidity"]

    rule_alerts = []

    if temperature < MIN_TEMPERATURE or temperature > MAX_TEMPERATURE:
        rule_alerts.append("Temperature outside limits")

    if humidity < MIN_HUMIDITY or humidity > MAX_HUMIDITY:
        rule_alerts.append("Humidity outside limits")

    rule_status = "ANOMALY" if rule_alerts else "NORMAL"

    final_status = (
        "ANOMALY"
        if ai_status == "ANOMALY" or rule_status == "ANOMALY"
        else "NORMAL"
    )

    print(f"\nScenario: {case['name']}")
    print(f"Temperature: {temperature} °C")
    print(f"Humidity: {humidity} %")
    print(f"AI classification: {ai_status}")
    print(f"Rule classification: {rule_status}")
    print(f"Final hybrid status: {final_status}")
    print(f"AI anomaly score: {float(score):.4f}")

    if rule_alerts:
        print("Rule alerts:", ", ".join(rule_alerts))

print("\n" + "=" * 55)
print("SCENARIO TEST COMPLETED")
