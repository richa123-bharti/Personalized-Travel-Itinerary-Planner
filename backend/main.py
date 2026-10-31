import os
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Roamio Travel Planner")
allowed_origins = ["http://localhost:5173"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripRequest(BaseModel):
    destination: str = Field(min_length=1)
    days: int = Field(default=3, ge=1, le=14)
    budget: Literal["Budget", "Mid-range", "Premium"] = "Mid-range"
    style: Literal["Relaxed", "Balanced", "Packed"] = "Balanced"
    interests: list[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: Literal["ok"]


DESTINATIONS = {
    "Goa": ["Baga Beach", "Fontainhas", "Dudhsagar Falls", "Panjim Market"],
    "Jaipur": ["Amber Fort", "City Palace", "Hawa Mahal", "Johari Bazaar"],
    "Paris": ["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River"],
    "Bali": ["Uluwatu Temple", "Ubud Monkey Forest", "Nusa Dua", "Tegallalang Rice Terrace"],
}

COUNTRIES = {
    "Goa": "India",
    "Jaipur": "India",
    "Paris": "France",
    "Bali": "Indonesia",
}


@app.get("/health")
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/itinerary")
def create_itinerary(request: TripRequest):
    places = DESTINATIONS.get(request.destination.title(), [f"{request.destination} Old Town", request.destination])
    itinerary = []
    for index in range(request.days):
        itinerary.append({
            "day": index + 1,
            "title": ["Arrival & local flavors", "Culture & iconic sights", "Hidden gems & relaxation"][index % 3],
            "activities": [
                {"time": "09:00", "title": places[index % len(places)], "category": "Attraction"},
                {"time": "13:00", "title": "Local lunch", "category": "Dining"},
                {"time": "16:30", "title": places[(index + 1) % len(places)], "category": "Experience"},
            ],
        })
    return {"destination": request.destination, "country": COUNTRIES.get(request.destination.title(), request.destination), "budget": request.budget, "style": request.style, "interests": request.interests, "itinerary": itinerary}
