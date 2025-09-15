import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT;
const app = express();

await connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [
        'https://imagify-five-murex.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ]
}))

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})