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
