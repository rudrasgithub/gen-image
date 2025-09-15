import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../config/mongodb.js';
import userRouter from '../routes/userRoutes.js'
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Connect to MongoDB
await connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [
        'https://gen-image-oija.onrender.com',
        'http://localhost:5173',
        'https://your-client-deployment.vercel.app'
    ]
}))

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

// For Vercel serverless functions
export default app;
