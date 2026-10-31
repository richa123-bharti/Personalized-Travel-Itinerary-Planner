# Roamio Personalized Travel Itinerary Planner

A React and FastAPI travel planner that generates day-by-day itineraries from a destination, trip length, budget, travel style, and interests.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API documentation is available at `http://localhost:8000/docs`.

## Run both services

Open one terminal for the backend:

```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

Open a second terminal for the frontend:

```powershell
cd frontend
npm run dev
```

Then open `http://localhost:5173`.

## Source repository

https://github.com/richa123-bharti/Personalized-Travel-Itinerary-Planner
