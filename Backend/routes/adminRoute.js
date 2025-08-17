import express from "express";
import { adminLoging, getAllAdmins, saveAdmin } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLoging);
adminRouter.post("/register", saveAdmin);
adminRouter.get("/viewAdmins",getAllAdmins)


export default adminRouter;
