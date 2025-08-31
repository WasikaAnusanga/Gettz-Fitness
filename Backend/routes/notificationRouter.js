import express from "express";
import {createPromotionalNotification, deleteNotification, updateNotification, viewNotifications} from "../controller/notificatinController.js";

const notificationRouter = express.Router()

notificationRouter.get("/",viewNotifications)
notificationRouter.post("/add", createPromotionalNotification)
notificationRouter.post("/update/:id", updateNotification)
notificationRouter.delete("/delete/:id", deleteNotification)

export default notificationRouter
