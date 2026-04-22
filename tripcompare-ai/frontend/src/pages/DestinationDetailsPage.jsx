import { Link, Navigate, useParams } from "react-router-dom";
import { getDestinationBySlug } from "../data/destinationsData";

const DestinationDetailsPage = () => {
  const { name } = useParams();
  const destination = getDestinationBySlug(name || "");

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  return (
    <main className="pb-12">
      <section className="relative min-h-[60vh] overflow-hidden md:rounded-b-[2.5rem]">
        <img src={destination.image} alt={destination.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[60vh] w-full max-w-7xl items-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Destination Details</p>
            <h1 className="mt-3 font-display text-5xl font-semibold text-white sm:text-6xl">{destination.name}</h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">{destination.country}</p>
            <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{destination.description}</p>
            <p className="mt-4 text-lg font-semibold text-emerald-300">Starting from INR {destination.price.toLocaleString("en-IN")}</p>
            <Link
              to="/destinations"
              className="mt-6 inline-block rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Back to Destinations
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        <article className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-white">Famous Food</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
            {destination.food.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-white">Famous Places</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
            {destination.places.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
};

export default DestinationDetailsPage;
