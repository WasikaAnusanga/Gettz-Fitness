import express from 'express';
const employeeSalaryRouter = express.Router();
import { getEmployeeSalary, addEmployeeSalary, updateEmployeeSalary, deleteEmployeeSalary } from '../controller/employeeSalaryController.js'

employeeSalaryRouter.get('/', getEmployeeSalary);
employeeSalaryRouter.post('/', addEmployeeSalary);
employeeSalaryRouter.put('/:id', updateEmployeeSalary);
employeeSalaryRouter.delete('/:id', deleteEmployeeSalary);

export default employeeSalaryRouter;