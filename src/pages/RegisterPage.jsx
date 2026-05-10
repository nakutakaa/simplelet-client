// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedToken, setSavedToken] = useState(null); // Add this

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(
      formData.name,
      formData.phone,
      formData.password,
    );

    if (result.success) {
      // Get token from localStorage after registration
      const token = localStorage.getItem("token");
      setSavedToken(token);

      // Send verification code
      await api.sendVerification(token);
      setStep(2);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.verifyPhone(savedToken, verificationCode);

    if (result.verified) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid verification code");
    }
    setLoading(false);
  };

  const resendCode = async () => {
    setLoading(true);
    await api.sendVerification(savedToken);
    setLoading(false);
    alert("Verification code resent!");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? "Create Account" : "Verify Your Phone"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+254712345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +254 for Kenya)
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create a password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="text-center mb-4">
              <p className="text-gray-600">
                We sent a 6-digit verification code to
              </p>
              <p className="font-semibold">{formData.phone}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Phone"}
            </button>

            <button
              type="button"
              onClick={resendCode}
              disabled={loading}
              className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Resend verification code
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
