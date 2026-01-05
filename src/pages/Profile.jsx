// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";

/**
 * Simple profile viewing/editing page for current user.
 */
export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);

  async function getProfile() {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  }

  return (
    <div className="max-w-[780px] mx-auto mt-12 p-8 pt-7 rounded-2xl bg-[#0b1020] border border-slate-700/30 shadow-[var(--shadow-soft)] max-md:p-6 max-md:mx-4">
      <h2 className="mt-0 mb-6 text-3xl font-bold">My Profile</h2>
      {profile ? (
        <div className="flex flex-col gap-3">
          <p className="text-lg text-gray-300"><span className="font-semibold text-gray-400">Username:</span> {profile.username}</p>
          <p className="text-lg text-gray-300"><span className="font-semibold text-gray-400">Email:</span> {profile.email}</p>
        </div>
      ) : <div className="text-gray-400">Loading...</div>}
    </div>
  );
}
