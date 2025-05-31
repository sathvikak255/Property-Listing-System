# 🏠 Property Listing System

The Property Listing System is a full-featured backend service built to manage real estate listings and user interactions in a scalable and secure way. It allows users to register and log in, post property listings, and search through real estate data using detailed filters like location, price, size, and amenities.

Users can also save their favorite properties, recommend listings to other registered users, and benefit from faster performance via Redis caching. The system is designed for modern web and mobile applications that require a fast, RESTful backend with user-centric features.

Built using Node.js and TypeScript, this backend system leverages MongoDB for storage, Redis for caching, and is structured with modular controllers and routes for scalability and maintainability.

Whether you're building a real estate platform, a rental marketplace, or just learning backend development with real-world use cases — this project is a great starting point.

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

### 📦 Installation
#### 1. Clone the repository:

```bash
git clone https://github.com/sathvikak255/Property-Listing-System.git
cd Property-Listing-System
```
#### 2. Install dependencies:

```bash
npm install -r requirements.txt
```

#### 3. Set up environment variables:

Create a .env file in the root directory and add the following:

```.env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
```

#### 4. Import CSV Data into MongoDB

Use a CSV parser or script to import your dataset into MongoDB. You can either write a custom import script using csv-parser or use an existing command-line tool. Ensure the schema matches your Property model.

Example (Node-based custom script):

```bash
ts-node src/utils/seed.ts
```

#### 5. Start Development Server

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
│   └── seed.js
└── index.js
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

**Login Example**
```json
{
  "email": "alice@example.com",
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
GET /properties?rating=4-4.5&location=Chennai
```
For posting a property into the website

The body which consists of the details about the property for uploading a property into the database using the `POST` for the `/properties` Endpoint. 
```json
        "title": "Green sea.",
        "type": "Bungalow",
        "price": 23825834,
        "state": "Tamil Nadu",
        "city": "Coimbatore",
        "areaSqFt": 4102,
        "bedrooms": 5,
        "bathrooms": 2,
        "amenities": [
            "lift",
            "clubhouse",
            "security",
            "gym",
            "garden",
            "pool"
        ],
        "availableFrom": "2025-10-14T00:00:00.000Z",
        "tags": [
            "gated-community",
            "corner-plot"
        ],
        "colorTheme": "#6ab45e",
        "rating": 4.7,
        "isVerified": false,
        "listingType": "rent",
        "createdBy": "683b3fcc345667d885ed5653",
        "__v": 0,
        "createdAt": "2025-05-31T17:43:41.790Z",
        "updatedAt": "2025-05-31T17:43:41.790Z"
    },
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
  "propId": "64e6a48c1a23aa5a..."
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
  "to": "jane@example.com",
  "property": "64e6a48c1a23aa5a..."
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
