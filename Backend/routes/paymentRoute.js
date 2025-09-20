import express from 'express'
import { createPayment, fetchPayment } from '../controller/Payment_Controller.js';
import verifyJWT from '../middleware/auth.js'

const paymentRouter = express.Router();

paymentRouter.post("/createPayment/:id",createPayment);
paymentRouter.get("/fetchPayment/:id",fetchPayment)



export default paymentRouter;