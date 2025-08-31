import express from "express"
import { viewLeaderboard} from "../controller/leaderboardController.js"

const leaderboardRouter = express.Router()

leaderboardRouter.get("/", viewLeaderboard)
// leaderboardRouter.post("/add", createLeaderboard);
// leaderboardRouter.delete("/delete/:id", deleteLeaderboard);
// leaderboardRouter.post("/update/:id", updateLeaderboard);


export default leaderboardRouter;