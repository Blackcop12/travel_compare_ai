import AttractionCard from "./AttractionCard";
import FoodCard from "./FoodCard";
import TransportOptionCard from "./TransportOptionCard";

const TripResults = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <>
      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Distance & Travel Time</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <p className="text-sm text-white/70">Distance</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{result.distance?.distance}</p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <p className="text-sm text-white/70">Travel Time</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{result.distance?.duration}</p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Transport Price Comparison</h2>
        <p className="mt-2 text-sm text-white/75">Cheapest option is highlighted for quick decision-making.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(result.transportOptions || []).map((option) => (
            <TransportOptionCard key={option.mode} option={option} isCheapest={result.cheapestMode === option.mode} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Flights List</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(result.flights || []).map((flight, index) => (
            <article key={`${flight.airline}-${index}`} className="rounded-2xl border border-white/15 bg-black/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{flight.airline}</h3>
                <p className="text-xl font-extrabold text-emerald-300">INR {Number(flight.price || 0).toLocaleString("en-IN")}</p>
              </div>
              <p className="mt-1 text-sm text-white/75">Duration: {flight.duration}</p>
              <p className="mt-1 text-xs text-white/60">Departure: {flight.departure}</p>
              <p className="text-xs text-white/60">Arrival: {flight.arrival}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Tourist Places</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(result.places || []).map((place) => (
            <AttractionCard key={place.name} place={place} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Food / Restaurants</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(result.food || []).map((item) => (
            <FoodCard key={item.name} food={item} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">AI Trip Plan</h2>
        <p className="mt-2 text-sm text-white/75">Best Time: {result.aiPlan?.bestTime}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <h3 className="text-lg font-semibold text-white">Day-wise Itinerary</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              {(result.aiPlan?.itinerary || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <h3 className="text-lg font-semibold text-white">Smart Tips</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              {(result.aiPlan?.tips || []).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-white">Parking & Local Costs</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <p className="text-sm text-white/70">Parking</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{result.costs?.parking}</p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <p className="text-sm text-white/70">Local Transport</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{result.costs?.localTransport}</p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-black/35 p-4">
            <p className="text-sm text-white/70">Food Budget</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{result.costs?.foodBudget}</p>
          </article>
        </div>
      </section>
    </>
  );
};

export default TripResults;
