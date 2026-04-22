const SearchSuggestionList = ({ suggestions, onPick }) => {
  if (!suggestions.length) {
    return null;
  }

  return (
    <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl dark:border-slate-700 dark:bg-slate-900/95">
      {suggestions.map((item) => (
        <li key={item}>
          <button
            type="button"
            onClick={() => onPick(item)}
            className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestionList;
