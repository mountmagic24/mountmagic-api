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

{
"success": true,
"data": {
"title": "Exploring Mount Paget",
"content": "Mount Paget is the highest peak...",
"author": "Admin",
"tags": ["travel", "mountains"]
}
}

---

## 2.4 Update Blog

Updates an existing blog post.

Endpoint

PUT /api/blogs/:id

Access

Admin only

Request Body

{
"title": "Updated Blog Title",
"content": "Updated blog content"
}

Response

{
"success": true,
"message": "Blog updated successfully"
}

---

## 2.5 Delete Blog

Deletes a blog post.

Endpoint

DELETE /api/blogs/:id

Access

Admin only

Response

{
"success": true,
"message": "Blog deleted successfully"
}

---

# 3. Taxi APIs

This section defines API endpoints related to taxi booking and management within the Mount Paget system.

The taxi service allows users to request rides while administrators can manage ride requests.

---

## 3.1 Create Taxi Booking

Creates a new taxi booking request.

Endpoint

POST /api/taxi/book

Access

Authenticated users

Request Body

{
"pickupLocation": "Shimla Bus Stand",
"dropLocation": "Mount Paget Base Camp",
"pickupTime": "2026-03-25T10:30:00Z",
"passengers": 2,
"contactNumber": "+91XXXXXXXXXX"
}

Response

{
"success": true,
"message": "Taxi booking created successfully",
"data": {
"bookingId": "TX239847"
}
}

---

## 3.2 Get All Taxi Bookings

Fetches all taxi bookings.

Endpoint

GET /api/taxi/bookings

Access

Admin only

Response

{
"success": true,
"data": [
{
"bookingId": "TX239847",
"pickupLocation": "Shimla Bus Stand",
"dropLocation": "Mount Paget Base Camp",
"status": "pending"
}
]
}

---

## 3.3 Get Taxi Booking By ID

Fetch a single taxi booking.

Endpoint

GET /api/taxi/bookings/:id

Access

Admin or booking user

Response

{
"success": true,
"data": {
"bookingId": "TX239847",
"pickupLocation": "Shimla Bus Stand",
"dropLocation": "Mount Paget Base Camp",
"pickupTime": "2026-03-25T10:30:00Z",
"passengers": 2,
"status": "pending"
}
}

---

## 3.4 Update Booking Status

Allows admin to update taxi booking status.

Endpoint

PATCH /api/taxi/bookings/:id/status

Access

Admin only

Request Body

{
"status": "confirmed"
}

Response

{
"success": true,
"message": "Booking status updated"
}

---

## 3.5 Cancel Taxi Booking

Allows a user to cancel a taxi booking.

Endpoint

DELETE /api/taxi/bookings/:id

Access

Authenticated user

Response

{
"success": true,
"message": "Taxi booking cancelled successfully"
}

---

# 4. Document Services APIs

This section defines APIs related to document service requests in the Mount Paget system.

Users can request official services such as document preparation or assistance, and administrators can review and manage those requests.

---

## 4.1 Create Document Service Request

Creates a new document service request.

Endpoint

POST /api/documents/request

Access

Authenticated users

Request Body

{
"fullName": "Rahul Sharma",
"email": "<rahul@example.com>",
"serviceType": "Visa Assistance",
"description": "Need help preparing visa documentation"
}

Response

{
"success": true,
"message": "Document service request submitted successfully",
"data": {
"requestId": "DOC12983"
}
}

---

## 4.2 Get All Document Requests

Fetches all document service requests.

Endpoint

GET /api/documents

Access

Admin only

Response

{
"success": true,
"data": [
{
"requestId": "DOC12983",
"fullName": "Rahul Sharma",
"serviceType": "Visa Assistance",
"status": "pending"
}
]
}

---

## 4.3 Get Document Request By ID

Fetch a single document service request.

Endpoint

GET /api/documents/:id

Access

Admin

Response

{
"success": true,
"data": {
"requestId": "DOC12983",
"fullName": "Rahul Sharma",
"email": "<rahul@example.com>",
"serviceType": "Visa Assistance",
"description": "Need help preparing visa documentation",
"status": "pending"
}
}

---

## 4.4 Update Request Status

Allows admin to update the request status.

Endpoint

PATCH /api/documents/:id/status

Access

Admin only

Request Body

{
"status": "completed"
}

Response

{
"success": true,
"message": "Request status updated successfully"
}

---

## 4.5 Delete Document Request

Deletes a document request.

Endpoint

DELETE /api/documents/:id

Access

Admin only

Response

{
"success": true,
"message": "Document request deleted successfully"
}

---
