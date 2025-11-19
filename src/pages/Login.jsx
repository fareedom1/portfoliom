// Login/sign-up page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/client.js";

export default function Login() {
    // Form input state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    // Login/signup toggle
    const [isLogin, setIsLogin] = useState(true);
    // Status message for feedback/errors
    const [status, setStatus] = useState("");
    // Loading state disables button and shows spinner if desired
    const [loading, setLoading] = useState(false);
    // Navigation hook to redirect on success
    const navigate = useNavigate();

    // Form submission handler for login/sign-up
    const handleAuth = async (e) => {
        e.preventDefault();
        setStatus(""); // Clear any previous status
        setLoading(true);

        if (isLogin) {
            // Log in an existing user
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setStatus("Error logging in: " + error.message);
            } else {
                setStatus("Logged in successfully!");
                navigate("/feed"); // redirect after log in
            }
        } else {
            // Sign up a new user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username } },
            });
            if (error) {
                setStatus("Error signing up: " + error.message);
            } else if (data.user) {
                // Insert profile row for the new user
                await supabase.from("profiles").insert([{
                    id: data.user.id,
                    username: username,
                    email: email,
                    created_at: new Date(),
                }]);
                setStatus("Signed up successfully!");
                navigate("/feed"); // redirect after sign up
            }
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <h1 className="login-header">
                {isLogin ? "Login to Portfoliom" : "Sign Up for Portfoliom"}
            </h1>

            {/* Toggle between Log In and Sign Up modes */}
            <div className="auth-toggle">
                <button
                    className={`login-btn${isLogin ? " active" : ""}`}
                    onClick={() => setIsLogin(true)}
                    disabled={loading}
                >
                    Log In
                </button>
                <button
                    className={`signup-btn${!isLogin ? " active" : ""}`}
                    onClick={() => setIsLogin(false)}
                    disabled={loading}
                >
                    Sign Up
                </button>
            </div>

            <form className="login-form" onSubmit={handleAuth}>
                {/* Username field only for sign up */}
                {!isLogin && (
                    <>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="form-input"
                        />
                    </>
                )}
                {/* Email field */}
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="form-input"
                />

                {/* Password field */}
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="form-input"
                />

                {/* Feedback/status area */}
                {status && <div className="form-status">{status}</div>}

                {/* Submit button - disabled during loading */}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
                </button>
            </form>
        </div>
    );
}
