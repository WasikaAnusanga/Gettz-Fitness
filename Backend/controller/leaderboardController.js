import Leaderboard from "../model/leaderboard.js";

export async function viewLeaderboard(req, res) {
  try {
    const leaderboard = await Leaderboard.find({})
      .sort({ points: -1 })// make output in descending order
      .populate('user_id', 'firstName lastName createdAt')
      .lean();
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Leaderboard not found!" });
  }
}


