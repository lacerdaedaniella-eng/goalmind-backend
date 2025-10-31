// GoalMind Backend — Final Version with Fixtures Support
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

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("GoalMind Backend is running successfully!");
});

// ✅ Get teams by league
app.get("/api/teams", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League ID is required" });

  try {
    const response = await axios.get(`${BASE_URL}/teams`, {
      headers: { "x-apisports-key": API_KEY },
      params: { league, season: 2024 },
    });

    if (!response.data.response) {
      return res.status(500).json({ error: "No data returned from API" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    res.status(500).json({ error: "Failed to fetch teams", details: error.message });
  }
});

// ✅ Get live matches
app.get("/api/live", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": API_KEY },
      params: { live: "all" },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching live matches:", error.message);
    res.status(500).json({ error: "Failed to fetch live matches", details: error.message });
  }
});

// ✅ Get upcoming fixtures by league
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
    console.error("Error fetching fixtures:", error.message);
    res.status(500).json({ error: "Failed to fetch fixtures", details: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
