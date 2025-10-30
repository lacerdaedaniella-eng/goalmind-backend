// ✅ GoalMind Backend (Final Fixed Version)
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.API_BASE_URL || "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY || process.env.API_KEY;

app.use(cors());
app.use(express.json());

// ✅ Test route for Render
app.get("/", (req, res) => {
  res.send("✅ GoalMind Backend is running");
});

// ✅ Teams Route
app.get("/api/teams", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, season: 2024 },
    });
    res.json(response.data.response || []);
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// ✅ Stats Route
app.get("/api/stats", async (req, res) => {
  const { team, league } = req.query;
  if (!team || !league)
    return res.status(400).json({ error: "Team and league are required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams/statistics`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, team, season: 2024 },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ✅ Standings Route
app.get("/api/standings", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/standings`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, season: 2024 },
    });
    const standings =
      response.data.response?.[0]?.league?.standings?.[0] || [];
    res.json(standings.slice(0, 10));
  } catch (error) {
    console.error("Error fetching standings:", error.message);
    res.status(500).json({ error: "Failed to fetch standings" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
