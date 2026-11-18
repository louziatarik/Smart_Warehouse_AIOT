
import sqlite3
from pathlib import Path


DATABASE_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "warehouse.db"
)


FACILITIES = {
    "hq": "HQ - Tower 1",
    "data-center": "Data Center A",
    "rnd": "R&D Lab",
    "warehouse": "Warehouse 4"
}


def initialize_database():
    """Create and migrate the warehouse sensor database."""

    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DATABASE_PATH) as connection:
        cursor = connection.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                temperature REAL NOT NULL,
                humidity REAL NOT NULL,
                facility_id TEXT NOT NULL DEFAULT 'data-center'
            )
        """)

        columns = [
            row[1]
            for row in cursor.execute(
                "PRAGMA table_info(sensor_readings)"
            )
        ]

        if "facility_id" not in columns:
            cursor.execute("""
                ALTER TABLE sensor_readings
                ADD COLUMN facility_id TEXT NOT NULL
                DEFAULT 'data-center'
            """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS
            idx_sensor_facility_timestamp
            ON sensor_readings(facility_id, timestamp)
        """)

    print("Database initialized successfully.")


def save_reading(sensor_data):
    """Save a sensor reading for a specific facility."""

    facility_id = sensor_data.get("facility_id", "data-center")

    if facility_id not in FACILITIES:
        raise ValueError(f"Unknown facility: {facility_id}")

    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute("""
            INSERT INTO sensor_readings
            (timestamp, temperature, humidity, facility_id)
            VALUES (?, ?, ?, ?)
        """, (
            sensor_data["timestamp"],
            sensor_data["temperature"],
            sensor_data["humidity"],
            facility_id
        ))


def get_all_readings(facility_id=None):
    """Retrieve readings, optionally filtered by facility."""

    with sqlite3.connect(DATABASE_PATH) as connection:

        connection.row_factory = sqlite3.Row

        if facility_id is not None:
            if facility_id not in FACILITIES:
                raise ValueError(f"Unknown facility: {facility_id}")

            rows = connection.execute("""
                SELECT id, timestamp, temperature, humidity,
                       facility_id
                FROM sensor_readings
                WHERE facility_id = ?
                ORDER BY id DESC
            """, (facility_id,)).fetchall()

        else:
            rows = connection.execute("""
                SELECT id, timestamp, temperature, humidity,
                       facility_id
                FROM sensor_readings
                ORDER BY id DESC
            """).fetchall()

        return [dict(row) for row in rows]


if __name__ == "__main__":

    initialize_database()

    readings = get_all_readings()

    print(f"\nTotal stored readings: {len(readings)}")

    for reading in readings[:10]:
        print(reading)
