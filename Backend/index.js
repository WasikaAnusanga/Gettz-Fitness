import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import verifyJWT from './middleware/auth.js';
import userRouter from './routes/userRouter.js';
import customerRouter from './routes/customerSupporterRouter.js';


dotenv.config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log('Connected to MongoDB');
    }
).catch(
    ()=>{
        console.error('Failed to connect to MongoDB');
    }
)

app.use(bodyParser.json());
app.use(verifyJWT);

app.use("/api/user",userRouter);
app.use("/api/customerSupporter", customerRouter);



app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})