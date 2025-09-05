import express from 'express'
import { createPayment, verifyPayment } from '../controller/Payment_Controller.js';
import verifyJWT from '../middleware/auth.js'

const paymentRouter = express.Router();

paymentRouter.post("/createPayment/:id",createPayment);
paymentRouter.post("/verifyPayment/:id",verifyJWT,verifyPayment)



export default paymentRouter;