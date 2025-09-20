import Leaderboard from "../model/leaderboard.js";

export async function viewLeaderboard(req, res) {
  try {
    const leaderboard = await Leaderboard.find({})
      .populate("user_id", "firstName lastName createdAt point") 
      .lean();

    const sorted = leaderboard
      .filter((row) => row.user_id) // drop nulls
      .sort((a, b) => (b.user_id.point || 0) - (a.user_id.point || 0));

    res.json(sorted);
  } catch (err) {
    console.error("viewLeaderboard error:", err);
    res.status(500).json({ message: "Leaderboard not found!" });
  }
}
