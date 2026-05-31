# Subscription Management Dashboard

A mini SaaS admin dashboard where users can register, browse subscription plans, subscribe to a plan, view their active subscription, and where admins can review every subscription across the platform.

Built as a clean, modular **MERN** application with JWT access/refresh authentication, role-based access control, and a responsive, themeable UI.

---

## Tech Stack

**Frontend**

- React 18 (Vite)
- Redux Toolkit — global state (auth, plans, subscriptions, theme)
- React Router v6 — routing + role-based route guards
- Axios — with interceptor-based silent token refresh
- Plain CSS — global design tokens + CSS Modules (no UI framework)

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT access tokens + refresh tokens (httpOnly cookie, with rotation)
- Zod — request payload validation
- bcryptjs — password hashing
- helmet, cors, morgan, cookie-parser

---

## Features

### Core

- Email/password registration & login
- JWT **access token** (in memory) + **refresh token** (httpOnly cookie) with rotation
- Silent token refresh via an Axios response interceptor (with a request queue)
- Role-based access control (`admin`, `user`)
- Protected client routes — `/admin/*` restricted to admins
- Browse plans, subscribe, and switch plans
- Subscription status awareness (active / expired / cancelled / none)
- Admin view of all subscriptions with summary stats
- Validation with Zod and centralized, structured API error handling
- Loading, empty, and error states throughout the UI
- Responsive layout (mobile, tablet, laptop, desktop) with a collapsible sidebar

### Bonus features implemented

- **Light/dark theme toggle** — persisted to `localStorage`, respects OS preference
- **Plan upgrade/downgrade** — subscribing to a new plan auto-cancels the previous active one, so a user always has at most one active plan
- **Search & filter** on the admin subscriptions view — search by member name/email, filter by plan and status, and sort by date or price

---

## Project Structure

```
subscription-dashboard-task/
├── client/                      # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── api/                 # Axios client + per-resource API modules
│       ├── app/                 # Redux store
│       ├── components/          # Reusable UI components (+ *.module.css)
│       ├── features/            # Redux slices (auth, plans, subscriptions, theme)
│       ├── hooks/               # useAuth, useTheme
│       ├── pages/               # Login, Register, Plans, Dashboard, Admin, 404
│       ├── styles/              # variables.css, global.css
│       ├── utils/               # error, format, validators, constants
│       ├── App.css              # shared, app-wide component classes
│       ├── App.jsx              # routes + guards + auth bootstrap
│       └── main.jsx             # entry: Provider + Router + global styles
│
└── server/                      # Node.js + Express backend
    └── src/
        ├── config/              # env validation, db connection
        ├── controllers/         # request/response handlers
        ├── middleware/          # auth, role, validation, error handling
        ├── models/              # Mongoose schemas (User, Plan, Subscription)
        ├── routes/              # route definitions
        ├── seed/                # database seeding script
        ├── services/            # business logic
        ├── utils/               # ApiError, ApiResponse, asyncHandler, jwt, logger
        ├── validations/         # Zod schemas
        ├── app.js               # Express app (middleware + routes)
        └── server.js            # bootstrap + graceful shutdown
```

**Architecture note:** the backend follows a layered flow — `routes → middleware → controllers → services → models`. Controllers stay thin and deal only with HTTP; all business logic lives in services; models own persistence.

---

## Prerequisites

- Node.js >= 18
- A running MongoDB instance — local (`mongod`) or a MongoDB Atlas connection string

---

## Getting Started

The project has two parts. Run the **backend** first, then the **frontend** in a separate terminal.

### 1. Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env          # then edit .env (see Environment Variables below)
npm run seed                  # seeds 4 plans + demo admin/user accounts
npm run dev                   # starts on http://localhost:5000
```

> On Windows CMD/PowerShell, use `copy .env.example .env` instead of `cp`.

### 2. Frontend (`/client`)

```bash
cd client
npm install
cp .env.example .env          # default points at the Vite dev proxy
npm run dev                   # starts on http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

### Demo accounts (created by `npm run seed`)

| Role  | Email             | Password  |
| ----- | ----------------- | --------- |
| Admin | admin@example.com | Admin@123 |
| User  | user@example.com  | User@123  |

---

## Environment Variables

### `server/.env`

```ini
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/subscription_dashboard
JWT_ACCESS_SECRET=replace_with_a_strong_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_strong_random_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### `client/.env`

```ini
# Leave as /api to use the Vite dev proxy, or set a full URL in production.
VITE_API_BASE_URL=/api
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

All responses follow a consistent envelope.

**Success**

```json
{ "success": true, "message": "Login successful", "data": {} }
```

**Error**

```json
{ "success": false, "message": "Validation failed", "details": [] }
```

Authenticated requests must send `Authorization: Bearer <accessToken>`. The refresh token is delivered and read via an httpOnly cookie, so refresh requests are made with credentials included.

| Method | Endpoint               | Auth   | Description                               |
| ------ | ---------------------- | ------ | ----------------------------------------- |
| POST   | `/auth/register`       | Public | Register a new user, returns access token |
| POST   | `/auth/login`          | Public | Log in, returns access token              |
| POST   | `/auth/refresh`        | Cookie | Rotate tokens using the refresh cookie    |
| POST   | `/auth/logout`         | User   | Invalidate the refresh token              |
| GET    | `/auth/me`             | User   | Current authenticated user                |
| GET    | `/plans`               | Public | List all plans                            |
| POST   | `/subscribe/:planId`   | User   | Subscribe the user to a plan              |
| GET    | `/my-subscription`     | User   | Get the user's current subscription       |
| GET    | `/admin/subscriptions` | Admin  | List all subscriptions (admin only)       |
| GET    | `/health`              | Public | Health check                              |

### Example requests

**Register**

```http
POST /api/auth/register
Content-Type: application/json

{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "secret123" }
```

**Login**

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "User@123" }
```

**Subscribe**

```http
POST /api/subscribe/<planId>
Authorization: Bearer <accessToken>
```

---

## Data Models

**User** — `name, email, password (hashed), role (admin | user), refreshTokenHash`

**Plan** — `name, price, features[], duration (days)`

**Subscription** — `user (ref), plan (ref), startDate, endDate, status (active | expired | cancelled)`

A subscription's `endDate` is computed at subscribe time as `startDate + plan.duration` days. Subscribing to a new plan cancels any existing active subscription, so a user always has at most one active plan.

---

## Available Scripts

**server**

- `npm run dev` — start with nodemon
- `npm start` — start in production mode
- `npm run seed` — reset and seed plans + demo users

**client**

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

---

## Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Access tokens are short-lived and held only in memory on the client.
- Refresh tokens live in an httpOnly cookie and are stored hashed server-side, enabling logout invalidation and rotation on each refresh.
- All inputs are validated with Zod before reaching the database.

---

## Author

**VIKKARAMAN**

- Email: vallarasu0410@gmail.com
- Phone: 6383797129
- GitHub: https://github.com/vallarasu0419/subscription-dashboard-task

## License

MIT
