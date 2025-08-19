import express from 'express'
import { addPlan, deletePlan, getPlans, getSelectedPlan, updatePlan } from '../controller/MembershipPlans_Controller.js';

const planRouter = express.Router();

planRouter.post("/addPlan",addPlan);
planRouter.put("/updatePlan/:id",updatePlan);
planRouter.delete("/deletePlan/:id",deletePlan);
planRouter.get("/plan/:id",getSelectedPlan);
planRouter.get("/",getPlans);

export default planRouter;