const { runIntelligentSearch, getSuggestions, filterAndSort } = require("../services/searchEngine");

exports.search = async (req, res) => {
  try {
    const { query, source = "", destination = "", filters = {} } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const response = await runIntelligentSearch({
      userId: req.user?._id,
      query: query.trim(),
      source: source.trim(),
      destination: destination.trim(),
      filters,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.compare = async (req, res) => {
  try {
    const { items = [], sortBy = "price", maxPrice, minRating } = req.body;
    const compared = filterAndSort(items, { sortBy, maxPrice, minRating });
    const cheapestPrice = compared.length ? Math.min(...compared.map((item) => item.price)) : null;

    return res.status(200).json({
      total: compared.length,
      cheapestPrice,
      results: compared.map((item) => ({ ...item, isCheapest: item.price === cheapestPrice })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.suggestions = async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) {
      return res.status(200).json({ suggestions: [] });
    }

    const suggestions = await getSuggestions(q.trim());
    return res.status(200).json({ suggestions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
