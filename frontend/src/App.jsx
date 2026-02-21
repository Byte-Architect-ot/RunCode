import React from 'react';
import { Routes, Route } from 'react-router-dom';  // NO BrowserRouter here!
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';
import Contests from './pages/Contests';
import './App.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/problems" element={<Problems />} />
                {/* <Route path="/problems/:id" element={<ProblemDetail />} /> */}
                <Route path="/problems/:slug" element={<ProblemDetail />} />
                <Route path="/contests" element={<Contests />} />
                <Route 
                    path="/submissions" 
                    element={
                        <ProtectedRoute>
                            <Submissions />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </div>
    );
}

export default App;