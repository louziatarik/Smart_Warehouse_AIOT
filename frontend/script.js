
// ==========================================
// NEXUS IoT - MULTI-FACILITY DASHBOARD
// ==========================================

const API_URL = "http://127.0.0.1:8000";
const REFRESH_INTERVAL = 5000;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 48;

let temperatureChart = null;
let activeFacility = "data-center";

let lastTableReadingId = null;

// ==========================================
// FACILITY CONFIGURATION
// ==========================================

const facilities = {
    hq: {
        name: "HQ - Tower 1",
        heading: "HQ - Tower 1 Dashboard",
        subtitle: "HEADQUARTERS / TOWER 1",
        floorTitle: "Headquarters Floor Plan",
        floorSubtitle: "HQ - TOWER 1 / LEVEL 01"
    },

    "data-center": {
        name: "Data Center A",
        heading: "Data Center A Dashboard",
        subtitle: "MONITORING CENTER / DATA CENTER A",
        floorTitle: "Data Center Floor Plan",
        floorSubtitle: "DATA CENTER A / LEVEL 02"
    },

    rnd: {
        name: "R&D Lab",
        heading: "R&D Lab Dashboard",
        subtitle: "RESEARCH CENTER / R&D LAB",
        floorTitle: "Research Laboratory Floor Plan",
        floorSubtitle: "R&D LAB / LEVEL 03"
    },

    warehouse: {
        name: "Warehouse 4",
        heading: "Warehouse 4 Dashboard",
        subtitle: "STORAGE FACILITY / WAREHOUSE 4",
        floorTitle: "Warehouse Floor Plan",
        floorSubtitle: "WAREHOUSE 4 / LEVEL 01"
    }
};


// ==========================================
// GENERAL HELPERS
// ==========================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


function getNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}


function formatTime(timestamp) {
    if (!timestamp) {
        return "--";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return String(timestamp);
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


function formatDateTime(timestamp) {
    if (!timestamp) {
        return "--";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return String(timestamp);
    }

    return date.toLocaleString();
}


function updateDate() {
    const dateElement = document.getElementById("currentDate");

    if (!dateElement) return;

    dateElement.textContent = new Date().toLocaleDateString(
        undefined,
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================================
// CONNECTION STATUS
// ==========================================

function updateConnection(connected) {
    const indicator = document.getElementById("connectionStatus");
    const text = document.getElementById("connectionText");

    if (!indicator || !text) return;

    if (connected) {
        indicator.classList.remove("disconnected");
        text.textContent = "Connected";
    } else {
        indicator.classList.add("disconnected");
        text.textContent = "Disconnected";
    }
}


// ==========================================
// FACILITY NAVIGATION
// ==========================================

function updateFacilityDisplay(facilityId) {
    const facility = facilities[facilityId];

    if (!facility) return;

    activeFacility = facilityId;

    // Update active navigation item.
    document.querySelectorAll(".nav-item[data-facility]").forEach(item => {
        const isActive = item.dataset.facility === facilityId;

        item.classList.toggle("active", isActive);

        if (isActive) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });

    // Update dashboard heading.
    setText("dashboardTitle", facility.heading);

    // Update facility subtitle.
    setText("facilitySubtitle", facility.subtitle);

    // Update floor plan labels.
    setText("floorPlanTitle", facility.floorTitle);
    setText("floorPlanSubtitle", facility.floorSubtitle);

    // Update data notice.
    setText(
        "facilityDataNotice",
        `Viewing ${facility.name}. Displaying its independently generated simulated sensor readings.`
    );

    // Update browser tab.
    document.title = `${facility.name} | NEXUS IoT`;

    // Clear previous facility data while the new request loads.
    lastTableReadingId = null;

    setText("totalReadings", "0");
    setText("normalReadings", "0");
    setText("anomalyCount", "0");

    setText("currentTemperature", "-- °C");
    setText("currentHumidity", "-- %");
    setText("lastUpdate", "Loading...");

    const readingsTable = document.getElementById("readingsTable");
    const anomalyTable = document.getElementById("anomalyHistoryTable");

    if (readingsTable) {
        readingsTable.innerHTML = `
            <tr>
                <td colspan="6">Loading ${escapeHTML(facility.name)} readings...</td>
            </tr>
        `;
    }

    if (anomalyTable) {
        anomalyTable.innerHTML = `
            <tr>
                <td colspan="4">Loading anomaly history...</td>
            </tr>
        `;
    }

    if (temperatureChart) {
        temperatureChart.data.labels = [];
        temperatureChart.data.datasets[0].data = [];
        temperatureChart.update("none");
    }

    // Reset alert panel.
    const alertPanel = document.getElementById("aiAlert");

    if (alertPanel) {
        alertPanel.classList.remove("warning", "alert-danger");
    }

    setText("alertIcon", "✓");
    setText("alertTitle", "AI Monitoring Active");
    setText("alertMessage", `Loading sensor information for ${facility.name}...`);
}


// Attach one delegated click handler to the navigation.
function initializeFacilityNavigation() {
    const navigation = document.querySelector(".location-nav");

    if (!navigation) return;

    navigation.addEventListener("click", event => {
        const item = event.target.closest(".nav-item[data-facility]");

        if (!item || !navigation.contains(item)) return;

        const facilityId = item.dataset.facility;

        if (!facilities[facilityId]) {
            console.error("Unknown facility:", facilityId);
            return;
        }

        if (facilityId === activeFacility) return;

        // Save the current facility.
        try {
            sessionStorage.setItem("nexusActiveFacility", facilityId);
        } catch (error) {
            console.warn("Could not save facility selection:", error);
        }

        // Preserve the current scroll position.
        const scrollPosition = window.scrollY;

        // Switch facility without reloading the page.
        updateFacilityDisplay(facilityId);

        refreshDashboard();

        // Restore scroll position if necessary.
        window.scrollTo({
            top: scrollPosition,
            behavior: "instant"
        });

        console.log("Switched facility to:", facilityId);
    });
}

// ==========================================
// GAUGES
// ==========================================

function updateGauge(selector, percentage) {
    const gauge = document.querySelector(selector);

    if (!gauge) return;

    const safePercentage = Math.max(
        0,
        Math.min(100, percentage)
    );

    const offset = GAUGE_CIRCUMFERENCE *
        (1 - safePercentage / 100);

    gauge.style.strokeDasharray = GAUGE_CIRCUMFERENCE;
    gauge.style.strokeDashoffset = offset;
}


function updateGauges(temperature, humidity) {
    // Temperature gauge uses a 0-50°C display scale.
    const temperaturePercentage = (temperature / 50) * 100;

    // Humidity gauge uses a 0-100% display scale.
    const humidityPercentage = humidity;

    updateGauge(
        ".temperature-progress",
        temperaturePercentage
    );

    updateGauge(
        ".humidity-progress",
        humidityPercentage
    );
}


// ==========================================
// CHART
// ==========================================

const neonGlowPlugin = {
    id: "neonGlow",

    beforeDatasetDraw(chart) {
        const context = chart.ctx;

        context.save();

        context.shadowBlur = 12;
        context.shadowColor = "rgba(0, 240, 255, 0.55)";
    },

    afterDatasetDraw(chart) {
        chart.ctx.restore();
    }
};


function initializeChart() {
    const canvas = document.getElementById("temperatureChart");

    if (!canvas || typeof Chart === "undefined") {
        console.error("Chart.js or temperature canvas not found.");
        return;
    }

    temperatureChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: [],

            datasets: [{
                label: "Temperature",
                data: [],

                borderColor: "#00F0FF",
                backgroundColor: "rgba(0, 240, 255, 0.08)",

                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,

                pointBackgroundColor: "#00F0FF",
                pointBorderColor: "#00F0FF",

                tension: 0.35,
                fill: true
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#111827",
                    borderColor: "#26364B",
                    borderWidth: 1,

                    titleColor: "#FFFFFF",
                    bodyColor: "#00F0FF"
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#8291A8",
                        maxTicksLimit: 6,
                        font: {
                            size: 9
                        }
                    },

                    border: {
                        display: false
                    }
                },

                y: {
                    grid: {
                        color: "rgba(130, 145, 168, 0.12)"
                    },

                    ticks: {
                        color: "#8291A8",
                        font: {
                            size: 9
                        }
                    },

                    border: {
                        display: false
                    }
                }
            }
        },

        plugins: [neonGlowPlugin]
    });
}


function updateChart(readings) {
    if (!temperatureChart) return;

    // API returns newest readings first.
    // Reverse them so the chart displays chronological order.
    const chronologicalReadings = [...readings].reverse();

    const labels = chronologicalReadings.map(reading => {
        return formatTime(reading.timestamp);
    });

    const temperatures = chronologicalReadings.map(reading => {
        return getNumber(reading.temperature);
    });

    temperatureChart.data.labels = labels;

    temperatureChart.data.datasets[0].data = temperatures;

    temperatureChart.update("none");
}


// ==========================================
// SENSOR READINGS TABLE
// ==========================================

function getStatusClass(status) {
    return String(status).toUpperCase() === "ANOMALY"
        ? "status-anomaly"
        : "status-normal";
}


function updateTable(readings) {
    const table = document.getElementById("readingsTable");

    if (!table) return;

    if (!readings || readings.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">No sensor readings available for this facility.</td>
            </tr>
        `;

        lastTableReadingId = null;
        return;
    }

    const newestId = readings[0].id;

    if (newestId === lastTableReadingId) {
        return;
    }

    lastTableReadingId = newestId;

    const latestReadings = readings.slice(0, 10);

    table.innerHTML = latestReadings.map(reading => {
        const status = String(reading.status || "NORMAL").toUpperCase();

        const statusClass = getStatusClass(status);

        const score = reading.anomaly_score;

        return `
            <tr>
                <td>${escapeHTML(reading.id)}</td>

                <td>${escapeHTML(formatDateTime(reading.timestamp))}</td>

                <td>${getNumber(reading.temperature).toFixed(2)} °C</td>

                <td>${getNumber(reading.humidity).toFixed(2)} %</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHTML(status)}
                    </span>
                </td>

                <td>
                    ${score === null || score === undefined
                        ? "--"
                        : getNumber(score).toFixed(4)}
                </td>
            </tr>
        `;
    }).join("");
}


// ==========================================
// HYBRID ANOMALY HISTORY
// ==========================================

function updateAnomalyHistory(readings) {
    const table = document.getElementById("anomalyHistoryTable");

    if (!table) return;

    const anomalies = readings.filter(reading => {
        return String(reading.status).toUpperCase() === "ANOMALY";
    });

    if (anomalies.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">No anomalies detected for this facility.</td>
            </tr>
        `;

        return;
    }

    const latestAnomalies = anomalies.slice(0, 5);

    table.innerHTML = latestAnomalies.map(reading => {
        const score = reading.anomaly_score;

        return `
            <tr>
                <td>${escapeHTML(formatDateTime(reading.timestamp))}</td>

                <td>${getNumber(reading.temperature).toFixed(2)} °C</td>

                <td>${getNumber(reading.humidity).toFixed(2)} %</td>

                <td>
                    ${score === null || score === undefined
                        ? "--"
                        : getNumber(score).toFixed(4)}
                </td>
            </tr>
        `;
    }).join("");
}


// ==========================================
// HYBRID AI ALERT PANEL
// ==========================================

function updateAlert(latestReading) {
    const alertPanel = document.getElementById("aiAlert");

    if (!alertPanel) return;

    if (!latestReading) {
        setText("alertIcon", "✓");
        setText("alertTitle", "AI Monitoring Active");
        setText("alertMessage", "Waiting for sensor analysis...");
        alertPanel.classList.remove("warning", "alert-danger");
        return;
    }

    const status = String(
        latestReading.status || "NORMAL"
    ).toUpperCase();

    const aiStatus = String(
        latestReading.ai_status || "UNKNOWN"
    ).toUpperCase();

    const ruleStatus = String(
        latestReading.rule_status || "UNKNOWN"
    ).toUpperCase();

    const ruleAlerts = latestReading.rule_alerts || [];

    if (status === "ANOMALY") {
        alertPanel.classList.add("warning");

        setText("alertIcon", "!");
        setText("alertTitle", "Environmental Anomaly Detected");

        let message = `Hybrid monitoring detected an abnormal reading. AI status: ${aiStatus}. Rule status: ${ruleStatus}.`;

        if (Array.isArray(ruleAlerts) && ruleAlerts.length > 0) {
            message += " Rule alerts: " + ruleAlerts.join(", ");
        }

        setText("alertMessage", message);

    } else {
        alertPanel.classList.remove("warning", "alert-danger");

        setText("alertIcon", "✓");
        setText("alertTitle", "Environment Within Monitoring Limits");

        setText(
            "alertMessage",
            `Latest reading passed hybrid monitoring. AI status: ${aiStatus}. Rule status: ${ruleStatus}.`
        );
    }
}


// ==========================================
// SUMMARY DATA
// ==========================================

function readSummaryValue(summary, possibleKeys, fallback) {
    for (const key of possibleKeys) {
        if (
            summary &&
            summary[key] !== undefined &&
            summary[key] !== null
        ) {
            return summary[key];
        }
    }

    return fallback;
}


function updateSummary(summary, readings) {
    const total = readSummaryValue(
        summary,
        ["total_readings", "total", "reading_count"],
        readings.length
    );

    const normal = readSummaryValue(
        summary,
        ["normal_readings", "normal", "normal_count"],
        readings.filter(r => String(r.status).toUpperCase() === "NORMAL").length
    );

    const anomalies = readSummaryValue(
        summary,
        ["anomaly_count", "anomaly_readings", "anomalies"],
        readings.filter(r => String(r.status).toUpperCase() === "ANOMALY").length
    );

    setText("totalReadings", total);
    setText("normalReadings", normal);
    setText("anomalyCount", anomalies);

    const latestReading =
        summary?.latest_reading ||
        summary?.latest ||
        readings[0] ||
        null;

    if (latestReading) {
        const temperature = getNumber(latestReading.temperature);
        const humidity = getNumber(latestReading.humidity);

        setText(
            "currentTemperature",
            `${temperature.toFixed(1)} °C`
        );

        setText(
            "currentHumidity",
            `${humidity.toFixed(1)} %`
        );

        updateGauges(temperature, humidity);

        setText(
            "lastUpdate",
            formatTime(latestReading.timestamp)
        );

        updateAlert(latestReading);

    } else {
        setText("currentTemperature", "-- °C");
        setText("currentHumidity", "-- %");
        setText("lastUpdate", "--");

        updateGauges(0, 0);
        updateAlert(null);
    }
}


// ==========================================
// API REQUESTS
// ==========================================

async function fetchFacilitySummary(facilityId) {
    const url =
        `${API_URL}/api/summary?facility_id=${encodeURIComponent(facilityId)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Summary API error: ${response.status}`);
    }

    return await response.json();
}


async function fetchFacilityReadings(facilityId) {
    const url =
        `${API_URL}/api/readings?limit=50&facility_id=${encodeURIComponent(facilityId)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Readings API error: ${response.status}`);
    }

    return await response.json();
}


// ==========================================
// DASHBOARD REFRESH
// ==========================================

async function refreshDashboard() {
    // Capture the selected facility at the beginning.
    const requestedFacility = activeFacility;

    try {
        const [summary, readingsResponse] = await Promise.all([
            fetchFacilitySummary(requestedFacility),
            fetchFacilityReadings(requestedFacility)
        ]);

        // Prevent an old API response from updating a newly selected facility.
        if (requestedFacility !== activeFacility) {
            return;
        }

        // Support either a direct array or an object containing readings.
        const readings = Array.isArray(readingsResponse)
            ? readingsResponse
            : readingsResponse.readings || [];

        updateSummary(summary, readings);

        updateChart(readings);

        updateTable(readings);

        updateAnomalyHistory(readings);

        updateConnection(true);

    } catch (error) {
        // Ignore errors from requests belonging to an old facility.
        if (requestedFacility !== activeFacility) {
            return;
        }

        console.error(
            `Dashboard refresh failed for ${requestedFacility}:`,
            error
        );

        updateConnection(false);

        setText(
            "alertTitle",
            "Backend Connection Problem"
        );

        setText(
            "alertMessage",
            "Unable to retrieve the latest sensor data. Check that the FastAPI backend is running."
        );

        const alertPanel = document.getElementById("aiAlert");

        if (alertPanel) {
            alertPanel.classList.add("warning");
        }
    }
}


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("NEXUS IoT dashboard initializing...");

    // Restore the previously selected facility if valid.
    try {
        const savedFacility = sessionStorage.getItem("nexusActiveFacility");

        if (savedFacility && facilities[savedFacility]) {
            activeFacility = savedFacility;
        }
    } catch (error) {
        console.warn("Could not restore facility selection:", error);
    }

    // Initialize navigation.
    initializeFacilityNavigation();

    // Display the selected facility.
    updateFacilityDisplay(activeFacility);

    // Initialize date.
    updateDate();

    // Initialize Chart.js.
    initializeChart();

    // Initial data request.
    refreshDashboard();

    // Automatic dashboard refresh.
    setInterval(() => {
        refreshDashboard();
    }, REFRESH_INTERVAL);

    // Update displayed date periodically.
    setInterval(updateDate, 60000)});