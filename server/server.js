import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';

import userRouter from './routes/user.route.js';
import campaignRouter from './routes/campaign.route.js';
import donationRouter from './routes/donation.route.js';
import volunteerRouter from './routes/volunteer.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Connect to database and cloudinary
        await connectDB();
        await connectCloudinary();
        const allowedOrigins = [
             process.env.FRONTEND_URL, 
            'http://localhost:5173',
            'https://big-dreams-charitable-org-ab63.vercel.app'
        ];

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(cors({
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        app.get('/', (req, res) => {
            res.send('Backend is running');
        });

        app.use('/api/user', userRouter);
        app.use('/api/campaign', campaignRouter);
        app.use('/api/donation', donationRouter);
        app.use('/api/volunteer', volunteerRouter);

        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(err.status || 500).json({
                success: false,
                message: err.message || 'Internal Server Error'
            });
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1);
    }
})(); 