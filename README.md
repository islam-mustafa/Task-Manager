

# Task Manager

An advanced backend system for managing tasks, users, and notifications, built with Node.js, Express, and MongoDB. This project supports secure authentication, real-time updates, and robust RESTful APIs, making it ideal for modern productivity applications.

## Features

- **User Authentication:** JWT-based authentication and Google OAuth 2.0 login
- **Task Management:** Create, update, delete, and assign tasks
- **Notifications:** Real-time notifications for task updates and user actions
- **Socket.io Integration:** Live updates for tasks and notifications
- **Security:** Input validation, XSS protection, CSRF protection, and secure password hashing
- **Email Support:** Password reset and notification emails

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Passport.js (JWT & Google OAuth)
- Socket.io
- Nodemailer
- Helmet, CORS, XSS-Clean, CSURF

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
	```bash
	git clone <repository-url>
	cd task_manager
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Configure environment variables:**
	- Create a `.env` file in the root directory with the following keys:
	  ```env
	  PORT=5000
	  MONGO_URI=mongodb://localhost:27017/taskdb
	  JWT_SECRET=your_jwt_secret
	  GOOGLE_CLIENT_ID=your_google_client_id
	  GOOGLE_CLIENT_SECRET=your_google_client_secret
	  EMAIL_USER=your_email@example.com
	  EMAIL_PASS=your_email_password
	  ```
4. **Start the server:**
	```bash
	npm start
	```

## Usage

- Access the API at `http://localhost:5000/api/`
- Open `public/index.html` in your browser for the frontend demo

## Folder Structure

```
task_manager/
├── config/           # Configuration files (DB, Passport)
├── controllers/      # Route controllers
├── middleware/       # Custom middleware (auth, validation, security)
├── models/           # Mongoose models
├── public/           # Static frontend files
│   ├── css/
│   └── js/
├── routes/           # Express route definitions
├── services/         # Business logic and socket services
├── utils/            # Utility functions (token, email)
├── validators/       # Input validation logic
├── server.js         # Main server entry point
├── socket.js         # Socket.io setup
└── package.json
```

## API Endpoints

- `POST /api/users/register` – Register a new user
- `POST /api/users/login` – Login with JWT
- `GET /api/users/google` – Google OAuth login
- `GET /api/tasks` – List all tasks
- `POST /api/tasks` – Create a new task
- `PUT /api/tasks/:id` – Update a task
- `DELETE /api/tasks/:id` – Delete a task
- `GET /api/notifications` – Get user notifications

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the ISC License.
