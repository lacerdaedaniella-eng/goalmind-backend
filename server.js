import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const API_BASE_URL = "https://v3.football.api-sports.io";

// 🧠 Existing stats route
app.get("/api/stats", async (req, res) => {
  const { team, league } = req.query;
  if (!team || !league) {
    return res.status(400).json({ error: "Missing team or league parameter" });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/teams/statistics`, {
      params: { season: 2024, team, league },
      headers: { "x-apisports-key": API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 🏆 NEW: League standings
app.get("/api/standings", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "Missing league parameter" });

  try {
    const response = await axios.get(`${API_BASE_URL}/standings`, {
      params: { season: 2024, league },
      headers: { "x-apisports-key": API_KEY },
    });
    const standings = response.data.response[0].league.standings[0].slice(0, 10);
    res.json(standings);
  } catch (err) {
    console.error("Error fetching standings:", err.message);
    res.status(500).json({ error: "Failed to fetch standings" });
  }
});

// ⚽ NEW: Upcoming fixtures (next 5)
app.get("/api/upcoming", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "Missing league parameter" });

  try {
    const response = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: { league, season: 2024, next: 5 },
      headers: { "x-apisports-key": API_KEY },
    });
    res.json(response.data.response);
  } catch (err) {
    console.error("Error fetching upcoming fixtures:", err.message);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
