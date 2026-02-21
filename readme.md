Here is the complete, consolidated `README.md` file with the exact sections you requested, ready to be copied and pasted into your project.

# Algorithmic Arena

A competitive programming platform built with the MERN stack. Users can solve algorithmic problems, submit code in multiple languages (including C++, JavaScript, Python, and Java), and get real-time execution feedback on their solutions.

## Features

* **Multi-Language Support:** Write and execute code in C++, JavaScript, Python, and Java.
* **Real-time Code Execution:** Integrated local sandboxing for secure, immediate test case evaluation.
* **Rich Code Editor:** Features the Monaco Editor (the engine behind VS Code) for syntax highlighting and autocomplete.
* **Secure Authentication:** JWT-based user login and registration system.
* **Submission Tracking:** Persistent history of user submissions, execution times, and memory usage.

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Monaco Editor
* **Backend:** Node.js, Express.js, JWT
* **Database:** MongoDB, Mongoose
* **Execution Engine:** Child Processes (Local mode) / Judge0

---

## Project Structure

```text
algorithmic-arena/
├── backend/                    # Express.js API server
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Problem.js          # Problem schema
│   │   └── Submission.js       # Submission schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── problems.js         # Problem management routes
│   │   └── submissions.js      # Code submission routes
│   ├── services/
│   │   └── judge0.js           # Code execution engine integration
│   ├── server.js               # Express app entry point
│   └── seed.js                 # Database seeder for sample problems
│
└── frontend/                   # React + Vite application
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CodeEditor.jsx
    │   │   └── TestResults.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state management
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Problems.jsx
    │   │   ├── ProblemDetail.jsx
    │   │   └── Submissions.jsx
    │   ├── services/
    │   │   └── api.js          # Axios HTTP client
    │   ├── App.jsx             # Root component with routes
    │   └── main.jsx            # React entry point
    ├── vite.config.js          
    └── tailwind.config.js      

```

---

## API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/register` | Create a new user account | No |
| POST | `/login` | Authenticate user and return JWT | No |
| GET | `/me` | Get the currently authenticated user's profile | Yes |

### Problem Routes (`/api/problems`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/` | Retrieve a list of all available problems | No |
| GET | `/:slug` | Retrieve detailed information for a specific problem | No |
| POST | `/` | Create a new problem (Admin only) | Yes |
| PUT | `/:slug` | Update an existing problem (Admin only) | Yes |
| DELETE | `/:slug` | Delete a problem from the platform (Admin only) | Yes |

### Submission Routes (`/api/submissions`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/` | Submit code for a specific problem for execution | Yes |
| GET | `/:id` | Check the execution status and results of a submission | Yes |
| GET | `/user/all` | Retrieve the submission history for the logged-in user | Yes

```
