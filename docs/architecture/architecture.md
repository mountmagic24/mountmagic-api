# Mount Paget Backend Architecture

## 1. Overview

The **Mount Paget backend** is a RESTful API server responsible for processing client requests, executing business logic, managing data storage, and coordinating communication between various services of the platform.

The backend acts as the **central system** connecting client applications such as web apps, mobile apps, and administrative dashboards. All client applications interact with the system through **HTTP-based API endpoints** exposed by the backend server.

This backend system is designed using a **modular architecture**. Modular architecture allows different parts of the system to operate independently while still functioning as part of a unified platform. This improves maintainability, scalability, and development speed.

The architecture follows a **layered design pattern**, where each layer has a specific responsibility. This separation of concerns ensures that code remains organized and easier to maintain over time.

The backend system is responsible for the following core tasks:

- Receiving and processing HTTP requests
- Validating request data
- Authenticating users and services
- Executing business logic
- Communicating with the database
- Returning structured API responses

---

## 2. Technology Stack

The backend is implemented using widely adopted server-side technologies that support scalable and maintainable API development.

### Core Technologies

- **Node.js**  
  Runtime environment used to execute JavaScript on the server.

- **Express.js**  
  Web framework used to define API routes, middleware, and request handling.

- **MongoDB**  
  NoSQL database used for storing application data such as users, listings, bookings, and other platform entities.

- **Mongoose**  
  Object Data Modeling (ODM) library that provides schema-based modeling for MongoDB.

### Supporting Tools

Additional tools may be used to support development and infrastructure:

- Environment variable management
- Logging tools
- Cloud storage services
- Authentication services

These tools help improve reliability, maintainability, and scalability of the backend system.

---

## 3. System Components

The backend architecture is composed of multiple components. Each component has a clearly defined responsibility.

The major components of the backend include:

- Client Layer
- API Server Layer
- Middleware Layer
- Controller Layer
- Service Layer
- Data Access Layer
- Database Layer

---

## 4. Client Layer

The **Client Layer** represents all external applications that interact with the backend system. These clients communicate with the backend using HTTP requests.

Examples of client applications include:

- Web applications running in browsers
- Mobile applications
- Administrative dashboards
- Third-party integrations

Clients send requests to the backend API endpoints in order to perform actions such as retrieving data, submitting forms, creating records, or updating existing resources.

All communication between the client layer and the backend server follows the **REST API model**.

Typical request methods include:

- `GET` – retrieve data
- `POST` – create new resources
- `PUT` – update existing resources
- `PATCH` – partially update resources
- `DELETE` – remove resources

The backend returns responses in **JSON format**, which is easily processed by modern web and mobile applications.

---

## 5. API Server Layer

The **API Server Layer** is responsible for receiving all incoming HTTP requests from client applications.

This layer is implemented using **Node.js and Express.js**, which together provide a lightweight and efficient environment for building scalable APIs.

The API server performs several responsibilities:

- Listening for incoming HTTP requests
- Parsing request bodies
- Routing requests to appropriate handlers
- Executing middleware functions
- Sending structured responses back to the client

Express.js organizes API endpoints using **routes**. Each route corresponds to a specific operation within the application.

Example categories of routes may include:

- User routes
- Authentication routes
- Booking routes
- Listing routes
- Admin routes

Each route forwards the request to a **controller**, which contains the logic required to process the request.

---

## 6. Controller Layer

The **Controller Layer** contains the main request-handling logic of the application.

When a client sends a request to an API endpoint, the route forwards the request to the appropriate controller function.

Controllers are responsible for:

- Receiving request data
- Validating input parameters
- Calling the necessary services or database operations
- Preparing the response to send back to the client

Controllers should remain **thin and focused**, meaning they should not contain complex business logic directly.

Instead, they should delegate deeper logic to helper functions or service modules whenever necessary.

This separation helps maintain clean code and improves maintainability.

Example controller responsibilities include:

- Creating a new taxi booking request
- Handling document service submissions
- Publishing or retrieving blog posts
- Managing admin operations

Each controller function processes a specific action and returns a JSON response indicating success or failure.

---

## 7. Business Logic Layer

The **Business Logic Layer** contains the core operational rules of the application.

This layer ensures that all application-specific logic is centralized and separated from request handling.

Examples of business logic include:

- Calculating taxi fare estimates
- Processing CS center document requests
- Managing blog publishing rules
- Handling role-based access permissions
- Validating service request workflows

Keeping business logic separate from controllers ensures that the system remains modular and easier to scale in the future.

It also allows the same logic to be reused across different API endpoints if needed.

This layer acts as the **core brain of the backend system**.

---

## 8. Database Layer

The **Database Layer** is responsible for storing and managing all persistent data used by the system.

This project uses **MongoDB** as the primary database. MongoDB is a NoSQL document database that stores data in flexible JSON-like documents.

MongoDB is suitable for this project because it allows fast development and flexible schema design.

Data in MongoDB is organized into **collections**. Each collection contains multiple documents representing a specific entity.

Examples of collections in this system include:

- Users
- BlogPosts
- TaxiRequests
- DocumentServiceRequests
- Roles

Each document inside a collection represents a single record.

For example, a document in the **Users collection** may contain:

- user ID
- name
- email
- role
- authentication provider

MongoDB will be accessed using **Mongoose**, which provides schema definitions and simplifies database interactions in Node.js.

Mongoose helps enforce structure in MongoDB documents while still allowing flexibility when needed.

---

## 9. Authentication System

The backend system implements authentication to verify user identities before allowing access to protected operations.

Users will authenticate using **Google OAuth**.

When a user signs in with Google, the backend receives verified user identity information from Google’s authentication service.

This includes:

- User email
- User name
- Google account ID

After successful authentication, the backend creates or retrieves the user record in the database.

A **JWT (JSON Web Token)** will then be generated and returned to the client.

This token is used in future API requests to verify the user’s identity.

Protected routes will require this token in the request headers.

---

## 10. Role-Based Access Control

The system implements **Role-Based Access Control (RBAC)** to ensure that users can only access the parts of the system relevant to their responsibilities.

Each user in the database will have a specific **role** assigned to them.

Roles define what actions a user is allowed to perform within the system.

Examples of roles include:

- Admin
- CS Center Manager
- Taxi Manager
- Content Manager
- General User

Each role will have different permissions.

For example:

- The **Admin** can view and manage all system sections.
- The **CS Center Manager** can view and manage document service requests.
- The **Taxi Manager** can manage taxi booking requests.
- The **Content Manager** can create, edit, or delete blog posts.
- The **General User** can submit service requests and read blog posts.

Role verification will be implemented using middleware that runs before protected routes are executed.

This middleware checks the user’s role and determines whether access should be granted.

This mechanism improves system security and ensures proper separation of responsibilities.

---

## 11. File Upload and Media Handling

Some parts of the application require users to upload files such as:

- Documents for service requests
- Images for blog posts

Since the project is running on a **free hosting environment**, storing files directly on the server is not reliable.

To solve this, the system will use **Cloudinary** as a cloud-based media storage service.

Cloudinary allows images and files to be uploaded directly from the backend.

The backend will send uploaded files to Cloudinary and store only the returned file URL inside the database.

This approach keeps the backend lightweight and avoids storage limitations on the server.

---

## 12. API Security

Security is an important aspect of backend development. The system will implement multiple security practices to protect the application and user data.

First, all incoming requests will pass through validation checks to ensure that the data provided by the client is correct and safe.

This prevents invalid or malicious data from entering the system.

Second, authentication tokens will be required for accessing protected endpoints.

The backend will verify the validity of these tokens before allowing the request to proceed.

Third, role-based access control will ensure that users can only perform actions permitted by their role.

Additionally, the backend will implement protection mechanisms such as:

- Input validation
- Sanitization of user inputs
- Limiting request sizes for uploads
- Proper error handling

Sensitive information such as API keys and secret tokens will be stored in **environment variables** instead of directly in the source code.

This helps protect sensitive credentials from being exposed.

---

## 13. Error Handling System

A centralized error handling system will be implemented in the backend to manage unexpected situations gracefully.

Errors may occur due to several reasons, including:

- Invalid client input
- Database operation failures
- Authentication errors
- External service failures

Instead of allowing the server to crash, the backend will capture these errors and return structured responses to the client.

Typical error responses will include:

- HTTP status code
- Error message
- Additional details if required

This improves debugging and ensures that the application behaves consistently even when errors occur.

Centralized error handling also simplifies logging and monitoring of system issues.

---

## 14. Logging System

Logging is important for monitoring system activity and diagnosing issues.

The backend will include a logging mechanism that records important events occurring within the system.

Examples of events that may be logged include:

- Incoming API requests
- Authentication attempts
- Errors and exceptions
- Important system operations

Logs help developers understand how the system behaves during real-world usage.

During the initial development phase, basic logging using `console.log` may be sufficient.

However, in a more advanced setup, logging libraries such as **Winston** or **Pino** can be used.

These libraries allow logs to be stored in structured formats and can support different logging levels such as:

- Info
- Warning
- Error
- Debug

Proper logging improves system reliability and simplifies troubleshooting.

---

## 15. Testing Strategy

Testing ensures that the backend system behaves correctly and reduces the chances of bugs in production.

Each API endpoint should be tested to verify that it performs the expected operations.

Testing can include checking:

- Successful responses
- Error handling
- Input validation
- Authorization behavior

Testing tools such as **Jest** or **Mocha** can be used for automated backend testing.

During development, tools like **Postman** or **Insomnia** may also be used to manually test API endpoints.

Writing tests early helps detect problems quickly and improves code quality.

Even basic test coverage can significantly increase the reliability of the system.

---

## 16. Deployment Strategy

The backend application will be deployed using a free hosting platform since the project currently has no infrastructure budget.

Possible hosting platforms include:

- Render
- Railway
- Fly.io
- Cyclic

These platforms allow Node.js applications to run with minimal configuration and provide a public URL for accessing the API.

The deployment process generally involves:

1. Pushing the backend code to a GitHub repository
2. Connecting the repository to the hosting platform
3. Configuring environment variables
4. Deploying the application automatically

Once deployed, the backend server becomes accessible over the internet through a public API endpoint.

This allows frontend applications and users to interact with the backend services.

The database (MongoDB) can be hosted using **MongoDB Atlas**, which provides a free tier suitable for small applications.

---

## 17. Future Scalability Considerations

Although the current version of the system is designed for simplicity and low-cost deployment, the architecture allows future scalability.

Possible future improvements include:

- Separating services into microservices
- Implementing caching layers using Redis
- Adding background job queues for heavy processing
- Introducing load balancing for higher traffic

The current modular architecture ensures that the system can evolve without requiring a complete redesign.

As the platform grows and attracts more users, infrastructure and architecture improvements can be implemented gradually.

This approach allows the system to start small while remaining capable of scaling in the future.

---

## Conclusion

This backend architecture provides a modular, scalable, and maintainable structure for the Mount Paget platform.

The system separates responsibilities across different layers, including routing, controllers, business logic, and database management.

This separation improves maintainability, simplifies debugging, and allows multiple developers to collaborate efficiently.

The architecture also incorporates essential features such as authentication, role-based access control, file storage, and proper API design.

By following this structured architecture, the backend system can support the platform’s services while remaining flexible for future expansion.
