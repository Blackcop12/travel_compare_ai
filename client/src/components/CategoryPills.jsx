const categories = ["Food", "Shopping", "Rides"];

const CategoryPills = ({ selectedCategory, onSelect }) => {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category === selectedCategory ? "" : category)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            selectedCategory === category
              ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
              : "border-slate-300/70 bg-white/60 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
