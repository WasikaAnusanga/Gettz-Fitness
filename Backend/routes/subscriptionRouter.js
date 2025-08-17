import express from 'express'
import { addSubscription, cancelSubscription, mySubscription } from '../controller/Subscription_Controller.js';

const subscriptionRouter = express.Router();
subscriptionRouter.post("/addSub/:id",addSubscription);
subscriptionRouter.get("/viewSub",mySubscription);
subscriptionRouter.post("/cancelSub",cancelSubscription);

export default subscriptionRouter;