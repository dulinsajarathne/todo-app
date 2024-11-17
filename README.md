# Todo App

A simple Todo app built with Node.js, Express, MongoDB, and React. This app allows users to manage their tasks with authentication and password reset functionality.

## Features
- User authentication (sign up, login)
- Password reset functionality
- JWT-based authorization
- Email verification
- Secure cookies for session management

## Technologies Used
- Backend: Node.js, Express, MongoDB
- Frontend: React
- Authentication: JWT (JSON Web Tokens)
- Database: MongoDB (MongoDB Atlas)
- Email: Amazon Workmail for sending verification emails
- Environment management: dotenv

## Getting Started

### Prerequisites

Before you can run the app, ensure that you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (MongoDB Atlas account for cloud-hosted DB)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management

### 1. Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/dulinsajarathne/todo-app.git
cd todo-app
````

### 2.Set Up Environment Variables
Create a .env file at the root of the project (make sure it's excluded from Git using .gitignore), and add the following values. You can use .env.example as a template:
``` 
env
PORT=5000
MONGODB_URI=mongodb+srv://<your-mongo-username>:<your-mongo-password>@cluster0.mongodb.net/todo?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
BACKEND_URL=http://localhost:5000/api/auth/
FRONTEND_URL=http://localhost:3000/
WORKMAIL_EMAIL=your-email@example.com
WORKMAIL_PASSWORD=your-workmail-password
NODE_ENV=development
COOKIE_SECRET=your_cookie_secret_key
COOKIE_SECURE=false
COOKIE_SAMESITE=Strict
COOKIE_MAX_AGE=3600000
CLIENT_URL=http://localhost:3000
```

### 3. Install Dependencies
Run the following command to install the required dependencies for both the backend and frontend:

```bash

# For Backend
cd backend
npm install

# For Frontend
cd ../frontend
npm install
```


## 4. Start the Application
Backend:
Navigate to the backend folder and start the server:

```bash

cd backend
npm start

```
The backend server will be running on http://localhost:5000.

Frontend:
Navigate to the frontend folder and start the React app:


```bash
cd frontend
npm start
```
The frontend will be available on http://localhost:3000.

### 5. Register & Login
Once the app is running, you can sign up a new user. The system will send a verification email to the provided email address. After verifying, you can log in and start using the Todo app.

### 6. Testing Password Reset
If you forget your password, you can use the password reset functionality by following the instructions sent to your email.

### 7. CORS Setup
Make sure to set the CLIENT_URL in the .env file to match your frontend URL (e.g., http://localhost:3000) to avoid CORS issues.
