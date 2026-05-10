// src/pages/VerifyPhonePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function VerifyPhonePage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const result = await api.verificationStatus(token);
    setStatus(result);
    if (result.is_verified) {
      navigate("/dashboard");
    }
  };

  const sendCode = async () => {
    setLoading(true);
    const result = await api.sendVerification(token);
    if (result.message) {
      setCodeSent(true);
    } else if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.verifyPhone(token, verificationCode);

    if (result.verified) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid verification code");
    }
    setLoading(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (status?.is_verified) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify Your Phone
        </h2>

        <div className="text-center mb-6">
          <p className="text-gray-600">We need to verify your phone number:</p>
          <p className="font-semibold text-lg mt-2">{user?.phone}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!codeSent ? (
          <button
            onClick={sendCode}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter 6-digit code sent to your phone
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
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
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={sendCode}
              disabled={loading}
              className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Resend Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default VerifyPhonePage;
