const hotels = [
  {
    name: "Pune Budget Stay",
    location: "pune",
    price: 850,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    rating: 4.1,
  },
  {
    name: "Skyline Inn Pune",
    location: "pune",
    price: 1300,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    rating: 4.2,
  },
  {
    name: "Marine Crown Mumbai",
    location: "mumbai",
    price: 3100,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
  },
  {
    name: "Goa Palm Retreat",
    location: "goa",
    price: 2200,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
  },
  {
    name: "Delhi Metro Lodge",
    location: "delhi",
    price: 1700,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    rating: 4.0,
  },
];

const places = [
  {
    name: "Shaniwar Wada",
    location: "pune",
    description: "Historic Maratha fort with evening light and sound experience.",
  },
  {
    name: "Aga Khan Palace",
    location: "pune",
    description: "Heritage museum and gardens with major freedom movement significance.",
  },
  {
    name: "Gateway of India",
    location: "mumbai",
    description: "Iconic waterfront monument and launch point for harbor rides.",
  },
  {
    name: "Marine Drive",
    location: "mumbai",
    description: "Scenic promenade known for sunset views and city skyline.",
  },
  {
    name: "Baga Beach",
    location: "goa",
    description: "Popular beach area with water sports, nightlife, and shacks.",
  },
  {
    name: "Fort Aguada",
    location: "goa",
    description: "Portuguese-era fort with cliffside sea views.",
  },
  {
    name: "India Gate",
    location: "delhi",
    description: "National landmark surrounded by lawns and city boulevard.",
  },
  {
    name: "Qutub Minar",
    location: "delhi",
    description: "UNESCO site with rich Indo-Islamic architecture.",
  },
];

const foodByLocation = {
  pune: [
    { name: "Misal Pav", averageCost: 120 },
    { name: "Mastani", averageCost: 180 },
    { name: "Maharashtrian Thali", averageCost: 280 },
  ],
  mumbai: [
    { name: "Vada Pav", averageCost: 90 },
    { name: "Pav Bhaji", averageCost: 180 },
    { name: "Seafood Thali", averageCost: 450 },
  ],
  goa: [
    { name: "Goan Fish Curry", averageCost: 350 },
    { name: "Prawn Balchao", averageCost: 420 },
    { name: "Bebinca", averageCost: 170 },
  ],
  delhi: [
    { name: "Chole Bhature", averageCost: 180 },
    { name: "Kebabs", averageCost: 340 },
    { name: "Butter Chicken", averageCost: 430 },
  ],
};

module.exports = {
  hotels,
  places,
  foodByLocation,
};
