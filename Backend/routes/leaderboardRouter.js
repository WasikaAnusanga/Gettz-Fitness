import express from "express"
import { viewLeaderboard} from "../controller/leaderboardController.js"

const leaderboardRouter = express.Router()

leaderboardRouter.get("/", viewLeaderboard)

export default leaderboardRouter;