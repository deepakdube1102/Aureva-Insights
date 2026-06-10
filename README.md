# Aureva Fund Insight Tracker


A full-stack MERN application to search Indian Mutual Funds, manage a personal watchlist, and view NAV performance charts.

![Aureva Fund Insight Tracker](https://img.shields.io/badge/MERN-Stack-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

## ✨ Features

- **🔍 Search & Discover** — Search across thousands of Indian mutual fund schemes via MFapi.in
- **📋 Personal Watchlist** — Add/remove funds to a persistent watchlist (requires authentication)
- **📈 NAV Performance Charts** — Interactive line charts with 1Y / 3Y / 5Y / All range toggles
- **🔐 Authentication** — Secure user authentication via Clerk
- **⚡ Caching** — Backend caches fund data for 1 hour to be kind to the free API
- **🎨 Premium UI** — Dark theme with glassmorphism, gradient accents, and smooth animations

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | Clerk |
| **API** | MFapi.in (free, public) |
| **Styling** | Vanilla CSS (custom design system) |

## 📦 Setup & Run Locally

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Clerk account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/aureva-fund-insight-tracker.git
cd aureva-fund-insight-tracker
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your values
```

**Required environment variables (server/.env):**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `CLERK_SECRET_KEY` | Clerk secret key (from Clerk Dashboard) |
| `FRONTEND_URL` | Frontend URL for CORS (default: http://localhost:5173) |

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your values
```

**Required environment variables (client/.env):**

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from Clerk Dashboard) |
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) |

```bash
npm run dev
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173)

## 📡 API Endpoints

### Funds (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/funds/search?q=<query>` | Search mutual fund schemes |
| GET | `/api/funds/:schemeCode` | Get fund detail with historical NAV |

### Watchlist (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist` | Add scheme to watchlist |
| DELETE | `/api/watchlist/:schemeCode` | Remove scheme from watchlist |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🏗 Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Render, Railway, or Fly.io
- **Database**: MongoDB Atlas (free tier)

### Deployment Checklist
- [ ] Set environment variables on hosting platforms
- [ ] Configure CORS on backend to allow deployed frontend origin
- [ ] Update `VITE_API_URL` to point to deployed backend
- [ ] Verify end-to-end flow: search → add → view chart

## 🤔 Assumptions & Decisions

- **Clerk for Auth**: Using Clerk instead of custom JWT for robust, production-ready authentication with minimal code.
- **NAV Caching**: Backend caches MFapi.in responses for 1 hour using `node-cache` (in-memory) to reduce API load.
- **Date Parsing**: MFapi.in returns dates in `dd-mm-yyyy` format and data sorted newest-first. The app parses and sorts defensively.
- **Search Limit**: Search results are capped at 50 items in the UI for performance.

## ⚠️ Known Limitations

- In-memory cache is lost on server restart (upgrade to Redis for production).
- MFapi.in is a free API with no SLA — occasional timeouts may occur.
- No pagination on search results or watchlist.
- ISIN fields may be empty for some schemes.

## 📄 License

MIT
