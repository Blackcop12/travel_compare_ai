const rideWords = ["cab", "taxi", "ride", "uber", "ola", "rapido", "from", "to"];
const foodWords = ["food", "vada", "pizza", "burger", "biryani", "meal"];

export const detectIntentPreview = (query = "") => {
  const value = query.toLowerCase();
  if (rideWords.some((word) => value.includes(word))) return "ride";
  if (foodWords.some((word) => value.includes(word))) return "food";
  return "shopping";
};

export const intentLabel = {
  ride: "Ride",
  food: "Food",
  shopping: "Shopping",
};
