const cityCoordinates = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.209 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  goa: { lat: 15.2993, lng: 74.124 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
};

const tollCharges = {
  "mumbai:pune": 320,
  "pune:mumbai": 320,
  "pune:goa": 540,
  "goa:pune": 540,
  "delhi:jaipur": 450,
  "jaipur:delhi": 450,
  "delhi:chennai": 920,
  "chennai:delhi": 920,
  "bangalore:chennai": 380,
  "chennai:bangalore": 380,
  "bangalore:hyderabad": 460,
  "hyderabad:bangalore": 460,
  "hyderabad:chennai": 410,
  "chennai:hyderabad": 410,
  "mumbai:goa": 680,
  "goa:mumbai": 680,
};

const destinationCatalog = {
  mumbai: {
    places: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Sanjay Gandhi NP"],
    foods: [
      { name: "Vada Pav", avgCostPerMeal: 80 },
      { name: "Bombay Sandwich", avgCostPerMeal: 150 },
      { name: "Seafood Thali", avgCostPerMeal: 450 },
    ],
    hotels: [
      { name: "Budget Stay", priceRangePerNight: [1800, 2800] },
      { name: "Business Hotel", priceRangePerNight: [3500, 6000] },
      { name: "Luxury Bayfront", priceRangePerNight: [9000, 18000] },
    ],
  },
  goa: {
    places: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Old Goa Churches"],
    foods: [
      { name: "Goan Fish Curry", avgCostPerMeal: 350 },
      { name: "Prawn Balchao", avgCostPerMeal: 420 },
      { name: "Bebinca Dessert", avgCostPerMeal: 180 },
    ],
    hotels: [
      { name: "Hostel by Beach", priceRangePerNight: [1200, 2200] },
      { name: "Resort Stay", priceRangePerNight: [4500, 9000] },
      { name: "Premium Villa", priceRangePerNight: [12000, 24000] },
    ],
  },
  delhi: {
    places: ["India Gate", "Qutub Minar", "Humayun Tomb", "Akshardham"],
    foods: [
      { name: "Chole Bhature", avgCostPerMeal: 180 },
      { name: "Butter Chicken", avgCostPerMeal: 420 },
      { name: "Kebabs", avgCostPerMeal: 350 },
    ],
    hotels: [
      { name: "City Budget Inn", priceRangePerNight: [1600, 3000] },
      { name: "Metro Business Hotel", priceRangePerNight: [3400, 6500] },
      { name: "Luxury Central", priceRangePerNight: [8500, 17000] },
    ],
  },
  pune: {
    places: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Khadakwasla Dam"],
    foods: [
      { name: "Misal Pav", avgCostPerMeal: 130 },
      { name: "Puran Poli", avgCostPerMeal: 170 },
      { name: "Maharashtrian Thali", avgCostPerMeal: 290 },
    ],
    hotels: [
      { name: "Campus Budget Hotel", priceRangePerNight: [1200, 2200] },
      { name: "Business City Stay", priceRangePerNight: [2600, 4800] },
      { name: "Premium Riverside", priceRangePerNight: [7000, 13000] },
    ],
  },
  jaipur: {
    places: ["Hawa Mahal", "Amber Fort", "City Palace", "Jal Mahal"],
    foods: [
      { name: "Dal Baati Churma", avgCostPerMeal: 240 },
      { name: "Laal Maas", avgCostPerMeal: 390 },
      { name: "Ghewar", avgCostPerMeal: 140 },
    ],
    hotels: [
      { name: "Pink City Budget Stay", priceRangePerNight: [1400, 2600] },
      { name: "Heritage Courtyard", priceRangePerNight: [3200, 5800] },
      { name: "Royal Palace Hotel", priceRangePerNight: [7800, 15500] },
    ],
  },
  bangalore: {
    places: ["Lalbagh", "Cubbon Park", "Bangalore Palace", "Nandi Hills"],
    foods: [
      { name: "Masala Dosa", avgCostPerMeal: 180 },
      { name: "Bisi Bele Bath", avgCostPerMeal: 210 },
      { name: "Donne Biryani", avgCostPerMeal: 320 },
    ],
    hotels: [
      { name: "Tech Park Budget Inn", priceRangePerNight: [1700, 2900] },
      { name: "Garden Business Hotel", priceRangePerNight: [3400, 6200] },
      { name: "Luxury Skyline Suites", priceRangePerNight: [9200, 17500] },
    ],
  },
  chennai: {
    places: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Mahabalipuram"],
    foods: [
      { name: "South Indian Meals", avgCostPerMeal: 190 },
      { name: "Filter Coffee + Tiffin", avgCostPerMeal: 130 },
      { name: "Chettinad Chicken", avgCostPerMeal: 360 },
    ],
    hotels: [
      { name: "Marina Budget Stay", priceRangePerNight: [1500, 2600] },
      { name: "City Comfort Hotel", priceRangePerNight: [3000, 5400] },
      { name: "Sea View Premium", priceRangePerNight: [8200, 16000] },
    ],
  },
  hyderabad: {
    places: ["Charminar", "Golconda Fort", "Hussain Sagar", "Ramoji Film City"],
    foods: [
      { name: "Hyderabadi Biryani", avgCostPerMeal: 320 },
      { name: "Haleem", avgCostPerMeal: 260 },
      { name: "Irani Chai + Osmania Biscuit", avgCostPerMeal: 120 },
    ],
    hotels: [
      { name: "Old City Budget Lodge", priceRangePerNight: [1300, 2400] },
      { name: "Business District Hotel", priceRangePerNight: [3100, 5600] },
      { name: "Lakeview Luxury", priceRangePerNight: [8600, 16800] },
    ],
  },
};

module.exports = {
  cityCoordinates,
  tollCharges,
  destinationCatalog,
};
