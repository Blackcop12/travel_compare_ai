const HotelCard = ({ hotel }) => (
  <article className="card-rise rounded-2xl border border-sky-200 bg-white/85 p-3">
    <img src={hotel.image} alt={hotel.name} className="h-28 w-full rounded-xl object-cover" />
    <div className="mt-2">
      <h4 className="font-semibold text-slate-700">{hotel.name}</h4>
      <p className="text-xs text-slate-500">{hotel.location}</p>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-blue-600">INR {hotel.price}/day</span>
        <span className="text-amber-600">{hotel.rating} / 5</span>
      </div>
    </div>
  </article>
);

const PlaceCard = ({ place }) => (
  <article className="card-rise rounded-2xl border border-sky-200 bg-white/85 p-3">
    <h4 className="font-semibold text-slate-700">{place.name}</h4>
    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">{place.location}</p>
    <p className="mt-1 text-xs text-slate-600">{place.description}</p>
  </article>
);

const FoodCard = ({ food }) => (
  <article className="card-rise rounded-2xl border border-sky-200 bg-white/85 p-3">
    <h4 className="font-semibold text-slate-700">{food.name}</h4>
    <p className="mt-1 text-sm text-blue-600">Avg Cost: INR {food.averageCost || food.avgCostPerMeal}</p>
  </article>
);

const TravelCard = ({ option, cheapest }) => (
  <article
    className={`card-rise rounded-2xl border p-3 ${
      option.mode === cheapest ? "border-blue-400 bg-blue-50" : "border-sky-200 bg-white/85"
    }`}
  >
    <h4 className="font-semibold uppercase text-slate-700">{option.mode}</h4>
    <p className="mt-1 text-sm text-slate-600">Distance: {option.distanceKm} km</p>
    <p className="mt-1 text-sm text-blue-600">Total: INR {option.totalCost}</p>
  </article>
);

const AgentResultCards = ({ payload }) => {
  if (!payload?.results) {
    return null;
  }

  const { results } = payload;

  return (
    <div className="mt-3 space-y-3">
      {results.hotels?.length ? (
        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">Hotels</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.hotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.name} hotel={hotel} />
            ))}
          </div>
        </section>
      ) : null}

      {results.travel?.options?.length ? (
        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">Travel Costs</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {results.travel.options.map((option) => (
              <TravelCard key={option.mode} option={option} cheapest={results.travel.cheapest} />
            ))}
          </div>
        </section>
      ) : null}

      {results.places?.length ? (
        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">Places to Visit</p>
          {results.nearbyCities?.length ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {results.nearbyCities.map((city) => (
                <span key={city} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                  nearby {city}
                </span>
              ))}
            </div>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.places.map((place) => (
              <PlaceCard key={place._id || place.name} place={place} />
            ))}
          </div>
        </section>
      ) : null}

      {results.foods?.length ? (
        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">Food Picks</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.foods.map((food) => (
              <FoodCard key={food.name} food={food} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AgentResultCards;
