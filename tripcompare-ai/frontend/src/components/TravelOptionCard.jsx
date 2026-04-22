const TravelOptionCard = ({ option, isRecommendedCheapest, isRecommendedFastest, isSelected, onSelectMode }) => {
  return (
    <article
      className={`glass-card fade-in cursor-pointer rounded-2xl p-4 shadow-soft transition ${
        isSelected ? "ring-2 ring-emerald-300" : "ring-1 ring-white/20"
      }`}
      onClick={() => onSelectMode?.(option.mode)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectMode?.(option.mode);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{option.title}</h3>
        <div className="flex gap-2 text-xs font-bold uppercase tracking-wide">
          {isRecommendedCheapest ? <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">Cheapest</span> : null}
          {isRecommendedFastest ? <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">Fastest</span> : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-black/35 p-3 ring-1 ring-white/10">
          <p className="text-white/65">Estimated Cost</p>
          <p className="text-xl font-extrabold text-emerald-300">INR {option.totalCost}</p>
        </div>
        <div className="rounded-xl bg-black/35 p-3 ring-1 ring-white/10">
          <p className="text-white/65">Travel Time</p>
          <p className="text-xl font-extrabold text-white">{Math.round(option.durationMinutes / 60)}h {option.durationMinutes % 60}m</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-black/35 p-3 ring-1 ring-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">Cost Breakdown</p>
        <div className="mt-2 space-y-1 text-sm text-white/80">
          {Object.entries(option.costBreakdown || {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-semibold text-white">
                {typeof value === "number" ? `INR ${value}` : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default TravelOptionCard;
