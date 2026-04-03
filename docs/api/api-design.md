# API Design

This document defines all backend API endpoints for the Mount Paget system.

Each endpoint specifies its purpose, HTTP method, request format, and response behavior.

---

# 1. Authentication APIs

These APIs handle user registration, login, and authentication.

---

## POST /auth/register

Purpose: Register a new user account.

Authentication: Not required

Request Body:

{
"name": "string",
"email": "string",
"password": "string"
}

Response:

{
"message": "User registered successfully",
"userId": "ObjectId"
}

---

## POST /auth/login

Purpose: Authenticate an existing user.

Authentication: Not required

Request Body:

{
"email": "string",
"password": "string"
}

Response:

{
"message": "Login successful",
"token": "JWT_TOKEN"
}

---

## GET /auth/profile

Purpose: Retrieve the authenticated user's profile information.

Authentication: Required

Response:

{
"userId": "ObjectId",
"name": "string",
"email": "string",
"role": "string"
}

---

# 2. Blogs APIs

This section defines API endpoints used to manage blog posts inside the Mount Paget platform.

Blogs allow administrators to publish informational content such as travel guides, announcements, and updates.

---

## 2.1 Create Blog

Creates a new blog post.

Endpoint

POST /api/blogs

Access

Admin only

Request Body

{
"title": "Exploring Mount Paget",
"content": "Mount Paget is the highest peak in South Georgia...",
"author": "Admin",
"tags": ["travel", "mountains"]
}

Response

{
"success": true,
"message": "Blog created successfully",
"data": {
"blogId": "64bf238ab21"
}
}

---

## 2.2 Get All Blogs

Fetches all blog posts.

Endpoint

GET /api/blogs

Access

Public

Response

{
"success": true,
"data": [
{
"id": "64bf238ab21",
"title": "Exploring Mount Paget",
"author": "Admin",
"createdAt": "2026-03-23"
}
]
}

---

## 2.3 Get Blog By ID

Fetch a single blog post using its unique ID.

Endpoint

GET /api/blogs/:id

Access

Public

Response

# API Design

Base URL prefix: `/api`
Auth header: `Authorization: Bearer <token>` for protected routes
Content-Type: `application/json`

## Conventions
- Success: `{ "success": true, "data": { ... } }`
- Error: `{ "success": false, "message": "..." }`

## Authentication
### POST /api/auth/register
Registers a user.
Body:
```
{ "name": "Jane", "email": "jane@example.com", "password": "secret" }
```
Responses: 201 created; 400 missing fields; 409 duplicate email.

### POST /api/auth/login
Authenticates and returns JWT.
Body:
```
{ "email": "jane@example.com", "password": "secret" }
```
Responses: 200 with `data.token` and `data.user`; 401 invalid credentials; 404 user not found.

## Users (protected)
### GET /api/users/profile
Returns the authenticated user.
Responses: 200 with `data.user`; 401 missing/invalid token; 404 user not found.

### PUT /api/users/profile
Updates name, email, and/or password.
Body (any subset):
```
{ "name": "New", "email": "new@example.com", "password": "newpass" }
```
Responses: 200 updated user; 401 unauthorized; 404 user not found; 409 email in use.

## Services
Public reads, protected writes.

### GET /api/services
List services. 200 with `data.services`.

### GET /api/services/:id
Fetch one. 200 with `data.service`; 404 invalid/missing.

### POST /api/services (protected)
Create service.
Body:
```
{ "title": "Climbing", "description": "Guided climbs", "price": 120, "category": "outdoors" }
```
Responses: 201 created; 400 missing title/description; 401 unauthorized.

### PUT /api/services/:id (protected)
Update service fields. 200 updated; 401 unauthorized; 404 missing/invalid id.

### DELETE /api/services/:id (protected)
Delete service. 200 deleted; 401 unauthorized; 404 missing/invalid id.

## Blogs
Public reads, protected writes.

### GET /api/blogs
List blogs. 200 with `data.blogs`.

### GET /api/blogs/:id
Fetch one. 200 with `data.blog`; 404 invalid/missing.

### POST /api/blogs (protected)
Create blog.
Body:
```
{ "title": "Trip Report", "content": "Snowy and clear skies." }
```
Responses: 201 created; 400 missing title/content; 401 unauthorized.

### PUT /api/blogs/:id (protected)
Update blog. 200 updated; 401 unauthorized; 404 missing/invalid id.

### DELETE /api/blogs/:id (protected)
Delete blog. 200 deleted; 401 unauthorized; 404 missing/invalid id.

## Health
### GET /health
Simple liveness probe. 200 with status/uptime.
}
