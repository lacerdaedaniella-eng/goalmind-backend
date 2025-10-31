// ⚽ GoalMind Backend (Final Full Version)
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.API_BASE_URL || "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Root health check
app.get("/", (req, res) => {
  res.send("✅ GoalMind Backend is running successfully!");
});

// ⚽ Get Teams by League
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

// ⚽ Get Team Stats
app.get("/api/stats", async (req, res) => {
  const { team, league } = req.query;
  if (!team || !league) {
    return res.status(400).json({ error: "Team ID and League ID are required" });
  }

  try {
    const response = await axios.get(`${BASE_URL}/teams/statistics`, {
      headers: { "x-apisports-key": API_KEY },
      params: {
        team,
        league,
        season: 2024,
      },
    });

    if (!response.data || !response.data.response) {
      return res.status(500).json({ error: "No stats returned from API" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching stats:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch stats",
      details: error.message,
    });
  }
});

// ⚽ Get Upcoming Fixtures by League
app.get("/api/fixtures", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: {
        league,
        season: 2024,
        next: 10, // fetch next 10 upcoming matches
      },
    });

    if (!response.data || !response.data.response) {
      return res.status(500).json({ error: "No fixture data returned from API" });
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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 GoalMind Backend running on port ${PORT}`);
});
