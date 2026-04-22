# TripCompare AI

TripCompare AI is a full-stack AI-powered travel planning web application.

Users can chat with an intelligent travel agent to plan routes, compare travel costs, discover hotels under budget, and get place and food recommendations.

## Tech Stack

- Frontend: React.js + Tailwind CSS + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Optional AI: OpenAI API (for response enhancement)

## Core Features

1. AI Travel Agent
- ChatGPT-like chat interface
- User prompts like:
  - Find cheap hotels in Pune under 1000
  - Plan trip from Mumbai to Pune
  - Best places to visit in Goa
- Agent returns structured cards for hotels, travel, food, and places

2. Intent Detection Logic
- Rule-based keyword detection:
  - hotel -> hotel search
  - travel -> travel planning
  - food -> food suggestion
  - place -> places to visit

3. Data Extraction
- Extracts location from known cities
- Extracts budget from numbers in query
- Extracts route source/destination from "from ... to ..."

4. Hotel System
- MongoDB Hotel model
- Filter by location and max budget
- Sort by low-to-high price
- Shows image, name, price per day, rating

5. Travel Cost System
- Input: source and destination
- Distance: dummy coordinate-based haversine
- Cost options:
  - Car = fuel + toll
  - Bus = fare per person x travelers
  - Train = fare per person x travelers
  - Cab = estimated fare + toll + allowance

6. Recommendation System
- Places from MongoDB Place collection
- Food suggestions from dummy dataset
- Hotels from MongoDB

7. UI Requirements
- Modern chat interface with dark theme
- Chat bubbles for user and AI messages
- Card-based structured result display
- Smooth load and reveal animations

## Backend APIs

- POST /api/agent -> main AI logic
- GET /api/hotels -> hotel data with filters
- POST /api/travel -> cost calculation
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/trip/plan
- GET /api/trip/history

## Database Models

Hotel:
- name
- location
- price
- image
- rating

Place:
- name
- location
- description

Also includes:
- User
- TripPlan

## Folder Structure

```text
tripcompare-ai/
  README.md
  backend/
    .env.example
    package.json
    server.js
    src/
      config/
        db.js
      data/
        dummyData.js
        seedData.js
      middleware/
        authMiddleware.js
      models/
        Hotel.js
        Place.js
        TripPlan.js
        User.js
      routes/
        agentRoutes.js
        authRoutes.js
        hotelRoutes.js
        travelRoutes.js
        tripRoutes.js
      services/
        agentService.js
        seedService.js
        travelService.js
        tripPlannerService.js
  frontend/
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      App.jsx
      index.css
      main.jsx
      components/
        AgentResultCards.jsx
        CarLoader.jsx
        CostBreakdownCard.jsx
        ItineraryBoard.jsx
        Navbar.jsx
        ProtectedRoute.jsx
        RouteMapCard.jsx
        SuggestionsGrid.jsx
        TravelOptionCard.jsx
      context/
        AuthContext.jsx
      pages/
        AgentPage.jsx
        DashboardPage.jsx
        HomePage.jsx
        LoginPage.jsx
        ProfilePage.jsx
        SignupPage.jsx
      services/
        api.js
```

## Frontend vs Backend Files

Frontend (React + Vite):

- frontend/
- frontend/src/main.jsx
- frontend/src/App.jsx
- frontend/src/index.css
- frontend/src/components/
- frontend/src/pages/
- frontend/src/context/
- frontend/src/services/api.js
- frontend/package.json
- frontend/vite.config.js
- frontend/tailwind.config.js
- frontend/postcss.config.js
- frontend/index.html

Backend (Node + Express + MongoDB):

- backend/
- backend/server.js
- backend/src/config/db.js
- backend/src/routes/
- backend/src/controllers/
- backend/src/services/
- backend/src/models/
- backend/src/middleware/
- backend/src/data/
- backend/package.json
- backend/.env.example

Optional scraper microservice:

- scraper/
- scraper/app.py
- scraper/requirements.txt

## Setup Instructions (VS Code)

1. Backend setup

```powershell
cd "d:\Software eng\PricePilot\tripcompare-ai\backend"
npm install
Copy-Item .env.example .env
```

Server .env values:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/tripcompare_ai
JWT_SECRET=tripcompare_super_secret
CLIENT_URL=http://localhost:5174
GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
USE_OPENAI=false
```

2. Frontend setup

```powershell
cd "d:\Software eng\PricePilot\tripcompare-ai\frontend"
npm install
Copy-Item .env.example .env
```

Frontend .env values:

```env
VITE_API_URL=http://localhost:5001/api
```

3. Run MongoDB

Ensure MongoDB is available at:

```text
mongodb://127.0.0.1:27017
```

4. Start backend

```powershell
cd "d:\Software eng\PricePilot\tripcompare-ai\backend"
npm run dev
```

5. Start frontend

```powershell
cd "d:\Software eng\PricePilot\tripcompare-ai\frontend"
npm run dev
```

6. Open app

- Frontend: http://localhost:5174
- Backend health: http://localhost:5001/api/health

## Notes

- No Google scraping is used.
- Dummy data is used for toll charges, food costs, and seeded hotels/places.
- Optional OpenAI is used only when USE_OPENAI=true and OPENAI_API_KEY is set.
- Without OpenAI key, the app stays fully functional with rule-based logic.
