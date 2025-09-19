import express from 'express';
import { createSession, deleteSession, getAllSessions, getSessionById, updateSession } from '../controller/liveSesssionController.js';

const sessionRouter = express.Router();

sessionRouter.post('/createSession', createSession);
sessionRouter.get('/getAllSessions', getAllSessions);
sessionRouter.delete('/deleteSession/:sessionId', deleteSession);
sessionRouter.put('/updateSession/:sessionId', updateSession);
sessionRouter.get('/getSession/:sessionId', getSessionById);

export default sessionRouter;
