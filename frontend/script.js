
const API_URL = "http://127.0.0.1:8000";
const REFRESH_INTERVAL = 3000;

let temperatureChart = null;
let lastTableReadingId = null;

const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 48;


// ----------------------------------
// TIME AND DATE
// ----------------------------------

function formatTime(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function updateDate() {
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }
}


// ----------------------------------
// BACKEND CONNECTION
// ----------------------------------

function updateConnection(connected) {
    const statusElement = document.getElementById("connectionStatus");
    const textElement = document.getElementById("connectionText");

    if (statusElement) {
        statusElement.classList.toggle("connected", connected);
        statusElement.classList.toggle("disconnected", !connected);
    }

    if (textElement) {
        textElement.textContent = connected
            ? "Connected"
            : "Disconnected";
    }
}


// ----------------------------------
// GAUGES
// ----------------------------------

function updateGauge(circleClass, value, maximum) {
    const circle = document.querySelector(`.${circleClass}`);

    if (!circle) return;

    const percentage = Math.max(
        0,
        Math.min(Number(value) / maximum, 1)
    );

    const offset = GAUGE_CIRCUMFERENCE * (1 - percentage);

    circle.style.strokeDasharray = GAUGE_CIRCUMFERENCE;
    circle.style.strokeDashoffset = offset;
}

function updateGauges(temperature, humidity) {
    updateGauge("temperature-progress", temperature, 35);
    updateGauge("humidity-progress", humidity, 100);
}


// ----------------------------------
// CHART GLOW EFFECT
// ----------------------------------

const neonGlowPlugin = {
    id: "neonGlow",

    beforeDatasetDraw(chart) {
        chart.ctx.save();

        chart.ctx.shadowColor = "#00F0FF";
        chart.ctx.shadowBlur = 12;
        chart.ctx.shadowOffsetX = 0;
        chart.ctx.shadowOffsetY = 0;
    },

    afterDatasetDraw(chart) {
        chart.ctx.restore();
    }
};


// ----------------------------------
// INITIALIZE TEMPERATURE CHART
// ----------------------------------

function initializeChart() {
    const canvas = document.getElementById("temperatureChart");

    if (!canvas) return;

    temperatureChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: [],

            datasets: [{
                label: "Temperature",
                data: [],

                borderColor: "#00F0FF",
                backgroundColor: "rgba(0, 240, 255, 0.06)",

                borderWidth: 2.5,
                fill: true,
                tension: 0.4,

                pointRadius: 3,
                pointHoverRadius: 5,

                pointBackgroundColor: "#111827",
                pointBorderColor: "#00F0FF",
                pointBorderWidth: 2,

                pointHoverBackgroundColor: "#00F0FF",
                pointHoverBorderColor: "#FFFFFF"
            }]
        },

        plugins: [neonGlowPlugin],

        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 350
            },

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#172235",
                    borderColor: "#00F0FF",
                    borderWidth: 1,
                    titleColor: "#00F0FF",
                    bodyColor: "#FFFFFF",
                    padding: 11,
                    displayColors: false
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#8291A8",
                        maxTicksLimit: 6,
                        font: {
                            size: 9
                        }
                    }
                },

                y: {
                    beginAtZero: false,

                    grid: {
                        color: "rgba(130, 145, 168, 0.10)",
                        drawTicks: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#8291A8",
                        padding: 8,
                        font: {
                            size: 9
                        }
                    }
                }
            }
        }
    });
}


// ----------------------------------
// UPDATE TEMPERATURE CHART
// ----------------------------------

function updateChart(readings) {
    if (!temperatureChart || !readings || readings.length === 0) {
        return;
    }

    const orderedReadings = [...readings].reverse();

    const labels = orderedReadings.map(reading => {
        const date = new Date(reading.timestamp);

        return Number.isNaN(date.getTime())
            ? "--"
            : date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
    });

    const temperatures = orderedReadings.map(
        reading => Number(reading.temperature)
    );

    temperatureChart.data.labels = labels;
    temperatureChart.data.datasets[0].data = temperatures;

    // Update without replaying the chart animation.
    temperatureChart.update("none");
}


// ----------------------------------
// SENSOR READINGS TABLE
// ----------------------------------

function updateTable(readings) {
    const tableBody = document.getElementById("readingsTable");

    if (!tableBody || !readings || readings.length === 0) {
        return;
    }

    const newestReadingId = readings[0].id;

    // Avoid rebuilding the table when nothing has changed.
    if (newestReadingId === lastTableReadingId) {
        return;
    }

    lastTableReadingId = newestReadingId;

    tableBody.innerHTML = "";

    // Display only the latest 10 readings.
    const latestReadings = readings.slice(0, 10);

    latestReadings.forEach(reading => {
        const row = document.createElement("tr");

        const values = [
            reading.id,
            formatTime(reading.timestamp),
            `${Number(reading.temperature).toFixed(2)} °C`,
            `${Number(reading.humidity).toFixed(2)} %`
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // AI classification
        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        const status = reading.status || "UNKNOWN";

        badge.classList.add("status-badge");

        if (status === "ANOMALY") {
            badge.classList.add("status-anomaly");
        } else if (status === "NORMAL") {
            badge.classList.add("status-normal");
        }

        badge.textContent = status;

        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        // Anomaly score
        const scoreCell = document.createElement("td");
        const score = Number(reading.anomaly_score);

        scoreCell.textContent = Number.isFinite(score)
            ? score.toFixed(4)
            : "--";

        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });
}


// ----------------------------------
// AI ALERT PANEL
// ----------------------------------

function updateAlert(data) {
    const alertElement = document.getElementById("aiAlert");

    const iconElement = document.getElementById("alertIcon");
    const titleElement = document.getElementById("alertTitle");
    const messageElement = document.getElementById("alertMessage");

    if (!alertElement || !iconElement || !titleElement || !messageElement) {
        return;
    }

    const latest = data.latest_reading;

    alertElement.classList.remove("warning", "alert-danger");

    if (!latest) {
        iconElement.textContent = "...";
        titleElement.textContent = "AI Monitoring Active";
        messageElement.textContent = "Waiting for sensor readings...";
        return;
    }

    if (latest.status === "ANOMALY") {
        alertElement.classList.add("warning");

        iconElement.textContent = "!";
        titleElement.textContent = "AI ANOMALY DETECTED";

        messageElement.textContent =
            `Unusual reading detected. Temperature: ${
                Number(latest.temperature).toFixed(1)
            } °C | Humidity: ${
                Number(latest.humidity).toFixed(1)
            } %.`;
    } else {
        iconElement.textContent = "✓";
        titleElement.textContent = "AI Monitoring Active";

        messageElement.textContent =
            "System normal: No unusual pattern detected in the latest reading.";
    }
}


// ----------------------------------
// DASHBOARD TEXT HELPER
// ----------------------------------

function setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = value;
    }
}


// ----------------------------------
// UPDATE SUMMARY AND STATISTICS
// ----------------------------------

async function updateSummary() {
    const response = await fetch(`${API_URL}/api/summary`);

    if (!response.ok) {
        throw new Error("Could not retrieve dashboard summary.");
    }

    const data = await response.json();

    setText("totalReadings", data.total_readings ?? 0);
    setText("normalReadings", data.normal_readings ?? 0);
    setText("anomalyCount", data.anomaly_readings ?? 0);

    const latest = data.latest_reading;

    if (latest) {
        const temperature = Number(latest.temperature);
        const humidity = Number(latest.humidity);

        setText(
            "currentTemperature",
            `${temperature.toFixed(1)} °C`
        );

        setText(
            "currentHumidity",
            `${humidity.toFixed(1)} %`
        );

        updateGauges(temperature, humidity);

        setText("lastUpdate", formatTime(latest.timestamp));
    }

    updateAlert(data);
}


// ----------------------------------
// GET SENSOR READINGS
// ----------------------------------

async function updateReadings() {
    const response = await fetch(`${API_URL}/api/readings?limit=50`);

    if (!response.ok) {
        throw new Error("Could not retrieve sensor readings.");
    }

    const data = await response.json();

    updateChart(data.readings);
    updateTable(data.readings);
}


// ----------------------------------
// REFRESH DASHBOARD DATA
// ----------------------------------

async function refreshDashboard() {
    try {
        await Promise.all([
            updateSummary(),
            updateReadings()
        ]);

        updateConnection(true);

    } catch (error) {
        console.error("Dashboard error:", error);
        updateConnection(false);
    }
}


// ----------------------------------
// START DASHBOARD
// ----------------------------------

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    initializeChart();

    refreshDashboard();

    // Silent background data refresh.
    setInterval(refreshDashboard, REFRESH_INTERVAL);

    // Update the date periodically.
    setInterval(updateDate, 60000);

});
