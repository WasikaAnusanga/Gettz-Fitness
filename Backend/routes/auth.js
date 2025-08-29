import { Router } from 'express';
import { adminLoging } from '../controller/adminController.js';
import { loginTrainer } from '../controller/trainerController.js';
import { loginEquipmentManager } from '../controller/equipmentManagerController.js';
import { loginCustomerSupporter } from '../controller/customerSupporterController.js';

const router = Router();


router.post('/admin/login', adminLoging);                  
router.post('/trainer/login', loginTrainer);               
router.post('/equipment-manager/login', loginEquipmentManager); 
router.post('/customer-supporter/login', loginCustomerSupporter); 

export default router;
