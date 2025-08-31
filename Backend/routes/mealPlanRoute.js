import express from 'express';
const mealPlanRouter = express.Router();
import { getMealPlan, addMealPlan, updateMealPlan, deleteMeal } from '../controller/mealPlanController.js'

mealPlanRouter.get('/', getMealPlan);
mealPlanRouter.post('/', addMealPlan);
mealPlanRouter.put('/:id', updateMealPlan);
mealPlanRouter.delete('/:id', deleteMeal);

export default mealPlanRouter;