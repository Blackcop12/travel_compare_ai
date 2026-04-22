const RouteMapCard = ({ source, destination, distanceKm, distanceSource, viaStops = [] }) => {
  if (!source || !destination) {
    return null;
  }

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(source)}+to+${encodeURIComponent(destination)}&output=embed`;

  return (
    <section className="glass-card fade-in rounded-3xl p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-white">Route Map</h2>
          <p className="mt-1 text-sm text-white/75">
            {source} to {destination}
            {distanceKm ? ` • ${distanceKm} km` : ""}
            {distanceSource ? ` (${distanceSource})` : ""}
          </p>
          {viaStops.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {viaStops.map((stop) => (
                <span key={stop} className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/40">
                  via {stop}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-300/40"
        >
          Open Full Map
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/15">
        <iframe
          title="Trip route map"
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0"
        />
      </div>
    </section>
  );
};

export default RouteMapCard;
