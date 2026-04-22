import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get("/trip/history");
        setHistory(data.trips || []);
      } catch (_error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">
      <section className="glass-card fade-in rounded-3xl p-5 shadow-soft sm:p-6">
        <h1 className="font-display text-3xl text-slate-700 sm:text-4xl">Your Profile</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Account: <span className="font-semibold text-sky-600">{user?.name}</span> ({user?.email})
        </p>
      </section>

      <section className="glass-card fade-in rounded-3xl p-5 shadow-soft">
        <h2 className="font-display text-2xl text-slate-700">Trip History</h2>
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-sm text-slate-600">Loading trips...</p> : null}
          {!loading && history.length
            ? history.map((trip) => (
                <article key={trip._id} className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-200">
                  <p className="font-bold text-slate-700">
                    {trip.source} to {trip.destination}
                  </p>
                  <p className="text-sm text-slate-600">
                    {trip.days} days, {trip.travelers} travelers, mode: {trip.selectedMode.toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-sky-600">Total: INR {trip.totalTripCost}</p>
                </article>
              ))
            : null}
          {!loading && !history.length ? <p className="text-sm text-slate-600">No trips planned yet.</p> : null}
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;