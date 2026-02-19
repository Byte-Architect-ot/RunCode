import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Submissions from './pages/Submissions'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problem/:slug" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
        <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App