const TransportOptionCard = ({ option, isCheapest }) => {
  return (
    <article
      className={`rounded-2xl border p-4 shadow-soft transition hover:-translate-y-1 ${
        isCheapest
          ? "border-emerald-300/70 bg-emerald-500/10 ring-2 ring-emerald-300/40"
          : "border-white/15 bg-black/35"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {option.icon}
          </span>
          <h3 className="text-lg font-semibold text-white">{option.label}</h3>
        </div>
        {isCheapest ? (
          <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-black">
            Best Option
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-2xl font-extrabold text-emerald-300">INR {option.price.toLocaleString("en-IN")}</p>
      <p className="mt-1 text-sm text-white/70">Duration: {option.duration}</p>
      {option.note ? <p className="mt-1 text-xs text-white/60">{option.note}</p> : null}
    </article>
  );
};

export default TransportOptionCard;
