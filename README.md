# 🌊 AIVI — AI-Based Disaster Alert System

> **AI-powered real-time disaster monitoring and alert platform for World**

<div align="center">

[![Demo Video](https://img.shields.io/badge/▶%20Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/JUuU7xyBHIc?si=Ds-eG3Qrve3NYVVf)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages & Components](#-pages--components)
- [State Management](#-state-management)
- [Mock Data & Prototype Notes](#-mock-data--prototype-notes)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🌐 Overview

**AIVI** (AI-Based Disaster Alert System) is a frontend prototype for a real-time disaster monitoring and alert platform focused on Indonesia. The system leverages AI-generated recommendations and location-based alerting to help citizens stay informed and respond effectively during natural disasters.

Users can register with their location (country, province, district), and the system will automatically determine their **impact level** (Direct, Nearby, or Informational) for any active disaster. Alerts are tiered accordingly — from a full-screen critical modal to a dismissible banner to a subtle info toast.

> ⚠️ **Prototype Notice:** This is a frontend-only prototype. The backend API and WebSocket server are not yet implemented. All data is served through mock services, and authentication is handled client-side via `mockAuth.js`.

---

## ✨ Features

### 🔔 Tiered Alert System
- **DIRECT (Critical)** — Full-screen blocking modal with evacuation instructions, emergency contacts, and forced acknowledgment
- **NEARBY (Warning)** — Dismissible top banner warning for users in surrounding areas
- **NONE (Info)** — Non-intrusive toast notification for general awareness

### 🗺️ Interactive Disaster Map
- Dark-themed map powered by **Leaflet** with polygon overlays per disaster
- Severity-based color coding (Critical → Red, High → Orange, Medium → Yellow, Low → Green)
- Click-to-focus with fly-to animation
- Responsive mobile bottom drawer with drag-to-resize

### 🤖 AI Recommendation Panel
- Per-disaster AI-generated situational guidance
- Only shown to authenticated users affected by a disaster
- Skeleton loading state with a contextual disclaimer

### 👤 User Authentication
- Register with cascading location selection (Country → Province → District)
- Supports Indonesia (all provinces) and Singapore (no province layer)
- Persistent session via Zustand + localStorage

### 📋 Disaster Feed
- Filterable and searchable disaster list
- Filters: type, province, status
- Auto-refresh every 30 seconds with toggle
- Compact card view on map sidebar, full card on list page

### 📡 Real-time Ready
- WebSocket integration via `socket.io-client` (connects when backend is available)
- `useRealtimeDisasters` hook handles live updates and toast notifications for new critical events
- Falls back gracefully when WebSocket is unavailable

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State Management | Zustand (with persist middleware) |
| Forms & Validation | React Hook Form + Zod |
| Map | React Leaflet + Leaflet.js |
| HTTP Client | Axios |
| WebSocket | Socket.IO Client |
| Notifications | React Hot Toast |
| Icons | Inline SVG |

---

## 📁 Project Structure

```
└── 📁src
    └── 📁components
        └── 📁alerts
            └── AlertManager.jsx        # CriticalAlertModal, NearbyWarningBanner, InfoAlertStrip
        └── 📁layout
            ├── Layout.jsx              # Root layout with Navbar and Toaster
            └── Navbar.jsx              # Responsive navbar with alert badge
        └── 📁map
            └── DisasterMap.jsx         # Leaflet map with polygon overlays
        └── 📁ui
            ├── AIRecommendationPanel.jsx  # AI recommendation card (auth-gated)
            └── DisasterCard.jsx           # Disaster summary card (compact + full)
    └── 📁hooks
        └── useRealtimeDisasters.js     # WebSocket connection and live update hook
    └── 📁pages
        ├── AlertsPage.jsx              # User-specific alerts dashboard
        ├── DisasterDetailPage.jsx      # Full disaster detail with map and AI panel
        ├── DisastersPage.jsx           # Searchable/filterable disaster list
        ├── HomePage.jsx                # Landing page with stats and recent disasters
        ├── LoginPage.jsx               # Login form with validation
        ├── MapPage.jsx                 # Full-screen map with sidebar/drawer
        └── RegisterPage.jsx            # Registration with cascading region selector
    └── 📁services
        ├── api.js                      # Axios instance + service modules (auth, disasters, AI)
        ├── mockAuth.js                 # Mock auth/disaster/AI services for prototype
        └── socket.js                   # Socket.IO client singleton
    └── 📁store
        ├── authStore.js                # Auth state (user, token, login/logout actions)
        └── disasterStore.js            # Disaster list, user alerts, filters, polling
    └── 📁utils
        ├── helpers.js                  # Severity/type/status config, formatters
        └── regionData.js               # Static country, province, and district data
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aivi-disaster-alert.git
cd aivi-disaster-alert

# 2. Install dependencies
npm install

# 3. Copy the environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo Credentials (Mock Mode)

Since the backend is not yet available, use these credentials to log in:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@aivi.id` | `admin123` |
| User | `user@aivi.id` | `user123` |

> You can also register a new account — it will be stored in memory for the current session.

---

## 📄 Pages & Components

### Pages

| Page | Route | Auth Required | Description |
|---|---|---|---|
| Home | `/` | No | Landing page with stats, recent disasters, and system status |
| Disasters | `/disasters` | No | Full filterable list of all reported disasters |
| Map | `/map` | No | Interactive map with sidebar (desktop) and drawer (mobile) |
| Disaster Detail | `/disasters/:id` | No | Full disaster detail, map, AI panel, emergency contacts |
| Alerts | `/alerts` | ✅ Yes | Personalized alert dashboard sorted by impact level |
| Login | `/login` | No | Email/password login |
| Register | `/register` | No | Registration with cascading country → province → district |

### Key Components

#### `AlertManager`
Renders the appropriate alert UI based on a user's impact level:
- `CriticalAlertModal` — blocks interaction until the user explicitly acknowledges
- `NearbyWarningBanner` — slides in from the top, dismissible
- `InfoAlertStrip` — bottom-left floating card for passive awareness

#### `DisasterMap`
Renders disaster-affected areas as Leaflet polygons with:
- Severity-based fill color
- Active/resolved visual distinction (dashed border for resolved)
- Hover highlight effect
- Auth-gated popup content

#### `AIRecommendationPanel`
Shows AI-generated recommendations for users in the DIRECT or NEARBY impact zone. Displays a skeleton loader while fetching, and includes a disclaimer noting the AI nature of the content.

#### `DisasterCard`
Two display modes: `compact` (used in map sidebar) and full (used in list and home page). Full mode links to the disaster detail page.

---

## 🗂️ State Management

The app uses **Zustand** for global state across two stores:

### `authStore`
Handles authentication lifecycle with `persist` middleware to survive page refreshes.

```js
{ user, token, isAuthenticated, isLoading, error }
// Actions: login, register, logout, refreshUser, clearError
```

### `disasterStore`
Manages the disaster feed, user alerts, and active filters.

```js
{ disasters, userAlerts, filters, isLoading, lastUpdated }
// Actions: fetchDisasters, fetchUserAlerts, setFilter, resetFilters, addOrUpdateDisaster
```

---

## 🧪 Mock Data & Prototype Notes

The prototype runs entirely without a backend. Here's how each layer is mocked:

| Layer | Implementation |
|---|---|
| Authentication | `mockAuth.js` — in-memory user store with simulated delays |
| Disaster data | `MOCK_DISASTERS` array in `disasterStore.js` |
| Alert data | `MOCK_ALERTS` array in `AlertsPage.jsx` |
| AI recommendations | `mockAiService` in `mockAuth.js` — returns hardcoded guidance |
| Region data | Static JSON in `utils/regionData.js` |
| WebSocket | Disabled in mock mode; hook is wired but socket won't connect |

To switch to real backend services, set `USE_MOCK = false` in `authStore.js` and ensure the API and WebSocket URLs are configured in `.env`.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# API base URL (backend REST API)
VITE_API_URL=http://localhost:8000/api/v1

# WebSocket server URL
VITE_WS_URL=http://localhost:8000

# Set to "true" to force mock API mode
VITE_MOCK_API=false
```

---

## 🛣️ Roadmap

- [ ] Backend API (Node.js/Express or Laravel)
- [ ] Real-time WebSocket integration (Socket.IO server)
- [ ] Push notifications (PWA / FCM)
- [ ] Admin dashboard for disaster management
- [ ] BMKG & BNPB data integration
- [ ] SMS alert fallback for low-connectivity areas
- [ ] Multi-language support (Indonesian / English)
- [ ] Offline mode with service workers

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature description"

# Push to the branch
git push origin feature/your-feature-name

# Open a Pull Request
```

Please follow the existing code style and component patterns when contributing.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for disaster preparedness in Indonesia</sub>
</div>