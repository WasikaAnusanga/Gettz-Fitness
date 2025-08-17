import express from "express";
import loginController from "../controller/loggingController.js";

const authRouter = express.Router();

authRouter.post("/login/:role", (req, res, next) => {
  req.body.role = req.params.role; 
  next();
}, loginController);

export default authRouter;
