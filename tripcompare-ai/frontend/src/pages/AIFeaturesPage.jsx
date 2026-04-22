import { useState } from "react";
import CarLoader from "../components/CarLoader";
import TripForm from "../components/TripForm";
import TripResults from "../components/TripResults";
import api from "../services/api";

const AIFeaturesPage = () => {
  const [form, setForm] = useState({
    from: "Mumbai",
    to: "Goa",
    travelDate: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        from: form.from,
        to: form.to,
        travelDate: form.travelDate,
        budget: form.budget ? Number(form.budget) : null,
      };

      const { data } = await api.post("/generate-trip", payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate AI trip plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">AI Features</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">AI Travel Compare & Trip Planner</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
          Generate a smart trip plan with itinerary, transport price comparison, nearby attractions, famous food, and
          local cost estimates in one click.
        </p>

        <TripForm form={form} loading={loading} onChange={handleChange} onSubmit={handleGenerate} />

        {error ? <p className="mt-4 text-sm font-semibold text-red-400">{error}</p> : null}
        {loading ? <CarLoader /> : null}
      </section>

      <TripResults result={result} />
    </main>
  );
};

export default AIFeaturesPage;
