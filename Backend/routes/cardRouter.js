import express from "express";
import { addCard, deleteCard, getCards, updateCard } from "../controller/creditCardController.js";


const cardRouter = express.Router();
cardRouter.get("/", getCards);
cardRouter.post("/add", addCard);
cardRouter.delete("/delete/:id", deleteCard);
cardRouter.put("/update/:id", updateCard);

export default cardRouter;
