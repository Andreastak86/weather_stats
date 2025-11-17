const API_BASE = "http://localhost:8000";

let allDays = [];

async function loadSummary() {
    const res = await fetch(`${API_BASE}/summary`);
    const data = await res.json();

    document.getElementById("total-days").textContent = data.total_days;
    document.getElementById("avg-temp").textContent = `${data.avg_temp} °C`;

    document.getElementById(
        "warmest"
    ).textContent = `${data.warmest.temp_c} °C (${data.warmest.date}, ${data.warmest.condition})`;

    document.getElementById(
        "coldest"
    ).textContent = `${data.coldest.temp_c} °C (${data.coldest.date}, ${data.coldest.condition})`;

    const condList = document.getElementById("conditions-list");
    condList.innerHTML = "";
    Object.entries(data.conditions).forEach(([cond, count]) => {
        const li = document.createElement("li");
        li.textContent = `${cond}: ${count} dager`;
        condList.appendChild(li);
    });
}

async function loadDaily() {
    const res = await fetch(`${API_BASE}/daily`);
    const data = await res.json();

    allDays = data.days || [];

    initMonthFilter();
    renderMonth(0);
}

function initMonthFilter() {
    const select = document.getElementById("month-filter");
    select.addEventListener("change", (e) => {
        const monthIndex = parseInt(e.target.value, 10);
        renderMonth(monthIndex);
    });
}

function renderMonth(monthIndex) {
    const tbody = document.getElementById("daily-table-body");
    tbody.innerHTML = "";

    const monthStr = String(monthIndex + 1).padStart(2, "0");
    const daysInMonth = allDays.filter(
        (day) => day.date.slice(5, 7) === monthStr
    );

    daysInMonth.forEach((day) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${day.date}</td>
      <td>${day.temp_c}</td>
      <td>${day.condition}</td>
      <td>${day.wind}</td>
      <td>${day.wind_speed_mps}</td>
    `;
        tbody.appendChild(tr);
    });
}

loadSummary().catch(console.error);
loadDaily().catch(console.error);
