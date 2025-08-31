import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
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

import notificationRouter from './routes/notificationRouter.js';


dotenv.config();

const app = express();
app.use(cors());



// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for your frontend URL in production
    methods: ['GET', 'POST', 'DELETE']
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room based on user ID (sent from frontend)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});
export { io };



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

app.use("/api/plan",planRouter);
app.use("/api/sub",subscriptionRouter);
app.use('/api/auth', authRoutes);
app.use("/api/video",videoRouter);

app.use("/api/leaderboard", leaderboardRouter)
app.use("/api/challenge", challengeRouter)
app.use("/api/comfeed", comPostRouter)

app.use('/api/notification',notificationRouter)

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})