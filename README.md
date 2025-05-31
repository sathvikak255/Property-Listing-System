# 🏠 Property Listing System

The **Property Listing System** is a secure, efficient, and feature-rich backend service designed to manage real estate listings and user interactions. Built using **Node.js**, **TypeScript**, **MongoDB**, and **Redis**, it supports full **CRUD operations**, **advanced search filters (including range queries)**, **user authentication**, **favorites management**, and a **recommendation system** between registered users.

This project is ideal for powering a real estate portal, rental platform, or as a learning base for building scalable backend APIs.

---

## 🔧 Features

- ✅ **User Registration & Login** with `name`, `email`, `password`
- 🏘 **Property CRUD** with access control (only creators can edit/delete)
- 🔍 **Advanced Filtering** on **textual and numerical fields** (with ranges)
- ❤️ **Favorite Properties** with full CRUD and filter capabilities
- 📩 **Recommendation System**: recommend a property to **registered users only**
- ⚡️ **Redis Caching** to improve read/write performance
- ☁️ Ready for **deployment** to Render, Vercel, etc.

---

## 📁 Project Setup

### 🛠 Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance
- Redis instance

### 📦 Install Dependencies

```bash
npm install
```

### 🗃 Import CSV Data into MongoDB

Use a CSV parser or script to import your dataset into MongoDB. You can either write a custom import script using csv-parser or use an existing command-line tool. Ensure the schema matches your Property model.

Example (Node-based custom script):

```bash
npm run import:csv
```

### 🚀 Start Development Server

Run the development server using:

```bash
npm run dev
```

Make requests to http://localhost:5000.

---

## 📂 Project Structure

```
├── controllers/
│   ├── authController.js
│   ├── propertyController.js
│   ├── favoriteController.js
│   └── recommendationController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Property.js
│   └── Favorite.js
├── routes/
│   └── index.js
├── utils/
│   └── cache.js
├── app.js
└── server.js
```

---

## 📌 Routes and Usage

### 🔐 Authentication Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register` | POST | Register new user (requires name, email, password) |
| `/login` | POST | Login existing user and receive JWT token |

**Register Example:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
```

All protected routes require this header:

```
Authorization: Bearer <token>
```

### 🏘️ Property Routes

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/properties` | GET | ❌ | List all properties with filters |
| `/properties` | POST | ✅ | Create a property (creator is saved) |
| `/properties/:id` | PUT | ✅ | Update your property only |
| `/properties/:id` | DELETE | ✅ | Delete your property only |

**Filtering Support** (via query parameters):

| Parameter | Example |
|-----------|---------|
| `location` | `?location=Hyderabad` |
| `type` | `?type=apartment` |
| `priceMin` | `?priceMin=50000` |
| `priceMax` | `?priceMax=200000` |
| `areaMin` | `?areaMin=500` |
| `areaMax` | `?areaMax=1500` |
| `bedrooms` | `?bedrooms=3` |
| `bathrooms` | `?bathrooms=2` |
| `available` | `?available=true` |
| `furnished` | `?furnished=false` |

**Example:**

```http
GET /properties?location=Delhi&priceMin=60000&bedrooms=2
```

### ❤️ Favorites Routes

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/favorites` | GET | ✅ | Get all your favorite properties |
| `/favorites` | POST | ✅ | Add a property to your favorites |
| `/favorites/:id` | DELETE | ✅ | Remove a property from your favorites |

**Favorites Filtering:**
All `/properties` filters also apply to `/favorites`.

**Add Favorite Example:**

```json
{
  "propertyId": "64e6a48c1a23aa5a..."
}
```

### 📩 Recommendation Routes

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/recommend` | POST | ✅ | Recommend property to a registered user |
| `/recommendations` | GET | ✅ | View properties recommended to you |
| `/sent-recommendations` | GET | ✅ | View properties you recommended to others |

**Recommend Request Body:**

```json
{
  "recipientEmail": "jane@example.com",
  "propertyId": "64e6a48c1a23aa5a..."
}
```

Recommendations are saved to the receiver's profile in a "Recommendations Received" section.

---

## ⚡ Redis Caching

- Cached endpoints: `/properties`, `/favorites`
- Automatic invalidation on POST, PUT, DELETE
- Helps reduce MongoDB read operations
- Improves performance for frequent searches

---

## ☁️ Deployment

You can deploy this server on:

- Render
- Railway
- Vercel (with adaptation for serverless if needed)

Ensure to configure your `.env` variables in the deployment settings.

---

## 📦 Technologies Used

- Node.js / TypeScript
- MongoDB (Mongoose)
- Redis (node-redis)
- JWT for Authentication
- Express.js
- dotenv, morgan, helmet, cors

---

## 📄 License

MIT © 2025 – [Your Name]
