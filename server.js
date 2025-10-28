import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Verify API key is loaded
console.log("API Key Loaded:", process.env.FOOTBALL_API_KEY ? "✅ Yes" : "❌ No");

// 🏁 Root route
app.get("/", (req, res) => {
  res.send("✅ GoalMind Backend is running");
});

// ⚽ Get team statistics
app.get("/api/stats", async (req, res) => {
  const { team, league } = req.query;
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!team || !league) {
    return res.status(400).json({ error: "Missing team or league parameter" });
  }

  try {
    const response = await axios.get(
      `https://v3.football.api-sports.io/teams/statistics?season=2024&team=${team}&league=${league}`,
      { headers: { "x-apisports-key": apiKey } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching stats:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch team statistics" });
  }
});

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
