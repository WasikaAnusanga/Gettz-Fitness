import express from "express";
import { addCard, getCards } from "../controller/creditCardController.js";


const cardRouter = express.Router();
cardRouter.get("/", getCards);
cardRouter.post("/add", addCard);
// cardRouter.delete("/delete/:id", deleteChallenge);
// cardRouter.post("/update/:id", updateChallenge);

export default cardRouter;
