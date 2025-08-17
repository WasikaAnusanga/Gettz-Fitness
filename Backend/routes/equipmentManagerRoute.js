import express from 'express';
import { deleteEquipmentManager, getAllEquipmentManagers, getEquipmentManagerById, loginEquipmentManager, registerEquipmentManager, updateEquipmentManager } from '../controller/equipmentManagerController.js';
import { get } from 'mongoose';

const equipmentManagerRouter = express.Router();

equipmentManagerRouter.post("/register", registerEquipmentManager);
equipmentManagerRouter.post("/login",loginEquipmentManager);
equipmentManagerRouter.get("/viewEquipmentManagers",getAllEquipmentManagers);
equipmentManagerRouter.get("/viewEquipmentManager/:id", getEquipmentManagerById);
equipmentManagerRouter.put("/updateEquipmentManager/:id",updateEquipmentManager);
equipmentManagerRouter.delete("/deleteEquipmentManager/:id",deleteEquipmentManager);

export default equipmentManagerRouter;
