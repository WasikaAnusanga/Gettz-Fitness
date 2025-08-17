import express from 'express';
import loginController from '../controller/loggingController.js';

const loggingRouter = express.Router();

loggingRouter.post('/admin',loginController);

export default loggingRouter;