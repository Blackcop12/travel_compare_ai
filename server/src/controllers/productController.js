const Product = require("../models/Product");
const User = require("../models/User");
const mockCatalog = require("../data/mockCatalog");

const applyFilters = (items, { maxPrice, minRating, sortBy }) => {
  let filtered = [...items];

  if (maxPrice) {
    filtered = filtered.filter((item) => item.price <= Number(maxPrice));
  }
  if (minRating) {
    filtered = filtered.filter((item) => item.rating >= Number(minRating));
  }

  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => a.price - b.price);
  }

  return filtered;
};

exports.searchProducts = async (req, res) => {
  try {
    const { query, category, maxPrice, minRating, sortBy = "price" } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required." });
    }

    const dbFilter = {
      name: { $regex: query, $options: "i" },
      ...(category ? { category } : {}),
    };

    let results = await Product.find(dbFilter).lean();

    if (!results.length) {
      results = mockCatalog.filter((item) => {
        const matchName = item.name.toLowerCase().includes(query.toLowerCase());
        const matchCategory = category ? item.category === category : true;
        return matchName && matchCategory;
      });
    }

    const filteredResults = applyFilters(results, { maxPrice, minRating, sortBy });

    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            query,
            category: category || "",
            createdAt: new Date(),
          },
        },
      });
    }

    return res.status(200).json({ count: filteredResults.length, results: filteredResults });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
