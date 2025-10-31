// ⚽ GoalMind Backend (Final Fixed Version)
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ API-Sports configuration
const BASE_URL = process.env.API_BASE_URL || "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY;

// ✅ Enable full CORS and JSON parsing
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

// ✅ Root route (health check)
app.get("/", (req, res) => {
  res.send("⚽ GoalMind Backend is running successfully!");
});

// ✅ 1. Get Teams by League
app.get("/api/teams", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, season: 2024 },
    });

    if (!response.data || !response.data.response) {
      return res.status(500).json({ error: "No data returned from API" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching teams:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch teams",
      details: error.message,
    });
  }
});

// ✅ 2. Get Team Statistics
app.get("/api/stats", async (req, res) => {
  const { league, team } = req.query;
  if (!league || !team)
    return res.status(400).json({ error: "League and Team ID are required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams/statistics`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, team, season: 2024 },
    });

    if (!response.data || !response.data.response) {
      return res.status(500).json({ error: "No stats returned from API" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching team stats:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch team stats",
      details: error.message,
    });
  }
});

// ✅ Get Upcoming Fixtures by League (with date range)
app.get("/api/fixtures", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  const today = new Date().toISOString().split("T")[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  const toDate = futureDate.toISOString().split("T")[0];

  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: {
        league,
        season: 2024,
        from: today,
        to: toDate,
      },
    });

    if (!response.data || !response.data.response || response.data.response.length === 0) {
      return res.status(404).json({ message: "No upcoming fixtures found in next 2 weeks" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching fixtures:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch fixtures",
      details: error.message,
    });
  }
});



// ✅ 4. Get Live Matches
app.get("/api/live", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: { live: "all" },
    });

    if (!response.data || !response.data.response) {
      return res.status(500).json({ error: "No live match data returned from API" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching live matches:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch live matches",
      details: error.message,
    });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 GoalMind Backend running on port ${PORT}`);
});
