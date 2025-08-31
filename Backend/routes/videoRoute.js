import express from 'express';
import { deleteVideo, getAllvideo, getVideoById, updateVideo, uploadVideo } from '../controller/videoController.js';

const videoRouter = express.Router();

videoRouter.post("/upload",uploadVideo);
videoRouter.get("/",getAllvideo);
videoRouter.put("/update/:videoId",updateVideo);
videoRouter.delete("/delete/:videoId",deleteVideo);
videoRouter.get("/:id",getVideoById);

export default videoRouter;