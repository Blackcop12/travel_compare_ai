import { useMemo, useState } from "react";
import api from "../services/api";
import CostBreakdownCard from "../components/CostBreakdownCard";
import CarLoader from "../components/CarLoader";
import ItineraryBoard from "../components/ItineraryBoard";
import RouteMapCard from "../components/RouteMapCard";
import SuggestionsGrid from "../components/SuggestionsGrid";
import TravelOptionCard from "../components/TravelOptionCard";

const cityOptions = ["Mumbai", "Pune", "Delhi", "Jaipur", "Bangalore", "Chennai", "Goa", "Hyderabad"];

const DashboardPage = () => {
  const [form, setForm] = useState({
    source: "Pune",
    destination: "Mumbai",
    days: 3,
    travelers: 2,
    selectedMode: "",
  });
  const [result, setResult] = useState(null);
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelError, setHotelError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const visibleHotels = nearbyHotels.length ? nearbyHotels : result?.suggestions?.hotels || [];

  const mapDirectionLink = useMemo(() => {
    if (!form.source || !form.destination) {
      return "#";
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.source)}&destination=${encodeURIComponent(form.destination)}`;
  }, [form.source, form.destination]);

  const effectiveDashboard = useMemo(() => {
    if (!result?.dashboard || !visibleHotels.length) {
      return result?.dashboard || null;
    }

    const selectedHotel = visibleHotels.find((hotel) => hotel.name === selectedHotelName) || visibleHotels[0];

    const stayNights = Math.max(1, Number(form.days) - 1);
    const selectedHotelMidPrice = Math.round(
      (selectedHotel.priceRangePerNight[0] + selectedHotel.priceRangePerNight[1]) / 2
    );
    const recalculatedStay = selectedHotelMidPrice * stayNights;

    const recalculatedTotal = result.dashboard.breakdown.travel + result.dashboard.breakdown.food + recalculatedStay;

    return {
      ...result.dashboard,
      selectedHotelName: selectedHotel.name,
      totalTripCost: recalculatedTotal,
      breakdown: {
        ...result.dashboard.breakdown,
        stay: recalculatedStay,
      },
    };
  }, [result, selectedHotelName, form.days, visibleHotels]);

  const handleInputChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const fetchNearbyHotels = async () => {
    const destination = form.destination?.trim();

    if (!destination) {
      setHotelError("Please enter destination first.");
      return;
    }

    setHotelError("");
    setHotelLoading(true);

    try {
      const { data } = await api.get("/hotels", {
        params: { location: destination },
      });

      const normalizedHotels = (data.hotels || []).map((hotel) => ({
        name: hotel.name,
        priceRangePerNight: [hotel.price, hotel.price],
        rating: hotel.rating,
        image: hotel.image,
      }));

      setNearbyHotels(normalizedHotels);
      setSelectedHotelName((prev) => {
        if (!normalizedHotels.length) {
          return "";
        }

        const names = normalizedHotels.map((hotel) => hotel.name);
        return prev && names.includes(prev) ? prev : normalizedHotels[0].name;
      });

      if (!normalizedHotels.length) {
        setHotelError(`No nearby hotels found for ${destination}.`);
      }
    } catch (err) {
      setHotelError(err.response?.data?.message || "Could not fetch nearby hotels.");
    } finally {
      setHotelLoading(false);
    }
  };

  const requestPlan = async (modeOverride = null) => {
    const payload = {
      ...form,
      selectedMode: modeOverride ?? form.selectedMode,
      days: Number(form.days),
      travelers: Number(form.travelers),
    };

    const { data } = await api.post("/trip/plan", payload);
    setResult(data);
    setNearbyHotels([]);
    setHotelError("");
    setSelectedHotelName((prev) => {
      const hotels = data?.suggestions?.hotels || [];
      if (!hotels.length) {
        return "";
      }

      const names = hotels.map((hotel) => hotel.name);
      if (prev && names.includes(prev)) {
        return prev;
      }

      return hotels[0].name;
    });

    if (modeOverride !== null) {
      setForm((prev) => ({ ...prev, selectedMode: modeOverride }));
    }
  };

  const handlePlan = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPlan();
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate trip plan");
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelect = async (mode) => {
    setError("");
    setLoading(true);

    try {
      await requestPlan(mode);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update mode pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">
      <section className="glass-card fade-in rounded-3xl p-5 shadow-soft sm:p-6">
        <h1 className="font-display text-3xl text-white sm:text-4xl">Smart Travel Planner + Cost Comparison</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
          Compare car, bus, train, and cab. Get cheapest and fastest recommendation, place and food suggestions,
          hotel ranges, and a day-wise itinerary in one dashboard.
        </p>

        <form onSubmit={handlePlan} className="mt-5 grid gap-3 md:grid-cols-5">
          <input
            name="source"
            value={form.source}
            onChange={handleInputChange}
            placeholder="Source"
            list="tripcompare-cities"
            className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
            required
          />
          <input
            name="destination"
            value={form.destination}
            onChange={handleInputChange}
            placeholder="Destination"
            list="tripcompare-cities"
            className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
            required
          />
          <datalist id="tripcompare-cities">
            {cityOptions.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <input
            type="number"
            min="1"
            max="14"
            name="days"
            value={form.days}
            onChange={handleInputChange}
            className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
          />
          <input
            type="number"
            min="1"
            max="10"
            name="travelers"
            value={form.travelers}
            onChange={handleInputChange}
            className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
          />
          <select
            name="selectedMode"
            value={form.selectedMode}
            onChange={handleInputChange}
            className="rounded-xl border border-white/20 bg-black/35 px-3 py-2.5 text-white placeholder:text-white/60 outline-none ring-emerald-300/60 focus:ring"
          >
            <option value="">Auto pick best</option>
            <option value="car">Self Drive Car</option>
            <option value="bus">Intercity Bus</option>
            <option value="train">Express Train</option>
            <option value="cab">Outstation Cab</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-400 px-4 py-2.5 font-bold text-black transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Planning..." : "Generate Plan"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <a
            href={mapDirectionLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-emerald-500/15 px-4 py-2 font-semibold text-white ring-1 ring-emerald-300/40"
          >
            Open route in Google Maps
          </a>
          {result?.route ? (
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 font-semibold text-white/90">
              Distance: {result.route.distanceKm} km ({result.route.distanceSource})
            </span>
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {loading ? <CarLoader /> : null}
      </section>

      {result ? (
        <section className="glass-card fade-in rounded-3xl p-5 shadow-soft">
          <h2 className="font-display text-2xl text-white">All Mode Prices</h2>
          <p className="mt-1 text-sm text-white/75">Quick comparison of bus, car, train, and cab costs.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {result.travel.options.map((option) => (
              <article
                key={`summary-${option.mode}`}
                className={`cursor-pointer rounded-xl bg-black/40 p-4 ring-1 transition ${
                  result.dashboard.selectedTravelMode === option.mode
                    ? "ring-emerald-300 shadow-md"
                    : "ring-white/20 hover:ring-emerald-300/60"
                }`}
                onClick={() => handleModeSelect(option.mode)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleModeSelect(option.mode);
                  }
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">{option.mode}</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-300">INR {option.totalCost}</p>
                <p className="mt-1 text-xs text-white/65">Click to apply this mode</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {result ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {result.travel.options.map((option) => (
            <TravelOptionCard
              key={option.mode}
              option={option}
              isRecommendedCheapest={result.travel.bestOption.cheapest === option.mode}
              isRecommendedFastest={result.travel.bestOption.fastest === option.mode}
              isSelected={result.dashboard.selectedTravelMode === option.mode}
              onSelectMode={handleModeSelect}
            />
          ))}
        </section>
      ) : null}

      <RouteMapCard
        source={form.source}
        destination={form.destination}
        viaStops={result?.route?.viaStops}
        distanceKm={result?.route?.distanceKm}
        distanceSource={result?.route?.distanceSource}
      />

      <CostBreakdownCard dashboard={effectiveDashboard} />
      <SuggestionsGrid
        suggestions={
          result?.suggestions
            ? {
                ...result.suggestions,
                hotels: visibleHotels,
              }
            : null
        }
        selectedHotelName={selectedHotelName}
        onSelectHotel={setSelectedHotelName}
        onLoadNearbyHotels={fetchNearbyHotels}
        hotelLoading={hotelLoading}
        hotelError={hotelError}
        destination={form.destination}
      />
      <ItineraryBoard itinerary={result?.itinerary} />
    </main>
  );
};

export default DashboardPage;
