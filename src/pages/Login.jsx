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

    // Google Login handler
    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/feed', // Redirect to feed after login
            },
        });
        if (error) {
            setStatus("Error with Google Login: " + error.message);
            setLoading(false);
        }
        // Note: No need to set loading(false) on success because of redirect
    };

    return (
        <div className="w-1/2 mt-20 mx-auto px-32 py-10 rounded-3xl bg-[radial-gradient(circle_at_top,#1f2937_0%,#020617_70%)] border border-slate-400/30 shadow-[var(--shadow-soft)] max-md:mt-10 max-md:px-6 max-md:w-[90%]">
            <h1 className="text-4xl mb-4 text-center">
                {isLogin ? "Login to Portfoliom" : "Sign Up for Portfoliom"}
            </h1>

            {/* Toggle between Log In and Sign Up modes */}
            <div className="flex justify-center gap-2 mb-6">
                <button
                    className={`rounded-full border border-transparent px-5 py-1.5 cursor-pointer text-base transition-colors ${isLogin ? "bg-sky-500 text-slate-950" : "bg-transparent text-gray-400 hover:text-gray-200"}`}
                    onClick={() => setIsLogin(true)}
                    disabled={loading}
                >
                    Log In
                </button>
                <button
                    className={`rounded-full border border-transparent px-5 py-1.5 cursor-pointer text-base transition-colors ${!isLogin ? "bg-sky-500 text-slate-950" : "bg-transparent text-gray-400 hover:text-gray-200"}`}
                    onClick={() => setIsLogin(false)}
                    disabled={loading}
                >
                    Sign Up
                </button>
            </div>

            {/* Google Sign In Button */}
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full mb-4 flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-medium py-2.5 px-4 rounded-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 cursor-pointer"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[rgb(21,29,48)] text-gray-400">Or continue with email</span>
                </div>
            </div>

            <form className="flex flex-col gap-3 text-sm" onSubmit={handleAuth}>
                {/* Username field only for sign up */}
                {!isLogin && (
                    <>
                        <label htmlFor="username" className="text-gray-400 text-xs">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-gray-200 outline-none text-sm focus:border-sky-500"
                        />
                    </>
                )}
                {/* Email field */}
                <label htmlFor="email" className="text-gray-400 text-xs">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-gray-200 outline-none text-sm focus:border-sky-500"
                />

                {/* Password field */}
                <label htmlFor="password" className="text-gray-400 text-xs">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-gray-200 outline-none text-sm focus:border-sky-500"
                />

                {/* Feedback/status area */}
                {status && <div className="mt-1 text-xs text-red-400">{status}</div>}

                {/* Submit button - disabled during loading */}
                <button type="submit" className="mt-3 border-none rounded-full px-5 py-2.5 bg-gradient-to-br from-green-500 to-green-400 text-green-950 font-semibold cursor-pointer disabled:opacity-50 hover:brightness-105 transition-all" disabled={loading}>
                    {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
                </button>
            </form>
        </div>
    );
}
