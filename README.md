# CompareX AI - Smart Search + Price Comparison Platform

CompareX AI is an advanced full-stack web application that acts like a focused search engine for price comparison across Food, Shopping, and Ride booking platforms.

## Tech Stack

- Frontend: React + Tailwind CSS + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Optional scraper microservice: Python (Flask, BeautifulSoup, Selenium)

## Key Features

- Google-like smart search bar
- Autocomplete suggestions
- AI intent detection (`food`, `shopping`, `ride`)
- Intelligent routing to category services
- Price comparison cards with cheapest highlight
- Ride mode with source/destination and distance-based fare simulation
- Optional Google Maps Distance Matrix integration
- JWT authentication (signup/login/logout)
- User dashboard with profile management, search history, and wishlist
- Dark/light mode and responsive SaaS-style UI

## Folder Structure

```text
PricePilot/
  client/
    .env.example
    package.json
    index.html
    src/
      App.jsx
      index.css
      components/
      context/
      pages/
      services/
      utils/
  server/
    .env.example
    package.json
    server.js
    src/
      config/
      controllers/
      data/
      middleware/
      models/
      routes/
      scripts/
      services/
      utils/
  scraper/
    app.py
    requirements.txt
  README.md
```

## Environment Configuration

### Backend (`server/.env`)

Copy from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/comparex
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
GOOGLE_MAPS_API_KEY=
```

### Frontend (`client/.env`)

Copy from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

## Sample Dataset

- Primary sample catalog: `server/src/data/platformCatalog.js`
- JSON sample export: `server/src/data/sampleDataset.json`

To seed non-ride shopping/food products into MongoDB:

```bash
cd server
npm run seed
```

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Intelligent Search

- `GET /api/search/suggestions?q=laptop`
- `POST /api/search`
- `POST /api/search/compare`
- `POST /api/compare`

### Backward Compatibility

- `GET /api/products/search?query=vada+pav&sortBy=price`

### User

- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/user/wishlist`
- `DELETE /api/user/wishlist/:itemId`

## Request Examples

### Intelligent Search

```json
{
  "query": "cab from Pune to Mumbai",
  "source": "Pune",
  "destination": "Mumbai",
  "filters": {
    "maxPrice": 3000,
    "minRating": 4,
    "sortBy": "price"
  }
}
```

### Compare Existing Items

```json
{
  "items": [{ "platform": "Uber", "price": 2200, "rating": 4.6, "etaMinutes": 95 }],
  "sortBy": "price",
  "maxPrice": 3000,
  "minRating": 4
}
```

## Step-by-Step Run Commands (VS Code)

1. Open project folder:

```powershell
cd "d:\Software eng\PricePilot"
```

2. Install frontend dependencies:

```powershell
cd client
npm install
```

3. Install backend dependencies:

```powershell
cd ..\server
npm install
```

4. Create `.env` files:

```powershell
Copy-Item .env.example .env
cd ..\client
Copy-Item .env.example .env
```

5. Ensure MongoDB is running.

6. Optional: seed sample products:

```powershell
cd ..\server
npm run seed
```

7. Start backend (Terminal 1):

```powershell
cd "d:\Software eng\PricePilot\server"
npm run dev
```

8. Start frontend (Terminal 2):

```powershell
cd "d:\Software eng\PricePilot\client"
npm run dev
```

9. Open app:

- `http://localhost:5173`

## Optional Scraper Microservice

Run in separate terminal:

```powershell
cd "d:\Software eng\PricePilot\scraper"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Health endpoint:

- `http://localhost:8000/health`

## Notes

- If `GOOGLE_MAPS_API_KEY` is not provided, ride distance/fare uses deterministic simulation.
- Search history is saved automatically for logged-in users.
- Wishlist saving requires authentication.
