import express from 'express';
const employeeSalaryRecordsRouter = express.Router();
import { getEmployeeSalaryRecords, addEmployeeSalaryRecords, updateEmployeeSalaryRecords, deleteEmployeeSalaryRecords } from '../controller/employeeSalaryRecordsController.js'

employeeSalaryRecordsRouter.get('/', getEmployeeSalaryRecords);
employeeSalaryRecordsRouter.post('/', addEmployeeSalaryRecords);
employeeSalaryRecordsRouter.put('/:id', updateEmployeeSalaryRecords);
employeeSalaryRecordsRouter.delete('/:id', deleteEmployeeSalaryRecords);

export default employeeSalaryRecordsRouter;