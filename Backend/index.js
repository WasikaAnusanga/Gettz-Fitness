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
import leaderboardRouter from './routes/leaderboardRouter.js'
import challengeRouter from './routes/challengeRouter.js'
import comPostRouter from './routes/comPostRouter.js'
import equipmentRouter from './routes/equipmentRoute.js';
import authRoutes from './routes/auth.js';
import videoRouter from './routes/videoRoute.js';
import paymentRouter from './routes/paymentRoute.js';

import mealPlanRouter from './routes/mealPlanRoute.js';
import employeeSalaryRouter from './routes/employeeSalaryRoute.js';
import employeeSalaryRecordsRouter from './routes/employeeSalaryRecordsRoute.js';
import mealRequestRouter from './routes/mealRequestRouter.js';
import notificationRouter from './routes/notificationRouter.js';


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
app.use("/api/mealPlan", mealPlanRouter);
app.use("/api/employeeSalary", employeeSalaryRouter);
app.use("/api/employeeSalarayRecords", employeeSalaryRecordsRouter);
app.use("/api/mealRequest", mealRequestRouter);

app.use("/api/plan",planRouter);
app.use("/api/sub",subscriptionRouter);
app.use('/api/auth', authRoutes);
app.use("/api/video",videoRouter);
app.use("/api/pay",paymentRouter);

app.use("/api/leaderboard", leaderboardRouter)
app.use("/api/challenge", challengeRouter)
app.use("/api/comfeed", comPostRouter)

app.use('/api/notification',notificationRouter)

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})

app.post("/chatbot", async (req, res) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});