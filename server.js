// ✅ GoalMind Backend (Final Fixed Version)
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

// ✅ Root route
app.get("/", (req, res) => {
  res.send("GoalMind Backend is running successfully ✅");
});

// ✅ Get Teams by League
app.get("/api/teams", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, season: 2024 },
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching teams:", error.message);
    res.status(500).json({ error: "Failed to fetch teams", details: error.message });
  }
});

// ✅ Get Live Matches
app.get("/api/live", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: { live: "all" },
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching live matches:", error.message);
    res.status(500).json({ error: "Failed to fetch live matches", details: error.message });
  }
});

// ✅ Get Upcoming Fixtures by League
app.get("/api/fixtures", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: {
        league,
        season: 2024,
        next: 10, // get next 10 matches
      },
    });

    if (!response.data.response || response.data.response.length === 0) {
      return res.json({ message: "No upcoming fixtures found in next 2 weeks" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching fixtures:", error.message);
    res.status(500).json({ error: "Failed to fetch fixtures", details: error.message });
  }
});

// ✅ Get Team Statistics (for predictions)
app.get("/api/team-stats", async (req, res) => {
  const { league, team } = req.query;
  if (!league || !team) {
    return res.status(400).json({ error: "League and Team ID required" });
  }

  try {
    const response = await axios.get(`${BASE_URL}/teams/statistics`, {
      headers: { "x-apisports-key": API_KEY },
      params: {
        league,
        team,
        season: 2024,
      },
    });

    if (!response.data.response) {
      return res.status(404).json({ error: "No stats found for this team" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching team stats:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch team stats",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ GoalMind Backend running on port ${PORT}`));
