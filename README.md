# mountmagic-api

Production-style REST API for Mount Magic built with Node.js, Express, MongoDB (Mongoose), and JWT auth. Includes auth, user profile management, services, blogs, health checks, and full Jest + Supertest coverage.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt
- Jest + Supertest
- dotenv

## Project Structure
```
index.js               # server entry
src/
	app.js               # express app
	config/db.js         # MongoDB connection
	controllers/         # request handlers
	middlewares/         # auth middleware
	models/              # mongoose schemas
	routes/              # route definitions
	utils/               # helpers (e.g., JWT)
tests/
	setup.js             # test DB setup/teardown
	auth/                # auth route tests
	users/               # user profile tests
	services/            # services tests
	blogs/               # blogs tests
```

## Environment
Create `.env` and `.env.test` (already gitignored) with:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=1h
```

## Install & Run
```
npm install
node index.js              # start server (uses .env)
```

## Testing
Runs against the test database defined in `.env.test`.
```
npm test
```

## API Endpoints
Auth
- POST /api/auth/register
- POST /api/auth/login

Users (JWT required)
- GET /api/users/profile
- PUT /api/users/profile

Services
- GET /api/services
- GET /api/services/:id
- POST /api/services (auth)
- PUT /api/services/:id (auth)
- DELETE /api/services/:id (auth)

Blogs
- GET /api/blogs
- GET /api/blogs/:id
- POST /api/blogs (auth)
- PUT /api/blogs/:id (auth)
- DELETE /api/blogs/:id (auth)

Health
- GET /health

Detailed request/response examples live in [docs/api.md](docs/api.md).

## Response Shape
Success:
```
{
	"success": true,
	"data": { ... }
}
```

Error:
```
{
	"success": false,
	"message": "Error message"
}
```
