import { Search } from "lucide-react";

const SearchBar = ({ query, setQuery, onSearch, isLoading }) => {
  return (
    <form
      onSubmit={onSearch}
      className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-300/80 bg-white/90 p-2 shadow-panel transition duration-300 dark:border-slate-700 dark:bg-slate-900/70"
    >
      <Search className="ml-2 text-slate-500" size={20} />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Vada Pav, iPhone, Cab, Grocery..."
        className="flex-1 bg-transparent px-1 py-2 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
      >
        {isLoading ? "Searching..." : "Compare"}
      </button>
    </form>
  );
};

export default SearchBar;
