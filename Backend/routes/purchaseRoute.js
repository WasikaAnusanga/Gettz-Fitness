import express from 'express';
import {getAllPurchases,addPurchase,getPurchaseById,updatePurchase,deletePurchase} from '../controller/purchaseController.js';
const purchaseRouter= express.Router();

purchaseRouter.get("/",getAllPurchases);
purchaseRouter.post("/",addPurchase);
purchaseRouter.get("/:id",getPurchaseById);
purchaseRouter.put("/:id",updatePurchase);
purchaseRouter.delete("/:id",deletePurchase);

export default purchaseRouter;