import express from "express";
import {createChallenge, viewChallenges, deleteChallenge, updateChallenge,joinChallenge, myJoinedChallenges} from "../controller/challengeController.js";

const challengeRouter = express.Router();

challengeRouter.get("/", viewChallenges);
challengeRouter.get("/joined", myJoinedChallenges);     
challengeRouter.post("/join/:id", joinChallenge);        // id = challengeID
challengeRouter.post("/add", createChallenge);
challengeRouter.delete("/delete/:id", deleteChallenge);
challengeRouter.put("/update/:id", updateChallenge);

export default challengeRouter;
