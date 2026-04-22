import { Clock3, Star } from "lucide-react";

const ResultCard = ({ result, isCheapest, onSave }) => {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-panel transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isCheapest
          ? "border-emerald-400 bg-emerald-400/10"
          : "border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-900/70"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Platform</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{result.platform}</h3>
        </div>
        {isCheapest && (
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">Cheapest</span>
        )}
      </div>

      <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">Rs {result.price}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <Star size={16} className="text-amber-400" /> {result.rating}
        </span>
        <span className="flex items-center gap-1">
          <Clock3 size={16} /> {result.deliveryTime} mins
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <a
          href={result.orderUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          Order Now
        </a>
        <button
          type="button"
          onClick={() => onSave(result)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Save
        </button>
      </div>
    </article>
  );
};

export default ResultCard;
