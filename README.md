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

## 📌 Routes and Usage

### 🔐 Authentication Routes
User authentication is implemented using JWT tokens to ensure secure access to protected endpoints. Users must first register with basic details and then log in to receive a token, which must be included in the header of all authorized requests.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register` | POST | Register new user (requires name, email, password) |
| `/login` | POST | Login existing user and receive JWT token |

⚠️ Include this in headers for all protected routes:
`Authorization: Bearer <your_token_here>`

You can also use the following `curl` commands to do the above activities

**Register Payload:**

```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword"
  }
```

The corresponding `curl` command:

```bash
  curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword"
  }'
```
**Login Payload**
```json
  {
    "email": "alice@example.com",
    "password": "securePassword"
  }
```
The corresponding `curl` command:
```bash
  curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword"
  }'
```

All protected routes require this header:

```
  Authorization: Bearer <token>
```

### 🏘️ Property Routes
These routes allow users to create, view, update, and delete property listings. Only the original creator of a listing can edit or delete it. Filtering capabilities allow users to search based on multiple fields.

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
  GET /properties?location=Delhi&bedrooms=2&rating_gte=4
  GET /properties?rating=4-4.5&location=Chennai
```
**Get the Properties (with filters using `curl` command)**
```bash
  curl "http://localhost:5000/properties?location=Delhi&priceMin=60000&bedrooms=2"
```
### 📤 Create Property Example Payload
When creating a listing, the following format must be used. The body which consists of the details about the property for uploading a property into the database using the `POST` for the `/properties` Endpoint. 
  ```json
        "title": "Green sea.",
        "type": "Bungalow",
        "price": 23825834,
        "state": "Tamil Nadu",
        "city": "Coimbatore",
        "areaSqFt": 4102,
        "bedrooms": 5,
       ...
        "listingType": "rent"
    },
   ```
Using `curl` command
```bash
  curl -X POST http://localhost:5000/properties \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2BHK Apartment in Delhi",
    "location": "Delhi",
    "price": 75000,
    "area": 1000,
    "bedrooms": 2,
    "bathrooms": 2,
    "available": true,
    "furnished": false,
    "type": "apartment"
  }'
```

**Update Property**
```bash
  curl -X PUT http://localhost:5000/properties/<property_id> \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 80000
  }'
```

**Delete Property**
```bash
  curl -X DELETE http://localhost:5000/properties/<property_id> \
  -H "Authorization: Bearer <your_token_here>"
```
---

### ❤️ Favorites Routes
Users can bookmark or "favorite" listings they like. This allows quick access to preferred properties and supports all filter options available in `/properties`.

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/favorites` | GET | ✅ | Get all your favorite properties |
| `/favorites` | POST | ✅ | Add a property to your favorites |
| `/favorites/:id` | DELETE | ✅ | Remove a property from your favorites |


**Add Favorite Example:**

```json
  {
    "propId": "64e6a48c1a23aa5a..."
  }
```
```bash
  curl -X POST http://localhost:5000/favorites \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "<property_id>"
  }'
```

**Favorites Filtering:**
All `/properties` filters also apply to `/favorites`. 
Requires `Authentication: Bearer <token>`

**Get Favorites (with filters)**
```bash
  curl -X GET "http://localhost:5000/favorites?priceMax=100000" \
  -H "Authorization: Bearer <your_token_here>"
```

**Remove Favorite**
```bash
  curl -X DELETE http://localhost:5000/favorites/<favorite_id> \
  -H "Authorization: Bearer <your_token_here>"
```


### 📩 Recommendation Routes
This feature allows users to recommend listings to friends or family who are also registered on the platform. These appear in the "Recommendations Received" section of the receiver’s dashboard. This also allows us to view the recommendations sent as well as received.

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

Note: Only registered users can be sent the recommendations.

```bash
  curl -X POST http://localhost:5000/recommend \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "friend@example.com",
    "propertyId": "<property_id>"
  }'
```

**View Recommendations Received**
Shows the recommendations that are sent by other registered users.
```bash
  curl -X GET http://localhost:5000/recommendations \
  -H "Authorization: Bearer <your_token_here>"
```

**View Sent Recommendations**
Let's the registered user to view the registrations that are sent to other users via their emails.
```bash
  curl -X GET http://localhost:5000/sent-recommendations \
  -H "Authorization: Bearer <your_token_here>"
```

---

## ⚡ Redis Caching

To improve speed and reduce MongoDB load, Redis caching is implemented for high-traffic routes like `/properties` and `/favorites`.
- GET requests are cached for faster repeated access.
- Any change via POST, PUT, or DELETE automatically invalidates and updates the cache.
- Enhances scalability for larger datasets or frequent user queries.

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

