import express from "express"
import { addPost, deletePost, updatePost, viewPosts } from "../controller/comPostController.js";

const ComPostRouter = express.Router()

ComPostRouter.get("/", viewPosts)
ComPostRouter.post("/addpost", addPost)
ComPostRouter.post("/updatepost/:id", updatePost)
ComPostRouter.delete("/deletepost/:id", deletePost)

export default ComPostRouter;

