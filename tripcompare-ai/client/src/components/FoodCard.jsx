const FoodCard = ({ food }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-soft transition hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden">
        <img src={food.image} alt={food.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{food.name}</h3>
          {food.rating ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-200">
              ⭐ {Number(food.rating).toFixed(1)}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-white/75">{food.description || "Popular local dining experience"}</p>
        {food.address ? <p className="mt-2 text-xs text-white/60">{food.address}</p> : null}
      </div>
    </article>
  );
};

export default FoodCard;
