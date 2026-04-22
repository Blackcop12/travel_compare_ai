import { Clock3, Star, ExternalLink } from "lucide-react";

const ComparisonCard = ({ item, onSave }) => {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-panel transition duration-300 hover:-translate-y-1 ${
        item.isCheapest
          ? "border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-900/70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">{item.intent}</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.platform}</h3>
        </div>
        {item.isCheapest && (
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">Best Price</span>
        )}
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">Rs {item.price}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.name}</p>

      <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1"><Star size={16} className="text-amber-400" /> {item.rating}</span>
        <span className="inline-flex items-center gap-1"><Clock3 size={16} /> {item.etaMinutes} mins</span>
      </div>

      <div className="mt-5 flex gap-2">
        <a
          href={item.redirectUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950"
        >
          {item.intent === "ride" ? "Book Now" : "Buy Now"} <ExternalLink size={14} />
        </a>
        <button
          type="button"
          onClick={() => onSave(item)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Save
        </button>
      </div>
    </article>
  );
};

export default ComparisonCard;
