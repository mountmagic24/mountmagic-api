# Mount Magic API

Base URL: `/api`
Authentication: Bearer JWT for protected routes (`Authorization: Bearer <token>`)
Content-Type: `application/json`

## Response Format
- Success: `{ "success": true, "data": { ... } }`
- Error: `{ "success": false, "message": "..." }`

## Auth
### POST /api/auth/register
Registers a user.
Request body:
```
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```
Responses:
- 201: `{ "success": true, "data": { "user": { "id", "name", "email", "role" } } }`
- 400: missing fields
- 409: email already exists

### POST /api/auth/login
Authenticates and returns a token.
Request body:
```
{
  "email": "jane@example.com",
  "password": "secret123"
}
```
Responses:
- 200: `{ "success": true, "data": { "token", "user": { "id", "name", "email", "role" } } }`
- 401: invalid credentials
- 404: user not found

## Users (protected)
Send `Authorization: Bearer <token>`.

### GET /api/users/profile
Returns the authenticated user.
- 200: `{ "success": true, "data": { "user": { "id", "name", "email", "role" } } }`
- 401: missing/invalid token
- 404: user not found

### PUT /api/users/profile
Updates name/email/password.
Request body (any subset):
```
{
  "name": "New Name",
  "email": "new@example.com",
  "password": "newpass"
}
```
Responses:
- 200: updated user in `data.user`
- 401: missing/invalid token
- 404: user not found
- 409: email already in use

## Services
Public reads, protected writes.

### GET /api/services
List services.
- 200: `{ "success": true, "data": { "services": [...] } }`

### GET /api/services/:id
- 200: `{ "success": true, "data": { "service": { ... } } }`
- 404: not found/invalid id

### POST /api/services (protected)
Create service.
Request body:
```
{
  "title": "Climbing",
  "description": "Guided climbs",
  "price": 120,
  "category": "outdoors"
}
```
Responses:
- 201: created service in `data.service`
- 400: missing title/description
- 401: missing/invalid token

### PUT /api/services/:id (protected)
Update fields.
- 200: updated service
- 401: missing/invalid token
- 404: not found/invalid id

### DELETE /api/services/:id (protected)
- 200: `{ "success": true, "message": "Service deleted" }`
- 401: missing/invalid token
- 404: not found/invalid id

## Blogs
Public reads, protected writes.

### GET /api/blogs
- 200: `{ "success": true, "data": { "blogs": [...] } }`

### GET /api/blogs/:id
- 200: blog in `data.blog`
- 404: not found/invalid id

### POST /api/blogs (protected)
Request body:
```
{
  "title": "Trip Report",
  "content": "Snowy and clear skies."
}
```
- 201: created blog
- 400: missing title/content
- 401: missing/invalid token

### PUT /api/blogs/:id (protected)
- 200: updated blog
- 401: missing/invalid token
- 404: not found/invalid id

### DELETE /api/blogs/:id (protected)
- 200: `{ "success": true, "message": "Blog deleted" }`
- 401: missing/invalid token
- 404: not found/invalid id

## Health
### GET /health
- 200: `{ "status": "ok", ... }`
