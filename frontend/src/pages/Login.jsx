import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            if (response.status === 200) {
                login(response.data.token);
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password.");
        }
    };

    const handleForgotPassword = async () => {
        setShowEmailPopup(true);
    };

    const handleResetSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { email: resetEmail });
            if (response.status === 200) {
                alert("Password reset email sent. Please check your inbox!");
                setShowEmailPopup(false);
                setResetEmail("");
            }
        } catch (error) {
            alert("Error sending reset email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-secondary-600">Sign in to continue your journey</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Sign In
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-secondary-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showEmailPopup && (
                <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-secondary-100">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                                Reset Password
                            </h3>
                            <p className="text-secondary-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>
                        
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg border border-secondary-200 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleResetSubmit}
                                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Send Link
                            </button>
                            <button
                                onClick={() => setShowEmailPopup(false)}
                                className="flex-1 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
