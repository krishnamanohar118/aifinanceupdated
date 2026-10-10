# AI Finance Tracker

A full-stack personal finance application for recording income and expenses, understanding financial behavior, planning budgets and goals, and receiving data-aware AI guidance.

## Features

- JWT authentication with bcrypt password hashing and persistent sessions
- User-owned income and expense transactions with search, filters, editing and deletion
- Live dashboard, income/expense totals, savings rate, recent activity and derived insight
- Recharts analytics for categories, trends and monthly income versus spending
- Category budgets with calculated usage and warnings
- Savings goals with progress, remaining amount and required monthly savings
- Backend-only AI Finance Assistant with stored, private chat history
- Notifications, yearly report generation, CSV export, printable PDF export, profile settings and dark mode

## Architecture

`client/` is a React/Vite app. `server/` is an Express REST API. MongoDB stores every user-owned record. The frontend sends a JWT bearer token; backend middleware resolves the authenticated user and scopes every financial query to that user.

## Setup

1. Copy `.env.example` to `.env` in the project root.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string and set a long random `JWT_SECRET`.
3. Optionally set `AI_API_KEY` and `AI_MODEL` (default: `gpt-4o-mini`) to enable hosted AI replies. Without an AI key, the chat transparently reports the recorded financial context but does not call an AI provider.
4. Run `npm install` inside both `client` and `server`.
5. Start the server with `npm run dev` from `server`, and client with `npm run dev` from `client`.

The client runs at `http://localhost:5173`; API health is `http://localhost:5000/api/health`.

## MongoDB Atlas

Create a free cluster, create a database user, allow your development IP address, choose **Connect → Drivers**, then copy its connection string into `MONGODB_URI`. Replace the password placeholder with the database user password. Do not commit `.env`.

## API overview

`/api/auth`, `/api/transactions`, `/api/dashboard`, `/api/analytics`, `/api/budgets`, `/api/goals`, `/api/chat`, `/api/notifications`, `/api/reports`, and `/api/profile` implement the corresponding application modules. Except register/login/health, routes require `Authorization: Bearer <token>`.

## Testing and builds

`npm run build` from `client` creates the production frontend build. Backend JavaScript can be syntax-checked with `node --check server.js`. Use a configured MongoDB database for functional API testing.

## Common errors

- **MongoDB is not configured:** add `MONGODB_URI` to root `.env` and restart the backend.
- **Invalid or expired session:** log in again; the client removes expired tokens automatically.
- **AI API is not configured:** add `AI_API_KEY`; no key is ever sent to the browser.
