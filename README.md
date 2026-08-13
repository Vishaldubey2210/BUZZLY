# 🐝 BUZZLY - Real-Time Social & Community Ecosystem

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://buzzly-1-un7t.onrender.com/login)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **BUZZLY** is a full-stack, real-time social networking and community interaction platform built for seamless digital connection, local exploration, live video hangouts, mentorship matching, event management, and gamified social discovery.

---

## 📌 Table of Contents

- [🚀 Live Demo \& Test Credentials](#-live-demo--test-credentials)
- [✨ Key Platform Features](#-key-platform-features)
  - [📰 Interactive Social Feed \& Posts](#-interactive-social-feed--posts)
  - [💬 Real-Time Direct Messaging](#-real-time-direct-messaging)
  - [🗺️ Interactive Geolocation Map](#️-interactive-geolocation-map)
  - [🎓 Mentorship Hub \& Scheduling](#-mentorship-hub--scheduling)
  - [🎉 Virtual Party Rooms \& Synced Video](#-virtual-party-rooms--synced-video)
  - [📅 Events Management \& Ticketing](#-events-management--ticketing)
  - [📍 Local Venues \& Hotspot Discovery](#-local-venues--hotspot-discovery)
  - [🏆 Gamified Leaderboard \& Reputation](#-gamified-leaderboard--reputation)
  - [👤 Profile \& Social Network Graph](#-profile--social-network-graph)
  - [🔔 Instant Notifications \& Smart Search](#-instant-notifications--smart-search)
- [🛠️ Tech Stack \& System Architecture](#️-tech-stack--system-architecture)
- [📡 REST API Endpoints Overview](#-rest-api-endpoints-overview)
- [🗄️ Database Schemas \& Data Models](#️-database-schemas--data-models)
- [⚙️ Local Installation \& Setup Guide](#️-local-installation--setup-guide)
- [🔐 Security \& Reliability Measures](#-security--reliability-measures)
- [🤝 Contributing \& License](#-contributing--license)

---

## 🚀 Live Demo & Test Credentials

BUZZLY is live and hosted on cloud infrastructure! You can test all features live:

- 🌐 **Live Web Application**: [https://buzzly-1-un7t.onrender.com/login](https://buzzly-1-un7t.onrender.com/login)

### 🔑 Pre-Seeded Test Accounts

You can log in directly using any of the following seeded user credentials:

| Account Role | Email Address | Password | Profile Specialty |
| :--- | :--- | :--- | :--- |
| **Primary Admin / User** | `arjun@buzzly.app` | `Buzzly@123` | Craft Beer Enthusiast & Mumbai Local |
| **Sommelier & Mentor** | `priya@buzzly.app` | `Buzzly@123` | Wine Sommelier & Tasting Educator |
| **Whiskey Specialist** | `rohan@buzzly.app` | `Buzzly@123` | Single Malt Collector & Curator |
| **Mixologist** | `ananya@buzzly.app` | `Buzzly@123` | Cocktail Aficionado |
| **Beach Bar Expert** | `dev@buzzly.app` | `Buzzly@123` | Goa Sunset Mixologist (Level 5 Legend) |

> 💡 *Note: You can also register a new account instantly via `/signup` with custom avatar generation powered by DiceBear.*

---

## ✨ Key Platform Features

### 📰 Interactive Social Feed & Posts

The central hub of BUZZLY features a dynamic, multi-tabbed media feed supporting rich content creation and community engagement:

- 📝 **Rich Post Creation**: Share thoughts, attach photos/videos, add venue tags, and set vibe categories (`Lit`, `Chill`, `Classy`, `Wild`, `Cozy`, `Rooftop`).
- 🏷️ **Hashtag Indexing**: Automatic extraction and clickable hashtags for topic aggregation.
- 🗂️ **Feed Categorization**: Filter feed content by **All Posts**, **Following**, **Trending**, or **Media Only**.
- ⚡ **Interactive Engagement**: Like posts, write nested comments, bookmark posts to personal collection, share posts, and report inappropriate content.
- 🎯 **XP Rewards**: Posting content and receiving engagement earns community XP points to level up user badges.

---

### 💬 Real-Time Direct Messaging

BUZZLY features a full-fledged bi-directional chat engine powered by **Socket.io** WebSockets:

- 💬 **Instant 1-on-1 Chat**: Low-latency direct messaging between connected users.
- 🟢 **Live Online/Offline Presence**: See connected status of friends and community members in real-time.
- ✍️ **Typing Indicators**: Visual feedback when the conversation partner is drafting a message.
- 📦 **Conversation Management**: Search chat history, view recent conversation lists with timestamping, unread counts, and avatar previews.
- 🔒 **Secure Transport**: Encrypted WebSockets connection with JWT authentication handshake.

---

### 🗺️ Interactive Geolocation Map

Explore the physical world around you with BUZZLY's interactive map interface powered by **Leaflet** & **OpenStreetMap**:

- 📍 **Real-Time Geolocation Radar**: Discover active community members, nearby hotspots, events, and venues within your city or customizable search radius.
- 🗺️ **Custom Map Pins & Popups**: Distinct visual markers for users, breweries, rooftop lounges, and live events.
- 🔍 **Radius & Filter Controls**: Filter map pins by distance (1 km to 50 km) and category type (Beer, Wine, Spirits, Cocktails, Non-Alcoholic).
- 📍 **Location Permission Prompt**: Graceful geolocation access request with fallback default cities (Mumbai, Bengaluru, Delhi, Goa).

---

### 🎓 Mentorship Hub & Scheduling

BUZZLY connects community members with verified mentors for skill sharing, career advice, mixology guidance, and industry insights:

- 🧑‍🏫 **Mentor Directory**: Browse top-rated mentors filtered by expertise (Wine Sommelier, Craft Brewing, Mixology, Career Guidance).
- 📅 **Session Booking**: Select interactive time slots, specify session topic, and submit session booking requests.
- 💼 **Mentor Journey Profile**: Highlight experience timeline, current role, previous positions, hourly rate, and client reviews.
- ⚡ **Become a Mentor**: Any user can apply to become a mentor, set custom rates, and open booking slots.

---

### 🎉 Virtual Party Rooms & Synced Video

Experience remote group hangouts with interactive virtual party rooms (`/party`):

- 📺 **Synchronized Video Player**: Embedded YouTube player synchronized across all room participants via WebSockets.
- 💬 **Live Room Chat**: Dedicated group chat for party attendees with real-time text, reactions, and emoji support.
- 🎙️ **Host Control Panel**: Room creator privileges to change video playback URL, play/pause state, kick members, and manage room settings.
- 🔒 **Public & Private Rooms**: Create public community rooms or password-protected private party lounges.

---

### 📅 Events Management & Ticketing

Discover and host local or virtual community events (`/events`):

- 🎟️ **Event Creation**: Host beer festivals, wine tastings, masterclasses, and music nights with date, location, category, banner image, and ticket capacity.
- 🎯 **Category Filtering**: Instant filter tags for Craft Beer, Fine Wine, Spirits, Mixology, and Sober Social events.
- ✋ **RSVP & Attendance**: One-click RSVP system tracking attendee avatars, guest lists, and event reminders.

---

### 📍 Local Venues & Hotspot Discovery

Find top-rated local establishments, rooftop bars, microbreweries, and quiet co-working spaces (`/venues`):

- 🏙️ **City Hotspots**: Curated listing of venues in Mumbai, Bengaluru, Delhi, Goa, Hyderabad, Kolkata, and Chennai.
- ⭐ **Ratings & Amenities**: Detailed profiles showcasing operational hours, price range (`₹₹` to `₹₹₹₹`), specialties, verified tags, and guest ratings.
- 🗺️ **Integrated Navigation**: Instant map directions and community post links for each venue.

---

### 🏆 Gamified Leaderboard & Reputation

BUZZLY incorporates gamification to recognize top contributors and active community leaders (`/leaderboard`):

- 📈 **XP & Progression System**: Earn Experience Points (XP) through posts, event attendance, and mentorship.
- 🥇 **Tiered Rankings**: Top users leaderboard broken down by **Global Top Members**, **Weekly Rising Stars**, and **Top Mentors**.
- 🏅 **Achievement Badges**: Unlock custom profile badges such as `First Pour 🍺`, `Rising Star ⭐`, `Buzz Starter 🌟`, and `Buzz Legend 👑`.

---

### 👤 Profile & Social Network Graph

Customizable user identity and social networking primitives (`/profile` & `/profile/:userId`):

- 🎨 **Rich Profile Customization**: Update bio, avatar, background banner, city, headline, preferences, and social links.
- 🤝 **Connection Network**: Send connection requests ("Pour Requests"), build mutual connections, and follow creators.
- 📁 **Personal Repository**: Dedicated profile tabs for **User Posts**, **Saved Bookmarks**, **Attending Events**, and **Media Gallery**.

---

### 🔔 Instant Notifications & Smart Search

Stay up to date with ecosystem activities:

- 🔔 **Activity Center**: Notifications for post likes, comments, connection requests, event updates, and mention alerts.
- 🔍 **Global Multi-Entity Search**: Fast unified search engine across Users, Posts, Events, Venues, and Hashtags (`/search`).

---

## 🛠️ Tech Stack & System Architecture

BUZZLY is designed with a modern decoupled architecture ensuring high scalability, rapid rendering, real-time sync, and security:

```
                  ┌────────────────────────────────────────┐
                  │             Client Layer               │
                  │   React 18 + TypeScript + Vite         │
                  │   Tailwind CSS + Leaflet + Lucide      │
                  └───────────────────┬────────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │  HTTPS REST / WSS Sockets│
                         └────────────┬────────────┘
                                      │
                  ┌───────────────────▼────────────────────┐
                  │            Backend Layer               │
                  │   Node.js + Express.js API           │
                  │   Socket.io + JWT Auth + Helmet        │
                  └───────────────────┬────────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │    Database Layer       │
                         │    MongoDB + Mongoose   │
                         └─────────────────────────┘
```

### 💻 Technology Breakdown

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 & TypeScript** | Component-driven frontend with strong type safety and modern hooks |
| **Styling & Icons** | **Tailwind CSS & Lucide React** | Sleek dark-mode aesthetic, responsive layouts, and modern icons |
| **Maps & Analytics** | **Leaflet, React-Leaflet & Recharts** | Interactive OpenStreetMap integration and analytics visualizer |
| **Real-time Comms** | **Socket.io & Socket.io-Client** | Event-driven WebSockets transport for chat, presence & sync video |
| **Backend Runtime** | **Node.js & Express.js** | Modular RESTful API server with middleware architecture |
| **Database & ORM** | **MongoDB & Mongoose ODM** | Scalable NoSQL document database with schema validation |
| **Security & Auth** | **JWT, BcryptJS, Helmet & Rate Limiter** | Token auth, HttpOnly cookies, HTTP security headers & rate limiting |

---

## 📡 REST API Endpoints Overview

The backend exposes a structured API under the `/api/v1` namespace:

| Module | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/signup` | Register new user account | ❌ No |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT | ❌ No |
| **Auth** | `GET` | `/api/v1/auth/me` | Retrieve current authenticated user | ✅ Yes |
| **Users** | `GET` | `/api/v1/users` | List users / search by filters | ✅ Yes |
| **Users** | `GET` | `/api/v1/users/:id` | Get public user profile | ✅ Yes |
| **Posts** | `GET` | `/api/v1/posts` | Fetch paginated feed posts | ✅ Yes |
| **Posts** | `POST` | `/api/v1/posts` | Create new post | ✅ Yes |
| **Posts** | `POST` | `/api/v1/posts/:id/like` | Like/Unlike post | ✅ Yes |
| **Messages**| `GET` | `/api/v1/messages/conversations` | Get active user chat list | ✅ Yes |
| **Events** | `GET` | `/api/v1/events` | List upcoming events | ✅ Yes |
| **Venues** | `GET` | `/api/v1/venues` | Search local venues | ✅ Yes |
| **Mentors** | `GET` | `/api/v1/mentors` | List available mentors | ✅ Yes |
| **Rooms** | `GET` | `/api/v1/rooms` | List active virtual party rooms | ✅ Yes |

---

## 🗄️ Database Schemas & Data Models

BUZZLY uses MongoDB with Mongoose ODM schemas for flexible document management:

- 👤 **User**: Credentials, profiles, XP, level, badges array, drink journey history, followers/following refs.
- 📝 **Post**: Author reference, content, media attachments, drink category, vibe tag, likes array, hashtag index, comment count.
- 💬 **Conversation & Message**: Participants array, last message ref, message sender, text content, read receipts.
- 🎓 **MentorProfile & Session**: User ref, expertise tags, hourly rate, bio, availability slots, session status (`pending`, `confirmed`, `completed`).
- 🎉 **Room**: Name, host ref, YouTube video URL, playback state, participant list, public/private access mode.
- 📍 **Venue**: 2D Geospatial GeoJSON point coordinates (`Point`), amenities, ratings, pricing, operational hours.
- 📅 **Event**: Host ref, category, date, venue details, capacity limit, attendee IDs array.

---

## ⚙️ Local Installation & Setup Guide

### 📋 Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas Connection URI)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vishaldubey2210/BUZZLY.git
cd BUZZLY
```

---

### 2️⃣ Backend Setup & Database Seeding

Navigate to the `backend` directory, install dependencies, configure environment variables, and seed test data:

```bash
cd backend
npm install

# Create environment configuration
cp .env.example .env
```

Edit your `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/buzzly
JWT_SECRET=your_super_secret_jwt_key_buzzly_2026
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

Run database seeder to populate sample users, posts, venues, and events:
```bash
npm run seed
```

Start the backend dev server:
```bash
npm run dev
```
*The backend API will run at `http://localhost:5000`.*

---

### 3️⃣ Frontend Setup & Execution

Open a new terminal window, navigate to `frontend`, install dependencies, and start Vite dev server:

```bash
cd frontend
npm install

# Create environment configuration
cp .env.example .env
```

Edit your `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Start Vite dev server:
```bash
npm run dev
```
*The web app will open at `http://localhost:5173`.*

---
