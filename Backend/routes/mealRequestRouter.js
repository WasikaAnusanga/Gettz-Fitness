import express from 'express';
const mealRequestRouter = express.Router();
import { getMealRequest, addMealRequest, updateMealRequest, deleteMealRequest } from '../controller/mealRequestController.js';

mealRequestRouter.get('/', getMealRequest);
mealRequestRouter.post('/', addMealRequest);
mealRequestRouter.put('/:id', updateMealRequest);
mealRequestRouter.delete('/:id', deleteMealRequest);

export default mealRequestRouter;