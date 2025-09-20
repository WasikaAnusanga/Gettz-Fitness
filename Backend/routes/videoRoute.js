import express from 'express';
import { addView, deleteVideo, getAllvideo, getVideoById, toggleLike, updateVideo, uploadVideo } from '../controller/videoController.js';

const videoRouter = express.Router();

videoRouter.post("/upload",uploadVideo);
videoRouter.get("/",getAllvideo);
videoRouter.put("/update/:videoId",updateVideo);
videoRouter.delete("/delete/:id",deleteVideo);
videoRouter.get("/:id",getVideoById);
videoRouter.post("/:id/view", addView);
videoRouter.post("/:id/like", toggleLike);

export default videoRouter;