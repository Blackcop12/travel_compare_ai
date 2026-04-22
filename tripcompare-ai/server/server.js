const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const tripRoutes = require("./src/routes/tripRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const hotelRoutes = require("./src/routes/hotelRoutes");
const travelRoutes = require("./src/routes/travelRoutes");
const tripGenerationRoutes = require("./src/routes/trip");
const { seedBaseData } = require("./src/services/seedService");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "TripCompare AI API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/generate-trip", tripGenerationRoutes);
app.use("/generate-trip", tripGenerationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
});

const start = async () => {
  try {
    await connectDB();
    await seedBaseData();
    app.listen(PORT, () => {
      console.log(`TripCompare AI API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to boot server:", error.message);
    process.exit(1);
  }
};

start();
