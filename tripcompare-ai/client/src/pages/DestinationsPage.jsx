import { useMemo, useState } from "react";
import DestinationCard from "../components/DestinationCard";
import { countries, destinations } from "../data/destinationsData";

const DestinationsPage = () => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((item) => {
      const matchesCountry = country === "All Countries" ? true : item.country === country;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.places.some((place) => place.toLowerCase().includes(query));

      return matchesCountry && matchesSearch;
    });
  }, [search, country]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Global Explorer</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Explore World Destinations</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
          Browse destinations country-wise and discover famous tourist places, local food, and travel highlights from
          around the world.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search city, country, or tourist place"
            className="rounded-xl border border-white/20 bg-black/35 px-4 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
          />
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="rounded-xl border border-white/20 bg-black/35 px-4 py-2.5 text-white outline-none ring-emerald-300/60 focus:ring"
          >
            {countries.map((countryName) => (
              <option key={countryName} value={countryName} className="bg-[#0d0f0f] text-white">
                {countryName}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-sm text-white/65">Showing {filteredDestinations.length} destinations</p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredDestinations.map((destination, index) => (
          <DestinationCard key={destination.slug} destination={destination} index={index} />
        ))}
      </section>
    </main>
  );
};

export default DestinationsPage;
