import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import verifyJWT from './middleware/auth.js';
import userRouter from './routes/userRouter.js';
import customerRouter from './routes/customerSupporterRouter.js';
import trainerRouter from './routes/trainerRoute.js';
import adminRouter from './routes/adminRoute.js';
import loggingRouter from './routes/loggingRoute.js';
import equipmentManagerRouter from './routes/equipmentManagerRoute.js';
import subscriptionRouter from './routes/subscriptionRouter.js';
import planRouter from './routes/plansRouter.js';
import equipmentRouter from './routes/equipmentRoute.js';
import supplementRouter from './routes/supplementRoute.js';
import authRoutes from './routes/auth.js';
import videoRouter from './routes/videoRoute.js';


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
app.use("/api/trainer", trainerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/logging",loggingRouter);
app.use("/api/equipmentManager",equipmentManagerRouter);

app.use("/api/equipment",equipmentRouter);
app.use("/api/supplement",supplementRouter);

app.use("/api/plan",planRouter);
app.use("/api/sub",subscriptionRouter);
app.use('/api/auth', authRoutes);
app.use("/api/video",videoRouter);

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})