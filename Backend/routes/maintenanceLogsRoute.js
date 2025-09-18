import express from 'express';
import {getAllMaintenanceLogs,addMaintenanceLog} from '../controller/maintenanceLogsController.js';
const maintenanceLogsRouter = express.Router();

maintenanceLogsRouter.get("/",getAllMaintenanceLogs);
maintenanceLogsRouter.post("/",addMaintenanceLog);

export default maintenanceLogsRouter;