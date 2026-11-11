
import sqlite3
from pathlib import Path


# Database location
DATABASE_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "warehouse.db"
)


def initialize_database():
    """Create the warehouse sensor readings table."""

    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            temperature REAL NOT NULL,
            humidity REAL NOT NULL
        )
    """)

    connection.commit()
    connection.close()

    print("Database initialized successfully.")


def save_reading(sensor_data):
    """Save a sensor reading into SQLite."""

    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO sensor_readings
        (timestamp, temperature, humidity)
        VALUES (?, ?, ?)
    """, (
        sensor_data["timestamp"],
        sensor_data["temperature"],
        sensor_data["humidity"]
    ))

    connection.commit()
    connection.close()


def get_all_readings():
    """Retrieve all stored sensor readings."""

    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM sensor_readings
        ORDER BY id DESC
    """)

    readings = cursor.fetchall()
    connection.close()

    return readings


# Display existing readings without inserting test data
if __name__ == "__main__":

    initialize_database()

    readings = get_all_readings()

    print(f"\nTotal stored readings: {len(readings)}")

    for reading in readings[:10]:
        print(reading)
