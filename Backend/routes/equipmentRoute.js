import express from 'express';
import { getAllEquipment,addEquipment,getById,updateEquipment,deleteEquipment } from '../controller/equipmentController.js';
const equipmentRouter = express.Router();


equipmentRouter.get("/",getAllEquipment);
equipmentRouter.post("/",addEquipment);
equipmentRouter.get("/:id",getById);
equipmentRouter.put("/:id",updateEquipment);
equipmentRouter.delete("/:id",deleteEquipment);

export default equipmentRouter;