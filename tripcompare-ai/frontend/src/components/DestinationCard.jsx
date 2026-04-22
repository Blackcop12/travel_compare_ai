import { Link } from "react-router-dom";

const renderStars = (rating) => {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
};

const DestinationCard = ({ destination, index }) => {
  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-soft transition duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition duration-500 group-hover:from-black/75" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="inline-block rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">
          {destination.country}
        </p>
        <h3 className="text-2xl font-semibold text-white">{destination.name}</h3>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-emerald-300">INR {destination.price.toLocaleString("en-IN")}</p>
          <p className="text-sm text-white/85">{renderStars(destination.rating)} ({destination.rating})</p>
        </div>
        <Link
          to={`/destination/${destination.slug}`}
          className="mt-4 inline-block rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.03]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default DestinationCard;
