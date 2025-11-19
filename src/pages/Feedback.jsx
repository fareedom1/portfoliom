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
    <div className="feedback-page">
      <h2>Send Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>Your Email (optional)</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Your Message</label>
        <textarea required value={message} onChange={e => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      {status && <div className="feedback-status">{status}</div>}
    </div>
  );
}
