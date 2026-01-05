// src/pages/Feedback.jsx
import { useState } from "react";
import supabase from "../supabase/client.js";

/**
 * Lets users send feedback or contact support.
 */
export default function Feedback() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await supabase.from("feedback").insert([{ email, message, created_at: new Date() }]);
    setEmail("");
    setMessage("");
    setStatus("Thank you for your feedback!");
  }

  return (
    <div className="max-w-[560px] w-[90%] md:w-full mt-12 mx-auto p-8 rounded-2xl bg-[#0b1020] border border-slate-800 shadow-[var(--shadow-soft)]">
      <h2 className="mt-0 mb-4 text-2xl font-semibold">Send Feedback</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-gray-400 text-sm">Your Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500"
        />
        <label className="text-gray-400 text-sm">Your Message</label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 min-h-[100px]"
        />
        <button
          type="submit"
          className="mt-2 bg-sky-400 text-slate-950 font-semibold border-none rounded-full px-6 py-2 cursor-pointer transition hover:bg-sky-300 self-start"
        >
          Send
        </button>
      </form>
      {status && <div className="mt-3 text-sm text-green-300 font-medium">{status}</div>}
    </div>
  );
}
