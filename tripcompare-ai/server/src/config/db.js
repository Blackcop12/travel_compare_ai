const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const normalizeMongoUri = (value) => {
  if (!value) return "";

  return value
    .trim()
    .replace(/^MONGO_URI\s*=\s*/i, "")
    .replace(/^['\"]|['\"]$/g, "");
};

const ensureAuthSource = (uri, defaultAuthSource = "admin") => {
  if (!uri || !uri.startsWith("mongodb")) return uri;
  if (/([?&])authSource=/i.test(uri)) return uri;

  const separator = uri.includes("?") ? "&" : "?";
  return `${uri}${separator}authSource=${defaultAuthSource}`;
};

const shouldUseFallback = (error) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isAuthError = /auth|Authentication failed|bad auth/i.test(error?.message || "");
  return !isProduction && !isAuthError;
};

const connectPrimaryMongo = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB connected:", uri);
};

const connectFallbackMongo = async () => {
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log("MongoDB connected (memory fallback):", memoryUri);
};

const connectDB = async () => {
  const uri = ensureAuthSource(
    normalizeMongoUri(process.env.MONGO_URI),
    process.env.MONGO_AUTH_SOURCE || "admin"
  );

  if (!uri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  try {
    await connectPrimaryMongo(uri);
  } catch (error) {
    console.warn("MongoDB error:", error.message);

    if (!shouldUseFallback(error)) {
      throw new Error(`Primary MongoDB connection failed: ${error.message}`);
    }

    console.warn("Primary MongoDB not reachable. Using in-memory MongoDB fallback.");
    await connectFallbackMongo();
  }
};

process.on("SIGINT", async () => {
  if (memoryServer) {
    await memoryServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;
