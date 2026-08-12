# 🍽️ Godavari Vindu — Luxury Restaurant Platform

[![Django](https://img.shields.io/badge/Django-4.2-green?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

A production-ready, ultra-luxury restaurant web application featuring a cinematic React 19 frontend with smooth Lenis scrolling, Framer Motion/GSAP animations, and a robust Django 4.2 REST Framework backend with JWT Authentication, Google OAuth2, Razorpay payment gateway integration, and real-time table reservations.

---

## ✨ Features

- **🎨 Luxury Aesthetic & Cinematic UI**: Elegant dark-themed visual design with gold accents (`#D4AF37`), sleek typography, Framer Motion micro-interactions, Lenis smooth scrolling, and custom SVG visual components.
- **🍱 Dynamic Menu & Portion Selector**: Filter menu items by category (Starters, Biryanis, Curries, Desserts, Beverages), search items, toggle between **Half** and **Full** portion pricing, with skeleton loading states.
- **🔐 Dual Authentication System**:
  - **JWT Authentication**: Powered by `djangorestframework-simplejwt` with automatic token refresh via Axios interceptors.
  - **Google OAuth2 Integration**: Seamless one-click social login with Google OAuth.
  - **Guest Protection Gate**: Prompts unauthenticated users with a login/register modal before adding items to cart or placing orders.
- **🛒 Smart Cart & Order Management**: Side-drawer cart with item quantity adjustments, portion selection tags, delivery detail forms, and instant total/tax calculations.
- **💳 Multi-Gateway Payment Integration**:
  - **Razorpay Checkout**: Seamless payment order creation and HMAC-SHA256 signature verification on backend.
  - **Custom Vector Brand SVGs**: Official vector badges in checkout for **Google Pay**, **PhonePe**, **Paytm**, **UPI**, and **Cards**.
  - **Stripe SDK**: Built-in support for Stripe card payment processing.
- **📅 Table Reservation Engine**: Online table booking system with date, time, guest count selection, and instant database submission.
- **💬 Direct WhatsApp Ordering**: Floating action button enabling instant WhatsApp chat and order inquiries with pre-formatted message details.
- **📱 Fully Responsive Design**: Flawlessly optimized across mobile devices, tablets, and wide desktop screens.

---

## 📁 Project Structure

```
Luxury restaurant website/
├── frontend/                  # React 19 + Vite 8 application
│   ├── src/
│   │   ├── components/        # UI components (Navbar, Hero, Menu, Cart, Chef, Gallery, Reservation, etc.)
│   │   ├── context/           # React Context state (CartContext, AuthContext)
│   │   ├── pages/             # Page views (Home, LoginPage, RegisterPage, Success, Cancel)
│   │   ├── services/          # API services (Axios client with JWT interceptors)
│   │   └── assets/            # Static images & graphics
│   ├── public/                # Public assets & site images
│   ├── .env                   # Frontend environment configuration
│   ├── package.json           # Frontend dependencies & scripts
│   └── vite.config.js         # Vite configuration & dev server proxy
│
├── backend/                   # Django 4.2 REST Framework API server
│   ├── godavari_vindu/        # Project settings & root URL router
│   ├── users/                 # Auth app (Custom User model, JWT & Google OAuth)
│   ├── menu/                  # Menu app (Categories & MenuItems with half/full portion options)
│   ├── reservations/          # Table Reservations & Razorpay Orders app
│   ├── reviews/               # Testimonials & Reviews app
│   ├── media/                 # Uploaded media assets (menu items, avatars)
│   ├── staticfiles/           # Collected static files (WhiteNoise)
│   ├── initial_data.json      # Initial seed data for menu items & categories
│   ├── manage.py              # Django CLI utility
│   └── requirements.txt       # Python dependencies
│
├── .gitignore                 # Root Git ignore rules
├── package.json               # Root scripts (Concurrent frontend & backend execution)
└── README.md                  # Project documentation
```

---

## ⚙️ Environment Configuration

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:8000/api

# Google OAuth2 Client ID (must match backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# WhatsApp Contact Number (with country code)
VITE_WHATSAPP_NUMBER=+919963278455
```

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory:

```env
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173

# Razorpay API Credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Stripe API Credentials
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth2 Credentials
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Python 3.10+** (with virtual environment created in `backend/venv/`)

### 1. Install All Dependencies

Run from the **project root**:

```powershell
npm run install:all
```

### 2. Run Both Frontend & Backend Concurrently

From the **project root** directory:

```powershell
npm run dev
```

This starts both development servers concurrently:

| Service | Local URL | Description |
|---|---|---|
| **Frontend App** | [http://localhost:5173](http://localhost:5173) | React 19 + Vite SPA |
| **Backend REST API** | [http://localhost:8000/api](http://localhost:8000/api) | Django REST Framework API |
| **Django Admin** | [http://localhost:8000/admin](http://localhost:8000/admin) | Admin Control Panel |

---

## 🔧 Manual Setup (Individual Services)

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

### Backend Setup

From the `backend/` directory:

```powershell
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Run migrations & seed initial menu data
python manage.py migrate
python manage.py loaddata initial_data.json

# Create Django Admin superuser
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

---

## 🔐 Authentication & User System

- **Custom User Model**: `users.User` extending Django's `AbstractUser`.
- **JWT Auth**: Uses `djangorestframework-simplejwt`. Access tokens are included in `Authorization: Bearer <token>` headers; refresh tokens maintain seamless sessions.
- **Google OAuth2**: Token verification endpoint (`/api/auth/google/`) retrieves profile info and auto-provisions or authenticates customer accounts.
- **Guest Gate**: Unauthenticated users trying to add items or access checkout trigger a branded authentication modal.

---

## 💳 Payment Verification & Brand Badges

### Razorpay Payment Flow
1. Customer reviews cart and submits order details in `Cart.jsx`.
2. Frontend sends request to `/api/reservations/create-razorpay-order/`.
3. Backend creates a pending `Order` record and requests a Razorpay Order ID from Razorpay API.
4. Frontend opens the official Razorpay Checkout SDK modal.
5. Upon successful payment, frontend posts payload to `/api/reservations/verify-razorpay-payment/`.
6. Backend computes and validates the `HMAC-SHA256` signature using `RAZORPAY_KEY_SECRET`.
7. Order status updates to `paid` and user receives order confirmation.

### Vector SVGs & Payment Methods
Includes custom SVG logos in `Cart.jsx`:
- **Google Pay**: Official 4-color ribbon logo (`#1A73E8`, `#34A853`, `#EA4335`, `#FBBC04`).
- **PhonePe**: Devanagari "पे" symbol on `#5F259F` purple circular badge.
- **Paytm**: `#002970` Navy `pay` + `#00BAF2` Cyan `tm` wordmark.
- **UPI**: Official NPCI UPI logo with tri-color accents.
- **Credit / Debit Cards**: Visa, Mastercard, and RuPay vector badges.

---

## 📡 API Reference

Base URL: `http://localhost:8000/api`

### 🔑 Authentication (`/api/auth/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register/` | Register a new customer account | No |
| `POST` | `/auth/login/` | Obtain JWT access & refresh tokens | No |
| `POST` | `/auth/token/refresh/` | Refresh expired access token | No |
| `POST` | `/auth/google/` | Authenticate using Google OAuth token | No |
| `GET` | `/auth/profile/` | Get current logged-in user profile | Yes (JWT) |

### 🍱 Menu (`/api/menu/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/menu/categories/` | List all menu categories | No |
| `GET` | `/menu/items/` | List all menu items (includes half/full pricing) | No |
| `GET` | `/menu/items/?category=<slug>` | Filter items by category slug | No |
| `GET` | `/menu/site-assets/` | List all dynamic site branding assets | No |
| `GET` | `/menu/gallery/` | List active luxury gallery images | No |

### 🛒 Reservations & Orders (`/api/reservations/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/reservations/submit/` | Submit a table reservation request | No |
| `GET` | `/reservations/booking-list/` | List all table bookings (Admin control) | Admin |
| `POST` | `/reservations/create-razorpay-order/` | Initialize a Razorpay payment order | Yes (JWT) |
| `POST` | `/reservations/verify-razorpay-payment/` | Verify Razorpay HMAC signature | Yes (JWT) |
| `GET` | `/reservations/orders/` | List current customer's orders | Yes (JWT) |
| `POST` | `/reservations/create-checkout-session/` | Initialize a Stripe Checkout session | Yes (JWT) |
| `POST` | `/reservations/webhook/` | Stripe payment webhook listener | No (Stripe Signature) |

### ⭐️ Reviews (`/api/reviews/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/reviews/testimonials/` | List customer testimonials | No |
| `POST` | `/reviews/testimonials/` | Submit a new customer review | Yes (JWT) |

---


## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 & Vite 8
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP & Lenis smooth scroll
- **HTTP Client**: Axios (with automatic Bearer token interceptors)
- **Icons**: Lucide React & Custom Inline Vector SVGs
- **Routing**: React Router DOM 7

### Backend
- **Framework**: Django 4.2 LTS & Django REST Framework (DRF)
- **Authentication**: SimpleJWT & Google Auth Library
- **Database**: SQLite (Development) / PostgreSQL (Production via `dj-database-url`)
- **Payments**: Razorpay Python SDK & Stripe SDK
- **Static Assets**: WhiteNoise & Pillow
- **WSGI Server**: Gunicorn

---

## 📜 License

Copyright © 2026 Sandeep Yallamilli / Godavari Vindu Restaurant. Released under the [MIT License](LICENSE).
