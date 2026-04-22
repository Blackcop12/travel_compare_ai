const cityList = ["Mumbai", "Pune", "Goa", "Manali", "Delhi", "Jaipur", "Bangalore", "Chennai", "Hyderabad"];

const TripForm = ({ form, loading, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      <input
        name="from"
        list="city-list"
        placeholder="Pickup Location"
        value={form.from}
        onChange={onChange}
        className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
        required
      />
      <input
        name="to"
        list="city-list"
        placeholder="Drop Location"
        value={form.to}
        onChange={onChange}
        className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
        required
      />
      <input
        type="date"
        name="travelDate"
        value={form.travelDate}
        onChange={onChange}
        className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
        required
      />
      <input
        type="number"
        min="0"
        name="budget"
        value={form.budget}
        onChange={onChange}
        placeholder="Budget (optional)"
        className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2.5 font-bold text-black transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Trip Plan"}
      </button>
      <datalist id="city-list">
        {cityList.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
    </form>
  );
};

export default TripForm;
