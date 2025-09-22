import express from "express";
import { registerMember, getMembers, checkMember } from "../controller/memberController.js";

const router = express.Router();

router.post("/register", registerMember);
router.get("/", getMembers);
router.get("/check/:rfid", checkMember);

export default router;
