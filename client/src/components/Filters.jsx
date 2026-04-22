const Filters = ({ filters, onChange }) => {
  return (
    <section className="mt-8 grid gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-panel dark:border-slate-700 dark:bg-slate-900/60 md:grid-cols-3">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Max Price
        <input
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
      </label>

      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Min Rating
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) => onChange("minRating", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
      </label>

      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Sort by
        <select
          value={filters.sortBy}
          onChange={(e) => onChange("sortBy", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="price">Price (Low to High)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
      </label>
    </section>
  );
};

export default Filters;
