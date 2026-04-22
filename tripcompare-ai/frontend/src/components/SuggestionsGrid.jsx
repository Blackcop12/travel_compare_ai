const SuggestionsGrid = ({
  suggestions,
  selectedHotelName,
  onSelectHotel,
  onLoadNearbyHotels,
  hotelLoading,
  hotelError,
  destination,
}) => {
  if (!suggestions) {
    return null;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="glass-card fade-in rounded-2xl p-4">
        <h3 className="font-display text-xl text-white">Places to Visit</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {suggestions.places.map((place) => (
            <li key={place} className="rounded-lg bg-black/35 p-2 ring-1 ring-white/15">
              {place}
            </li>
          ))}
        </ul>
      </article>

      <article className="glass-card fade-in rounded-2xl p-4">
        <h3 className="font-display text-xl text-white">Food Picks</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {suggestions.foods.map((food) => (
            <li key={food.name} className="rounded-lg bg-black/35 p-2 ring-1 ring-white/15">
              {food.name} - approx INR {food.avgCostPerMeal}
            </li>
          ))}
        </ul>
      </article>

      <article className="glass-card fade-in rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl text-white">Hotels</h3>
          <button
            type="button"
            onClick={onLoadNearbyHotels}
            disabled={hotelLoading}
            className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/40 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hotelLoading ? "Loading..." : `Near ${destination || "destination"}`}
          </button>
        </div>
        <p className="mt-1 text-xs text-white/65">
          Click "Near {destination || "destination"}" to load nearby hotels, then click a hotel to apply its budget.
        </p>
        {hotelError ? <p className="mt-2 text-xs font-semibold text-amber-700">{hotelError}</p> : null}
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {suggestions.hotels.map((hotel) => (
            <li
              key={hotel.name}
              className={`cursor-pointer rounded-lg bg-black/35 p-2 ring-1 transition ${
                selectedHotelName === hotel.name ? "ring-emerald-300 shadow-sm" : "ring-white/15 hover:ring-emerald-300/60"
              }`}
              onClick={() => onSelectHotel?.(hotel.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectHotel?.(hotel.name);
                }
              }}
            >
              {hotel.name} - INR {hotel.priceRangePerNight[0]} to {hotel.priceRangePerNight[1]} / night
              {selectedHotelName === hotel.name ? (
                <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-200">Selected</span>
              ) : null}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default SuggestionsGrid;
