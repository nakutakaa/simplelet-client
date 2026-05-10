// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              SimpleLet
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-blue-600"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/listing/:id"
              element={<div>Listing Detail - Coming Soon</div>}
            />
            <Route path="/login" element={<div>Login - Coming Soon</div>} />
            <Route
              path="/register"
              element={<div>Register - Coming Soon</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
