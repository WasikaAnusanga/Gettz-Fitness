import express from 'express';
import { adminLoging, saveAdmin } from '../controller/adminCntroller.js';

const adminRouter = express.Router();

adminRouter.post('/login',adminLoging);
adminRouter.post('/register',saveAdmin);

export default adminRouter;