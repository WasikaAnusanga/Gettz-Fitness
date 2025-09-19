// import express from "express";
// import {createPromotionalNotification, deleteNotification, markAsRead, updateNotification, viewNotifications} from "../controller/notificatinController.js";

// const notificationRouter = express.Router()

// notificationRouter.get("/",viewNotifications)
// notificationRouter.post("/add", createPromotionalNotification)
// notificationRouter.post("/update/:id", updateNotification)
// notificationRouter.delete("/delete/:id", deleteNotification)
// notificationRouter.put("/markasread", markAsRead)

// export default notificationRouter


import express from "express";

import {
  createPromotionalNotification,
  createNotificationForUser,
  deleteNotification,
  markAsRead,
  updateNotification,
  viewNotifications,
  getMyNotifications
} from "../controller/notificatinController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", viewNotifications);
notificationRouter.get("/mine", getMyNotifications);
notificationRouter.post("/add",createPromotionalNotification);
notificationRouter.post("/addOne", createNotificationForUser); 
notificationRouter.put("/update/:id", updateNotification);
notificationRouter.delete("/delete/:id", deleteNotification);
notificationRouter.put("/markasread", markAsRead);

export default notificationRouter;
