import express from "express";
import {deleteCustomerSupporter,getAllCustomerSupporters,getCustomerSupporterById,loginCustomerSupporter,saveCustomerSupporter,updateCustomerSupporter} from "../controller/customerSupporterController.js";

const customerRouter = express.Router();

customerRouter.post("/register", saveCustomerSupporter);
customerRouter.post("/customerlogin", loginCustomerSupporter);
customerRouter.get("/viewSupporter", getAllCustomerSupporters);
customerRouter.get("/viewSupporter/:id", getCustomerSupporterById);
customerRouter.put("/updateSupporter/:supporterId", updateCustomerSupporter);
customerRouter.delete("/deleteSupporter/:id", deleteCustomerSupporter);

export default customerRouter;
