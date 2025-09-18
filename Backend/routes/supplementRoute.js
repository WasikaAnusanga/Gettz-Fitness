import express from 'express';
import {getAllSupplements,addSupplement,getSupplementById,updateSupplement,deleteSupplement} from '../controller/supplementController.js';
const supplementRouter= express.Router();

supplementRouter.get("/",getAllSupplements);
supplementRouter.post("/",addSupplement);
supplementRouter.get("/:id",getSupplementById);
supplementRouter.put("/:id",updateSupplement);
supplementRouter.delete("/:id",deleteSupplement);

export default supplementRouter;