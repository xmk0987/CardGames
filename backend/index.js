require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const initializeSocket = require("./socket");
const Game = require("./models/Game"); // Assuming you have a Game model

const PORT = process.env.PORT || 8888;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);

// ------------------------
// MongoDB Connection Setup
// ------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// ------------------------
// CORS Setup
// ------------------------
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.ORIGIN, `${process.env.ORIGIN}/`];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ------------------------
// Socket.IO Init
// ------------------------
initializeSocket(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

// ------------------------
// Headers Middleware
// ------------------------
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === process.env.ORIGIN || origin === `${process.env.ORIGIN}/`) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.get("/game/:gameId", async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (err) {
    console.error("Error fetching game:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ------------------------
// Start Server
// ------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
