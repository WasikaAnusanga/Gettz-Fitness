import express from 'express'
import { createPayment } from '../controller/Payment_Controller.js';


const paymentRouter = express.Router();

paymentRouter.post("/createPayment",createPayment);



export default paymentRouter;