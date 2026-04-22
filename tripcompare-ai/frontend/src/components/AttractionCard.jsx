const AttractionCard = ({ place }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-soft transition hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden">
        <img src={place.image} alt={place.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{place.name}</h3>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-200">
            ⭐ {Number(place.rating || 4.3).toFixed(1)}
          </span>
        </div>
        <p className="mt-2 text-sm text-white/75">{place.description}</p>
        {place.address ? <p className="mt-2 text-xs text-white/60">{place.address}</p> : null}
      </div>
    </article>
  );
};

export default AttractionCard;
