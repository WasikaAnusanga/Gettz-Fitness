import express from 'express'
import { createPayment, fetchPayment, fetchUserPayment } from '../controller/Payment_Controller.js';

const paymentRouter = express.Router();

paymentRouter.post("/createPayment/:id",createPayment);
paymentRouter.get("/fetchPayment/:id",fetchPayment)
paymentRouter.get("/fetchPayment",fetchUserPayment)


export default paymentRouter;