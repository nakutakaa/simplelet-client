// src/components/Layout.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-blue-600">
              SimpleLet
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 transition"
                  >
                    Logout
                  </button>
                  <span className="text-sm text-gray-500">👋 {user.name}</span>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          © 2024 SimpleLet. Find your next home.
        </div>
      </footer>
    </div>
  );
}

export default Layout;
