const FOOD_HINTS = ["food", "vada", "pizza", "burger", "biryani", "thali", "restaurant", "meal", "snack"];
const RIDE_HINTS = ["cab", "taxi", "ride", "uber", "ola", "rapido", "from", "to", "airport", "station"];
const SHOPPING_HINTS = ["laptop", "iphone", "phone", "shopping", "buy", "headphone", "tv", "fridge", "shoes"];

const includesHint = (text, hints) => hints.some((hint) => text.includes(hint));

const detectIntent = (query = "") => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return "shopping";
  }
  if (includesHint(normalized, RIDE_HINTS)) {
    return "ride";
  }
  if (includesHint(normalized, FOOD_HINTS)) {
    return "food";
  }
  if (includesHint(normalized, SHOPPING_HINTS)) {
    return "shopping";
  }

  return "shopping";
};

module.exports = { detectIntent };
