import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(user);
  const [name, setName] = useState("");
  const [statusText, setStatusText] = useState("");

  const fetchProfile = async () => {
    const { data } = await api.get("/api/user/profile");
    setProfile(data.user);
    setName(data.user?.name || "");
  };

  useEffect(() => {
    fetchProfile();
    refreshProfile();
  }, []);

  const removeSavedItem = async (itemId) => {
    await api.delete(`/api/user/wishlist/${itemId}`);
    fetchProfile();
  };

  const updateProfile = async () => {
    try {
      setStatusText("");
      const { data } = await api.put("/api/user/profile", { name });
      setProfile(data.user);
      await refreshProfile();
      setStatusText("Profile updated");
    } catch (_error) {
      setStatusText("Failed to update profile");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">Track profile, history, and saved deals.</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={updateProfile}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950"
          >
            Update
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-300">Email: {profile?.email}</p>
        {statusText && <p className="mt-2 text-sm text-emerald-500">{statusText}</p>}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Search History</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {profile?.searchHistory?.length ? (
              profile.searchHistory.map((entry) => (
                <li key={entry._id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{entry.query}</span>
                  <p className="text-xs opacity-70">{new Date(entry.createdAt).toLocaleString()}</p>
                </li>
              ))
            ) : (
              <li>No searches yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Saved Items</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {profile?.wishlist?.length ? (
              profile.wishlist.map((item) => (
                <li key={item._id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{item.name} on {item.platform}</p>
                      <p>Rs {item.price} | Rating {item.rating}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSavedItem(item._id)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li>No saved items yet.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
