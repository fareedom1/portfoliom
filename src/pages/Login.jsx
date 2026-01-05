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
