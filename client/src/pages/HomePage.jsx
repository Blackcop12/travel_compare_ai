import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, ArrowRightLeft, Timer, ShoppingBag, Car } from "lucide-react";
import ComparisonCard from "../components/ComparisonCard";
import SearchSuggestionList from "../components/SearchSuggestionList";
import { api, compareItems, fetchSuggestions, intelligentSearch } from "../services/api";

const tabs = [
  {
    key: "ride",
    label: "Ride",
    title: "Ride Navigator",
    subtitle: "Compare Uber, Ola, and Rapido fares instantly",
    icon: Car,
    placeholder: "Search route or type cab from Pune to Mumbai",
  },
  {
    key: "food10",
    label: "Food 10 Min",
    title: "Food Blitz 10",
    subtitle: "Find the fastest food options in around 10 minutes",
    icon: Timer,
    placeholder: "Search vada pav, burger, biryani...",
  },
  {
    key: "longDelivery",
    label: "Long Delivery",
    title: "Market Horizon",
    subtitle: "Compare long-delivery shopping deals (Amazon, Flipkart, Meesho)",
    icon: ShoppingBag,
    placeholder: "Search laptop, phone, headphones...",
  },
];

const withTabIntentHint = (tabKey, value) => {
  if (tabKey === "ride") {
    return value.toLowerCase().includes("cab") ? value : `cab ${value}`;
  }
  return value;
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("ride");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [mapSource, setMapSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tabNote, setTabNote] = useState("");
  const [filters, setFilters] = useState({ maxPrice: "", minRating: "", sortBy: "price" });

  const activeTabMeta = useMemo(() => tabs.find((tab) => tab.key === activeTab), [activeTab]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const data = await fetchSuggestions(query);
        setSuggestions(data);
      } catch (_error) {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  const applyTabPostFilter = (tabKey, items) => {
    if (tabKey === "food10") {
      const rapidItems = items.filter((item) => item.etaMinutes <= 10);
      if (rapidItems.length) {
        setTabNote("Showing 10-minute food delivery options.");
        return rapidItems;
      }
      setTabNote("No strict 10-minute matches. Showing fastest available food options.");
      return [...items].sort((a, b) => a.etaMinutes - b.etaMinutes);
    }

    if (tabKey === "longDelivery") {
      const longItems = items.filter((item) => item.etaMinutes >= 1000);
      setTabNote("Showing long-delivery shopping options from major marketplaces.");
      return longItems.length ? longItems : items;
    }

    setTabNote("Showing best ride fare options for your route.");
    return items;
  };

  const runSearch = async () => {
    if (!query.trim()) {
      setError("Enter a query to search CompareX AI.");
      return;
    }

    const transformedQuery = withTabIntentHint(activeTab, query.trim());

    try {
      setIsLoading(true);
      setError("");
      const data = await intelligentSearch({
        query: transformedQuery,
        source,
        destination,
        filters: {
          maxPrice: filters.maxPrice || undefined,
          minRating: filters.minRating || undefined,
          sortBy: filters.sortBy,
        },
      });

      const normalizedResults = applyTabPostFilter(activeTab, data.results || []);
      setDistanceKm(data.distanceKm || null);
      setMapSource(data.mapSource || "");
      setResults(normalizedResults);
      setSuggestions([]);
    } catch (searchError) {
      setError(searchError.response?.data?.message || "Unable to fetch comparison results.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await runSearch();
  };

  const handleCompareSort = async (nextSort) => {
    const updatedFilters = { ...filters, sortBy: nextSort };
    setFilters(updatedFilters);
    if (!results.length) {
      return;
    }
    try {
      const data = await compareItems({
        items: results,
        sortBy: nextSort,
        maxPrice: updatedFilters.maxPrice || undefined,
        minRating: updatedFilters.minRating || undefined,
      });
      setResults(applyTabPostFilter(activeTab, data.results || []));
    } catch (_error) {
      // Keep old ordering when compare API fails.
    }
  };

  const handleFilterBlur = async () => {
    if (!results.length) return;
    try {
      const data = await compareItems({
        items: results,
        sortBy: filters.sortBy,
        maxPrice: filters.maxPrice || undefined,
        minRating: filters.minRating || undefined,
      });
      setResults(applyTabPostFilter(activeTab, data.results || []));
    } catch (_error) {
      // Keep existing cards if compare API is unavailable.
    }
  };

  const handleSave = async (item) => {
    try {
      await api.post("/api/user/wishlist", {
        item: {
          name: item.name,
          platform: item.platform,
          price: item.price,
          rating: item.rating,
          deliveryTime: item.etaMinutes,
          orderUrl: item.redirectUrl,
        },
      });
      alert(`${item.platform} deal saved to wishlist`);
    } catch (_error) {
      alert("Login first to save deals.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.22),transparent_30%)]" />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-floatIn">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-500">CompareX AI Search</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Search smarter. Compare faster.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Tab-based search built for rides, instant food, and long-delivery shopping.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setResults([]);
                  setError("");
                  setTabNote("");
                  setDistanceKm(null);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                    : "border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{activeTabMeta?.title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activeTabMeta?.subtitle}</p>

          <form onSubmit={handleSearch} className="relative mt-4">
            <div className="relative rounded-full border border-slate-300/80 bg-white/95 px-5 py-3 dark:border-slate-700 dark:bg-slate-950/80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={activeTabMeta?.placeholder}
                className="w-full bg-transparent pl-8 pr-2 text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Press Enter to search</p>
            <SearchSuggestionList
              suggestions={suggestions}
              onPick={(value) => {
                setQuery(value);
                setSuggestions([]);
              }}
            />
          </form>

          {activeTab === "ride" && (
            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="mb-1 inline-flex items-center gap-1"><MapPin size={14} /> Pickup</span>
                <input
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  placeholder="Pune"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="mb-1 inline-flex items-center gap-1"><ArrowRightLeft size={14} /> Destination</span>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Mumbai"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
            </div>
          )}
        </div>

        <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-panel dark:border-slate-700 dark:bg-slate-900/60">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Max Price
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                onBlur={handleFilterBlur}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Min Rating
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => setFilters((prev) => ({ ...prev, minRating: e.target.value }))}
                onBlur={handleFilterBlur}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sort By
              <select
                value={filters.sortBy}
                onChange={(event) => handleCompareSort(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </label>
          </div>
        </section>

        {tabNote && <p className="mx-auto mt-4 max-w-4xl text-sm text-cyan-700 dark:text-cyan-300">{tabNote}</p>}
        {error && <p className="mt-4 text-center text-sm font-medium text-rose-500">{error}</p>}

        {distanceKm && activeTab === "ride" && (
          <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3 text-sm text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300">
            <span>Estimated distance: {distanceKm} km</span>
            <span>Source: {mapSource || "simulated"}</span>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item, index) => (
            <div key={`${item.platform}-${index}`} className="animate-floatIn" style={{ animationDelay: `${index * 60}ms` }}>
              <ComparisonCard item={item} onSave={handleSave} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
