import express from 'express';
import { deleteTrainer, getAllTrainers, getTrainerById, loginTrainer, registerTrainer, updateTrainer } from '../controller/trainerController.js';

const trainerRouter = express.Router();

trainerRouter.post('/register',registerTrainer);
trainerRouter.post('/login', loginTrainer);
trainerRouter.get('/viewTrainers',getAllTrainers);
trainerRouter.put('/updateTrainer/:id', updateTrainer);
trainerRouter.delete('/deleteTrainer/:id',deleteTrainer);
trainerRouter.get('/viewTrainer/:id',getTrainerById);

export default trainerRouter;

