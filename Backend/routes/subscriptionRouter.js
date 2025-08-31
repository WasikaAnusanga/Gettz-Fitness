import express from 'express'
import { addSubscription, cancelSubscription, mySubscription } from '../controller/Subscription_Controller.js';
import verifyJWT from '../middleware/auth.js';

const subscriptionRouter = express.Router();
subscriptionRouter.post("/addSub/:id",verifyJWT,addSubscription);
subscriptionRouter.get("/viewSub",mySubscription);
subscriptionRouter.post("/cancelSub",cancelSubscription);

export default subscriptionRouter;