import express from 'express';
import { deleteUser, getAllUsers, getUserById, loginUser, saveUser, updateUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', saveUser);
userRouter.post('/login',loginUser);
userRouter.get('/:userId',getUserById);
userRouter.get('/',getAllUsers);
userRouter.put('/:userId',updateUser);
userRouter.delete('/:userId', deleteUser);

export default userRouter;