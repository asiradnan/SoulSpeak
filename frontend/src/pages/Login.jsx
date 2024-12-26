import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:5000/login", formData);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
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
            const response = await axios.post("http://localhost:5000/reset-password", { email: resetEmail });
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
        <div className="relative">
            <div className="max-w-md mx-auto mt-10 p-8 bg-white/90 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center text-slate-700">Welcome Back</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-sage-500 text-white py-3 rounded-lg hover:bg-sage-600 transition-all duration-300 ease-in-out"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="w-full text-sage-600 text-sm hover:text-sage-700 transition-all duration-300 ease-in-out"
                    >
                        Forgot Password?
                    </button>
                </form>
            </div>

            {/* Email Popup Modal */}
            {showEmailPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4 text-slate-700">Reset Password</h3>
                        <p className="text-slate-600 mb-4">Enter your email address to receive a password reset link.</p>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleResetSubmit}
                                className="flex-1 bg-sage-500 text-white py-2 rounded-lg hover:bg-sage-600 transition-all duration-300 ease-in-out"
                            >
                                Send Reset Link
                            </button>
                            <button
                                onClick={() => setShowEmailPopup(false)}
                                className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-all duration-300 ease-in-out"
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
