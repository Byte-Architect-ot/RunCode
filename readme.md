# README.md for Algorithmic Arena

```markdown
# Algorithmic Arena

A competitive programming platform similar to LeetCode/Codeforces built with the MERN stack. Users can solve algorithmic problems, submit code in multiple languages, and get real-time feedback on their solutions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ALGORITHMIC ARENA                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────────┐ │
│  │              │     │              │     │                              │ │
│  │   Frontend   │────▶│   Backend    │────▶│         MongoDB              │ │
│  │   (React)    │     │  (Express)   │     │   (Users, Problems,          │ │
│  │   Port 3000  │◀────│   Port 5000  │◀────│    Submissions)              │ │
│  │              │     │              │     │                              │ │
│  └──────────────┘     └──────┬───────┘     └──────────────────────────────┘ │
│                              │                                               │
│                              │ Code Execution                                │
│                              ▼                                               │
│                     ┌──────────────────┐                                     │
│                     │                  │                                     │
│                     │  Local Executor  │                                     │
│                     │  (Node/Python)   │                                     │
│                     │                  │                                     │
│                     └──────────────────┘                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     Alternative: Judge0 (Docker)                      │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │   │
│  │  │ Judge0 API  │───▶│    Redis    │───▶│   Workers   │               │   │
│  │  │  Port 2358  │    │   (Queue)   │    │ (Sandboxed) │               │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow for Code Submission

```
User writes code
       │
       ▼
┌─────────────────┐
│ Frontend sends  │
│ POST /api/      │
│ submissions     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Backend creates │     │ Fetch problem   │
│ submission      │────▶│ test cases &    │
│ record          │     │ boilerplate     │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Merge user code │
│ with boilerplate│
│ (full runnable  │
│  program)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Execute code    │
│ for each test   │
│ case            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Compare output  │
│ with expected   │
│ output          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update          │
│ submission      │
│ status in DB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Frontend polls  │
│ & displays      │
│ results         │
└─────────────────┘
```

---

## Project Structure

```
algorithmic-arena/
│
├── backend/                    # Express.js API server
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema (auth, profile)
│   │   ├── Problem.js         # Problem schema (questions)
│   │   └── Submission.js      # Submission schema (user solutions)
│   ├── routes/
│   │   ├── auth.js            # Login, Register, Get User
│   │   ├── problems.js        # CRUD for problems
│   │   └── submissions.js     # Submit code, get results
│   ├── services/
│   │   └── judge0.js          # Code execution engine
│   ├── server.js              # Express app entry point
│   ├── seed.js                # Database seeder for sample problems
│   └── package.json
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── CodeEditor.jsx     # Monaco code editor wrapper
│   │   │   ├── TestResults.jsx    # Display test case results
│   │   │   └── ProtectedRoute.jsx # Auth guard for routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── Problems.jsx       # Problem listing
│   │   │   ├── ProblemDetail.jsx  # Problem solver page
│   │   │   └── Submissions.jsx    # User's submission history
│   │   ├── services/
│   │   │   └── api.js             # Axios HTTP client
│   │   ├── App.jsx                # Root component with routes
│   │   ├── App.css                # Tailwind + custom styles
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── package.json
│
├── submission-webhook/         # Webhook service for Judge0 callbacks
│   ├── server.js              # Express server for webhooks
│   └── package.json
│
├── docker-compose.yml         # Docker setup for MongoDB, Redis, Judge0
├── setup.sh                   # Automated setup script
├── package.json               # Root package.json
└── README.md                  # This file
```

---

## Detailed File Explanations

### Backend Files

#### `backend/config/db.js`
```javascript
// PURPOSE: Establishes connection to MongoDB
// 
// WHAT IT DOES:
// - Uses Mongoose to connect to MongoDB
// - Handles connection errors
// - Logs successful connection
//
// WHY IT'S SEPARATE:
// - Single Responsibility Principle
// - Can be reused across different entry points (server, seed, tests)
```

#### `backend/middleware/auth.js`
```javascript
// PURPOSE: Protects routes that require authentication
//
// HOW IT WORKS:
// 1. Extracts JWT token from "Authorization: Bearer <token>" header
// 2. Verifies token using secret key
// 3. Decodes user ID from token
// 4. Fetches user from database
// 5. Attaches user to request object (req.user)
// 6. Calls next() to proceed to route handler
//
// IF TOKEN IS INVALID:
// - Returns 401 Unauthorized response
// - Request does not proceed to route handler
```

#### `backend/models/User.js`
```javascript
// PURPOSE: Defines the User data structure
//
// FIELDS:
// - username: Unique identifier for the user
// - email: For authentication
// - password: Hashed using bcrypt (never stored as plain text)
// - solvedProblems: Array of Problem IDs the user has solved
// - rating: User's skill rating (like Codeforces rating)
//
// SPECIAL FEATURES:
// - Pre-save hook: Automatically hashes password before saving
// - matchPassword method: Compares entered password with hash
```

#### `backend/models/Problem.js`
```javascript
// PURPOSE: Defines the Problem data structure
//
// KEY FIELDS:
// - title: Display name ("Two Sum")
// - slug: URL-friendly name ("two-sum")
// - description: Problem statement in Markdown
// - difficulty: "Easy" | "Medium" | "Hard"
// - defaultCode: Starter code templates for each language
// - fullBoilerplate: Complete code wrapper (hidden from user)
// - testCases: Array of {input, expectedOutput, isHidden}
//
// BOILERPLATE CONCEPT:
// ┌────────────────────────────────────────┐
// │  fullBoilerplate (hidden from user)   │
// │  ┌──────────────────────────────────┐ │
// │  │  Input parsing code              │ │
// │  │  ##USER_CODE## ◀── replaced with │ │
// │  │  Output formatting code          │ │  user's solution
// │  └──────────────────────────────────┘ │
// └────────────────────────────────────────┘
```

#### `backend/models/Submission.js`
```javascript
// PURPOSE: Records each code submission
//
// FIELDS:
// - userId: Who submitted
// - problemId: Which problem
// - code: The user's code
// - language: "javascript" | "python" | "cpp" | "java"
// - status: Overall result
// - testCaseResults: Array of individual test results
//
// STATUS VALUES:
// - "Pending": Just submitted, not executed yet
// - "Running": Currently being executed
// - "AC": Accepted (all tests passed)
// - "WA": Wrong Answer (output mismatch)
// - "TLE": Time Limit Exceeded (code too slow)
// - "RE": Runtime Error (code crashed)
// - "CE": Compilation Error (syntax error)
// - "MLE": Memory Limit Exceeded (used too much RAM)
```

#### `backend/services/judge0.js`
```javascript
// PURPOSE: Executes user code safely
//
// LOCAL EXECUTION MODE (Current):
// ┌─────────────────────────────────────────────────────┐
// │ 1. Write code to temporary file                    │
// │ 2. Spawn child process (node/python3)              │
// │ 3. Pipe stdin (test input)                         │
// │ 4. Capture stdout (program output)                 │
// │ 5. Compare with expected output                    │
// │ 6. Return result with timing info                  │
// │ 7. Clean up temporary files                        │
// └─────────────────────────────────────────────────────┘
//
// JUDGE0 MODE (Optional, requires Docker):
// ┌─────────────────────────────────────────────────────┐
// │ 1. Send code to Judge0 API                         │
// │ 2. Judge0 queues job in Redis                      │
// │ 3. Worker picks up job, runs in sandbox            │
// │ 4. Sandbox limits CPU time, memory, disk           │
// │ 5. Result sent back via webhook                    │
// └─────────────────────────────────────────────────────┘
```

#### `backend/routes/submissions.js`
```javascript
// PURPOSE: Handles code submission workflow
//
// POST /api/submissions - Submit code
// ┌─────────────────────────────────────────────────────┐
// │ 1. Validate request (problemId, code, language)    │
// │ 2. Fetch problem from database                     │
// │ 3. Create submission record (status: "Pending")    │
// │ 4. Build full code: boilerplate + user code        │
// │ 5. For each test case:                             │
// │    a. Execute code with test input                 │
// │    b. Compare output with expected                 │
// │    c. Record result (AC/WA/TLE/RE)                 │
// │ 6. Determine overall status                        │
// │ 7. Save submission and return result               │
// └─────────────────────────────────────────────────────┘
//
// GET /api/submissions/:id - Get submission details
// GET /api/submissions/user/all - Get user's submissions
```

#### `backend/seed.js`
```javascript
// PURPOSE: Populates database with sample problems
//
// USAGE: npm run seed
//
// WHAT IT DOES:
// 1. Connects to MongoDB
// 2. Clears existing problems
// 3. Inserts predefined problems with:
//    - Description
//    - Starter code for each language
//    - Full boilerplate for each language
//    - Test cases (visible and hidden)
// 4. Exits
```

---

### Frontend Files

#### `frontend/src/context/AuthContext.jsx`
```javascript
// PURPOSE: Global authentication state management
//
// PROVIDES:
// - user: Current logged-in user object (or null)
// - loading: Boolean for loading state
// - login(email, password): Authenticates user
// - register(username, email, password): Creates account
// - logout(): Clears session
//
// HOW IT WORKS:
// ┌─────────────────────────────────────────────────────┐
// │ 1. On app load, check localStorage for token       │
// │ 2. If token exists, call /api/auth/me              │
// │ 3. If valid, set user state                        │
// │ 4. If invalid, clear token                         │
// │ 5. Provide context to all child components         │
// └─────────────────────────────────────────────────────┘
//
// USAGE IN COMPONENTS:
// const { user, login, logout } = useAuth();
```

#### `frontend/src/components/CodeEditor.jsx`
```javascript
// PURPOSE: Monaco code editor integration
//
// MONACO EDITOR:
// - Same editor used in VS Code
// - Provides syntax highlighting, autocomplete
// - Supports multiple languages
//
// PROPS:
// - language: "javascript" | "python" | "cpp" | "java"
// - code: Current code string
// - onChange: Callback when code changes
//
// CONFIGURATION:
// - Theme: "vs-dark" (dark mode)
// - Font: JetBrains Mono (monospace)
// - Features: Line numbers, auto-layout, bracket matching
```

#### `frontend/src/components/TestResults.jsx`
```javascript
// PURPOSE: Display test case execution results
//
// VISUAL STATES:
// ┌─────────────────────────────────────────────────────┐
// │ AC (Accepted)     │ Green  │ ✓ Checkmark           │
// │ WA (Wrong Answer) │ Red    │ ✗ X mark              │
// │ TLE (Time Limit)  │ Yellow │ Clock icon            │
// │ RE (Runtime Error)│ Purple │ Warning icon          │
// │ CE (Compile Error)│ Orange │ Error icon            │
// │ Running           │ Blue   │ Spinning animation    │
// │ Pending           │ Gray   │ Dots                  │
// └─────────────────────────────────────────────────────┘
//
// DISPLAYS:
// - Test case number
// - Status badge
// - Execution time (ms)
// - Memory usage (MB)
```

#### `frontend/src/pages/ProblemDetail.jsx`
```javascript
// PURPOSE: The main problem-solving interface
//
// LAYOUT:
// ┌────────────────────────┬────────────────────────┐
// │                        │                        │
// │   Problem Description  │     Code Editor        │
// │                        │                        │
// │   - Title              │   - Language selector  │
// │   - Difficulty badge   │   - Monaco editor      │
// │   - Description (MD)   │   - Reset button       │
// │   - Constraints        │                        │
// │   - Tags               │                        │
// │                        ├────────────────────────┤
// │   Test Results         │   Submit button        │
// │   (after submission)   │   Loading indicator    │
// │                        │                        │
// └────────────────────────┴────────────────────────┘
//
// SUBMISSION FLOW:
// 1. User clicks Submit
// 2. POST request to /api/submissions
// 3. Start polling GET /api/submissions/:id
// 4. Update UI as results come in
// 5. Stop polling when status is final
```

#### `frontend/src/services/api.js`
```javascript
// PURPOSE: Centralized HTTP client
//
// FEATURES:
// - Base URL configuration
// - Automatic token injection via interceptor
// - 401 error handling (redirect to login)
//
// INTERCEPTORS:
// ┌─────────────────────────────────────────────────────┐
// │ Request Interceptor:                               │
// │   1. Get token from localStorage                   │
// │   2. Add "Authorization: Bearer <token>" header    │
// │                                                    │
// │ Response Interceptor:                              │
// │   1. If 401 error, clear token                     │
// │   2. Redirect to /login                            │
// └─────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. The Boilerplate System

The boilerplate system is crucial for handling different languages uniformly.

```
USER SEES (defaultCode):            ACTUALLY EXECUTED (fullBoilerplate):
┌─────────────────────────┐         ┌─────────────────────────────────────┐
│ function twoSum(nums,   │         │ // Input parsing                    │
│   target) {             │         │ const input = require('fs')         │
│   // Write code here    │         │   .readFileSync(0, 'utf-8');        │
│                         │         │ const lines = input.split('\n');    │
│ }                       │         │ const nums = JSON.parse(lines[0]);  │
│                         │         │ const target = parseInt(lines[1]);  │
└─────────────────────────┘         │                                     │
                                    │ // USER'S CODE INSERTED HERE        │
          │                         │ function twoSum(nums, target) {     │
          │                         │   // Write code here                │
          │                         │ }                                   │
          │                         │                                     │
          ▼                         │ // Output formatting                │
    ##USER_CODE##                   │ const result = twoSum(nums, target);│
      replaced                      │ console.log(JSON.stringify(result));│
                                    └─────────────────────────────────────┘
```

**Why this design?**
1. Users write clean function code (like LeetCode)
2. The system handles I/O parsing (reading stdin, formatting output)
3. Same test cases work across all languages
4. Users don't need to know about stdin/stdout handling

### 2. Test Case Evaluation

```
Input: "[2,7,11,15]\n9"
Expected Output: "[0,1]"

EXECUTION:
┌─────────────────────────────────────────────────────────┐
│ 1. Write full code to temp file                        │
│ 2. Execute: echo "[2,7,11,15]\n9" | node temp.js       │
│ 3. Capture stdout: "[0,1]"                             │
│ 4. Compare: stdout.trim() === expectedOutput.trim()   │
│ 5. Result: MATCH → AC, NO MATCH → WA                   │
└─────────────────────────────────────────────────────────┘
```

### 3. Authentication Flow

```
REGISTRATION:
┌─────────────────────────────────────────────────────────┐
│ 1. User submits username, email, password              │
│ 2. Backend checks if user exists                       │
│ 3. Password hashed with bcrypt (10 rounds)             │
│ 4. User saved to MongoDB                               │
│ 5. JWT token generated (contains user ID)              │
│ 6. Token sent to frontend                              │
│ 7. Frontend stores in localStorage                     │
└─────────────────────────────────────────────────────────┘

LOGIN:
┌─────────────────────────────────────────────────────────┐
│ 1. User submits email, password                        │
│ 2. Backend finds user by email                         │
│ 3. Compare password with bcrypt                        │
│ 4. If match, generate JWT token                        │
│ 5. Send token to frontend                              │
│ 6. Frontend stores in localStorage                     │
└─────────────────────────────────────────────────────────┘

PROTECTED REQUEST:
┌─────────────────────────────────────────────────────────┐
│ 1. Frontend reads token from localStorage              │
│ 2. Adds header: "Authorization: Bearer <token>"        │
│ 3. Backend middleware extracts and verifies token      │
│ 4. If valid, attaches user to req.user                 │
│ 5. Route handler has access to req.user                │
└─────────────────────────────────────────────────────────┘
```

---

## How Code Execution Works

### Local Execution (Current Implementation)

```javascript
// backend/services/judge0.js

// 1. CREATE TEMPORARY FILE
const tempDir = await mkdtemp(path.join(os.tmpdir(), 'arena-'));
const codeFile = path.join(tempDir, 'solution.js');
await writeFile(codeFile, code);

// 2. SPAWN CHILD PROCESS
const child = spawn('node', [codeFile], {
  cwd: tempDir,
  timeout: 5000  // Kill after 5 seconds (TLE protection)
});

// 3. PIPE INPUT (stdin)
child.stdin.write(testInput);
child.stdin.end();

// 4. CAPTURE OUTPUT
let stdout = '';
child.stdout.on('data', (data) => {
  stdout += data.toString();
});

// 5. HANDLE COMPLETION
child.on('close', (exitCode) => {
  if (exitCode === 0) {
    // Program ran successfully
    // Compare stdout with expected output
  } else {
    // Runtime error occurred
  }
});

// 6. CLEANUP
await unlink(codeFile);
```

### Judge0 (Optional, More Secure)

Judge0 is a production-grade code execution system:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           JUDGE0 ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Your Backend                                                        │
│       │                                                              │
│       │ POST /submissions                                            │
│       ▼                                                              │
│  ┌──────────────┐                                                    │
│  │  Judge0 API  │ ◀─────── Port 2358                                │
│  │   Server     │                                                    │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         │ Push to queue                                              │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │    Redis     │ ◀─────── Job Queue                                │
│  │    Queue     │                                                    │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         │ Workers pull jobs                                          │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │   Workers    │ ◀─────── Run in isolated containers               │
│  │  (Sandbox)   │                                                    │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         │ Send result                                                │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │   Webhook    │ ◀─────── Your webhook endpoint                    │
│  │   Callback   │          receives results                         │
│  └──────────────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

SANDBOX PROTECTIONS:
- CPU time limit (prevents infinite loops)
- Memory limit (prevents memory bombs)
- Process limit (prevents fork bombs)
- Network disabled (no external calls)
- Disk quota (limited file writes)
- Isolated filesystem (can't access host)
```

---

## How Monaco Editor Works

Monaco is the editor that powers VS Code:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MONACO EDITOR                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  React Component                                                     │
│       │                                                              │
│       │ <Editor                                                      │
│       │   language="javascript"                                      │
│       │   value={code}                                               │
│       │   onChange={setCode}                                         │
│       │   theme="vs-dark"                                            │
│       │ />                                                           │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    @monaco-editor/react                       │   │
│  │                                                               │   │
│  │  - Loads Monaco asynchronously (from CDN or bundled)         │   │
│  │  - Creates editor instance                                    │   │
│  │  - Binds React props to editor API                           │   │
│  │  - Handles resize, theme changes                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  FEATURES PROVIDED:                                                  │
│  ┌────────────────────┬─────────────────────────────────────────┐   │
│  │ Syntax Highlighting│ Colors code based on language grammar   │   │
│  │ IntelliSense       │ Autocomplete, type hints (JS/TS)        │   │
│  │ Error Detection    │ Red squiggles for syntax errors         │   │
│  │ Bracket Matching   │ Highlights matching brackets            │   │
│  │ Code Folding       │ Collapse functions, blocks              │   │
│  │ Multi-cursor       │ Edit multiple lines simultaneously      │   │
│  │ Find/Replace       │ Search within editor                    │   │
│  │ Minimap            │ Overview of code (we disable this)      │   │
│  └────────────────────┴─────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Language Detection:**
```javascript
// Monaco maps language IDs to grammars
const getMonacoLanguage = (lang) => {
  const langMap = {
    'cpp': 'cpp',         // C++ grammar
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java'
  };
  return langMap[lang];
};
```

---

## Database Schema Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MONGODB COLLECTIONS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  USERS                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ {                                                            │    │
│  │   _id: ObjectId,                                             │    │
│  │   username: "john_doe",        // Unique, public display     │    │
│  │   email: "john@example.com",   // Unique, for login          │    │
│  │   password: "$2a$10$...",      // Bcrypt hash                │    │
│  │   solvedProblems: [ObjectId],  // Refs to Problem            │    │
│  │   rating: 1200,                // Skill rating               │    │
│  │   createdAt: Date,                                           │    │
│  │   updatedAt: Date                                            │    │
│  │ }                                                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  PROBLEMS                                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ {                                                            │    │
│  │   _id: ObjectId,                                             │    │
│  │   title: "Two Sum",                                          │    │
│  │   slug: "two-sum",             // URL-friendly               │    │
│  │   description: "Given an...",  // Markdown                   │    │
│  │   difficulty: "Easy",          // Easy|Medium|Hard           │    │
│  │   defaultCode: {               // Starter templates          │    │
│  │     javascript: "function twoSum...",                        │    │
│  │     python: "def twoSum...",                                 │    │
│  │     cpp: "vector<int> twoSum..."                             │    │
│  │   },                                                         │    │
│  │   fullBoilerplate: {           // Complete wrappers          │    │
│  │     javascript: "const input = ...\n##USER_CODE##\n...",     │    │
│  │     python: "import sys\n##USER_CODE##\n..."                 │    │
│  │   },                                                         │    │
│  │   testCases: [                                               │    │
│  │     { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },    │    │
│  │     { input: "[3,3]\n6", expectedOutput: "[0,1]", hidden: true } │ │
│  │   ],                                                         │    │
│  │   tags: ["Array", "Hash Table"],                             │    │
│  │   totalSubmissions: 150,                                     │    │
│  │   acceptedSubmissions: 89                                    │    │
│  │ }                                                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  SUBMISSIONS                                                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ {                                                            │    │
│  │   _id: ObjectId,                                             │    │
│  │   userId: ObjectId,            // Ref to User                │    │
│  │   problemId: ObjectId,         // Ref to Problem             │    │
│  │   code: "function twoSum...",  // User's submitted code      │    │
│  │   language: "javascript",                                    │    │
│  │   status: "AC",                // Overall verdict            │    │
│  │   testCaseResults: [                                         │    │
│  │     {                                                        │    │
│  │       testCaseIndex: 0,                                      │    │
│  │       status: "AC",                                          │    │
│  │       time: 15,                // milliseconds               │    │
│  │       memory: 1024,            // KB                         │    │
│  │       stdout: "[0,1]",                                       │    │
│  │       stderr: ""                                             │    │
│  │     }                                                        │    │
│  │   ],                                                         │    │
│  │   totalTime: 45,               // Sum of all test times      │    │
│  │   totalMemory: 1024,           // Max memory used            │    │
│  │   createdAt: Date,                                           │    │
│  │   completedAt: Date                                          │    │
│  │ }                                                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Problems

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/problems` | List all problems | No |
| GET | `/api/problems/:slug` | Get problem details | No |

### Submissions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/submissions` | Submit code | Yes |
| GET | `/api/submissions/:id` | Get submission details | Yes |
| GET | `/api/submissions/user/all` | Get user's submissions | Yes |

---

## Common Errors & Solutions

### 1. Runtime Error (RE) on All Submissions

**Symptom:** Every submission shows "RE" regardless of code correctness.

**Cause:** The code execution is failing before the user's code runs.

**Common Reasons:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ REASON 1: Boilerplate stdin parsing error                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Problem: The boilerplate expects specific input format              │
│                                                                      │
│ BAD:  fs.readFileSync(0) on Windows (doesn't work)                  │
│ GOOD: Use readline module or process.stdin                          │
│                                                                      │
│ Solution: Update fullBoilerplate to use cross-platform stdin:       │
│                                                                      │
│ const input = require('fs').readFileSync(0, 'utf-8');               │
│ // This reads from stdin on Unix/Linux                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ REASON 2: stdin not being piped correctly                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Problem: child.stdin.write() not working as expected                │
│                                                                      │
│ Solution: Use spawn with proper stdin handling:                     │
│                                                                      │
│ child.stdin.write(testInput);                                       │
│ child.stdin.end();  // IMPORTANT: Signal end of input              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ REASON 3: Newline format mismatch                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Problem: Input uses \r\n but code expects \n                        │
│                                                                      │
│ Solution: Normalize line endings:                                   │
│                                                                      │
│ const input = stdin.replace(/\r\n/g, '\n').trim();                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Debug Steps:**
```bash
# 1. Check backend logs for actual error
# Look for "Stderr:" output in console

# 2. Test code manually
echo '[2,7,11,15]
9' | node /tmp/test.js

# 3. Add logging to judge0.js
console.log('Full code:', fullCode);
console.log('Stdin:', stdin);
console.log('Stdout:', stdout);
console.log('Stderr:', stderr);
```

### 2. Submission Stuck on "Running"

**Symptom:** Submission shows "Running" forever.

**Causes:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ CAUSE 1: Judge0 not running                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ If using Judge0, ensure Docker containers are running:              │
│                                                                      │
│ $ docker-compose ps                                                  │
│ # Should show judge0-server, judge0-workers, redis, judge0-db       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CAUSE 2: Webhook not receiving callbacks                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Judge0 can't reach your webhook server:                             │
│                                                                      │
│ - Is submission-webhook running on port 4000?                       │
│ - Is the callback URL correct?                                      │
│ - Network/firewall blocking connections?                            │
│                                                                      │
│ Solution: Use local execution instead (doesn't need webhooks)       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CAUSE 3: Infinite loop in user code                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ User's code has while(true) or similar                              │
│                                                                      │
│ Solution: Add timeout to child process:                             │
│                                                                      │
│ spawn('node', [file], { timeout: 5000 });  // 5 second limit        │
│                                                                      │
│ Also set timer to kill process:                                     │
│                                                                      │
│ const timer = setTimeout(() => child.kill('SIGKILL'), 5000);        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. MongoDB Connection Errors

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or if using Docker
docker-compose up -d mongodb

# Check connection string
# Should be: mongodb://127.0.0.1:27017/algorithmic_arena
```

### 4. NPM Cache Corruption

**Error:** `ENOENT: no such file or directory... sha512...`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove the cache directory
rm -rf ~/.npm/_cacache

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 5. Tailwind CSS Not Working

**Symptom:** Styles not applied, everything unstyled.

**Checklist:**
```bash
# 1. Check Tailwind version (use v3, not v4)
npm list tailwindcss
# Should show tailwindcss@3.x.x

# 2. Verify config files exist
ls tailwind.config.js postcss.config.js

# 3. Check App.css has Tailwind directives
head -3 src/App.css
# Should show:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 4. Restart Vite
npm run dev
```

### 6. CORS Errors

**Error:** `Access-Control-Allow-Origin` error in browser console.

**Solution:** Ensure backend has CORS enabled:
```javascript
// backend/server.js
import cors from 'cors';
app.use(cors());  // Allow all origins in development
```

### 7. 401 Unauthorized

**Symptom:** API calls return 401 even when logged in.

**Checklist:**
```javascript
// 1. Check token in localStorage
console.log(localStorage.getItem('token'));

// 2. Check request headers
// In browser DevTools > Network > Request Headers
// Should have: Authorization: Bearer <token>

// 3. Verify token hasn't expired
// JWT tokens expire after 7 days (configured in auth.js)

// 4. Check secret key matches
// Backend uses 'your-secret-key-12345'
// If changed, old tokens become invalid
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+ 
- MongoDB 6.0+
- Python 3.8+ (for Python code execution)
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/algorithmic-arena.git
cd algorithmic-arena

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Start MongoDB (if not running)
sudo systemctl start mongod

# 4. Terminal 1: Start Backend
cd backend
npm install
npm run seed
npm run dev

# 5. Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# 6. Open browser
# http://localhost:3000
```

### Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

```bash
# Backend
cd backend
npm install
npm run seed  # Populate database with sample problems
npm run dev   # Start on port 5000

# Frontend
cd frontend
npm install
npm run dev   # Start on port 3000

# Webhook (only needed for Judge0)
cd submission-webhook
npm install
npm run dev   # Start on port 4000
```

</details>

### Docker Setup (Optional)

```bash
# Start all services
docker-compose up -d

# This starts:
# - MongoDB on port 27017
# - Redis on port 6379
# - Judge0 API on port 2358
```

---

