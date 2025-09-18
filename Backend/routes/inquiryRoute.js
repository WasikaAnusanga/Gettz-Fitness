import express from 'express';
import { createInquiry, deleteInquiry, getAllInquiry, getInquiryById, updateInquiry } from '../controller/inquiryController.js';

const inqRouter = express.Router();

inqRouter.post('/submit',createInquiry)
inqRouter.get('/viewAll',getAllInquiry)
inqRouter.put('/update/:inquiry_id',updateInquiry);
inqRouter.delete('/delete/:inquiry_id',deleteInquiry);
inqRouter.get("/:inquiry_id",getInquiryById);


export default inqRouter;