const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

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
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("MONGO_URI missing. Using in-memory MongoDB fallback.");
    await connectFallbackMongo();
    return;
  }

  try {
    await connectPrimaryMongo(uri);
  } catch (error) {
    console.warn("Primary MongoDB not reachable. Using in-memory MongoDB fallback.");
    console.warn("MongoDB error:", error.message);
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
