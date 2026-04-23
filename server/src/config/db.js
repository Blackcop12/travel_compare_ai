const mongoose = require("mongoose");

const normalizeMongoUri = (value) => {
  if (!value) return "";

  return value
    .trim()
    .replace(/^MONGO_URI\s*=\s*/i, "")
    .replace(/^['\"]|['\"]$/g, "");
};

const connectDB = async () => {
  const mongoUri = normalizeMongoUri(process.env.MONGO_URI);
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
