# Lumino

A full-stack web application for browsing and booking tickets for movies and events.

## Tech Stack

**Frontend**
- React 19
- React Router DOM
- Vite

**Backend**
- Node.js
- Express
- MySQL2
- bcryptjs
- dotenv

## Project Structure

```
lumino/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx / .css
│   │   ├── AuthPage.jsx / .css
│   │   ├── Dashboard.jsx / .css
│   │   ├── MovieDetail.jsx / .css
│   │   ├── EventDetail.jsx / .css
│   │   ├── CategoryPage.jsx / .css
│   │   ├── BookTickets.jsx / .css
│   │   ├── EventTickets.jsx / .css
│   │   └── PaymentSuccess.jsx / .css
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── server.js
│   ├── db.js
│   └── .env
├── public/
└── index.html
```

## Pages & Routes

| Route | Component |
|---|---|
| `/` | Landing Page |
| `/auth` | Login / Signup |
| `/dashboard` | Dashboard |
| `/movie/:id` | Movie Detail |
| `/event/:id` | Event Detail |
| `/category/:slug` | Category Page |
| `/book-tickets` | Book Movie Tickets |
| `/book-event-tickets` | Book Event Tickets |
| `/payment-success` | Payment Success |

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

