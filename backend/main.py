from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import csv
from statistics import mean
from collections import Counter

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent / "data" / "weather_2024.csv"


def load_data():
    rows = []
    with DATA_FILE.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["temp_c"] = float(row["temp_c"])
            row["wind_speed_mps"] = float(row["wind_speed_mps"])
            rows.append(row)
    return rows


WEATHER_DATA = load_data()


@app.get("/daily")
def get_daily():
    """Returner alle dagene som en liste."""
    return {"days": WEATHER_DATA}


@app.get("/summary")
def get_summary():
    temps = [d["temp_c"] for d in WEATHER_DATA]
    conditions = [d["condition"] for d in WEATHER_DATA]

    coldest = min(WEATHER_DATA, key=lambda d: d["temp_c"])
    warmest = max(WEATHER_DATA, key=lambda d: d["temp_c"])

    condition_counts = Counter(conditions)

    summary = {
        "total_days": len(WEATHER_DATA),
        "avg_temp": round(mean(temps), 1),
        "coldest": {
            "date": coldest["date"],
            "temp_c": coldest["temp_c"],
            "condition": coldest["condition"],
        },
        "warmest": {
            "date": warmest["date"],
            "temp_c": warmest["temp_c"],
            "condition": warmest["condition"],
        },
        "conditions": condition_counts,
    }
    return summary


@app.get("/")
def root():
    return {"message": "Weather API is running"}
