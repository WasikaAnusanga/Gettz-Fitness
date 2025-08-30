import express from "express";
import { createChallenge, viewChallenges, deleteChallenge, updateChallenge } from "../controller/challengeController.js";

const challengeRouter = express.Router();
challengeRouter.get("/", viewChallenges);
challengeRouter.post("/add", createChallenge);
challengeRouter.delete("/delete/:id", deleteChallenge);
challengeRouter.post("/update/:id", updateChallenge);

export default challengeRouter;
