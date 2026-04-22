const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const platformCatalog = require("../data/platformCatalog");

dotenv.config({ path: require("path").join(__dirname, "../../.env") });

const mapIntentToCategory = {
  food: "Food",
  shopping: "Shopping",
  ride: "Rides",
};

const seed = async () => {
  await connectDB();

  await Product.deleteMany({});

  const docs = platformCatalog
    .filter((item) => item.intent !== "ride")
    .map((item) => ({
      name: item.name,
      category: mapIntentToCategory[item.intent],
      platform: item.platform,
      price: item.price,
      rating: item.rating,
      deliveryTime: item.etaMinutes,
      orderUrl: item.redirectUrl,
    }));

  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products.`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
