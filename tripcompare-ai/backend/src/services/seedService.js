const Hotel = require("../models/Hotel");
const Place = require("../models/Place");
const { hotels, places } = require("../data/seedData");

const seedBaseData = async () => {
  const [hotelCount, placeCount] = await Promise.all([Hotel.countDocuments(), Place.countDocuments()]);

  if (!hotelCount) {
    await Hotel.insertMany(hotels);
  }

  if (!placeCount) {
    await Place.insertMany(places);
  }
};

module.exports = {
  seedBaseData,
};
