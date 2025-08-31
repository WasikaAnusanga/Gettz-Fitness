import express from 'express'
import { createPayment, verifyPayment } from '../controller/Payment_Controller.js';


const paymentRouter = express.Router();

paymentRouter.post("/createPayment/:id",createPayment);
paymentRouter.post("/verifyPayment/:id",verifyPayment)



export default paymentRouter;