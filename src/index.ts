import express, { Application, Request, Response } from 'express';
// import './cronjobs/cronJobs'; 
import mongoose from 'mongoose';
import dbConfig from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import path from 'path';
import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import jobRoutes from './routes/jobRoutes';
import protect from './middleware/authMiddleware';
import cron from 'node-cron';
import { fetchJobs } from './jobs/fetchJobs';
import { deleteExpiredJobs } from './jobs/deleteExpiredJobs';
import jobPoolRoutes from './routes/jobPoolRoutes';
import jobPreferencesRoutes from './routes/jobPreferencesRoutes';
import savedJobsRoutes from './routes/savedJobsRoutes';
import documentRoutes from './routes/documentRoutes';

dotenv.config(); 

const app: Application = express();
app.use(compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
        if(req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}))

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://jobquestt.vercel.app', 'https://www.jobquestt.vercel.app'],
    credentials: true,
}));

app.use(bodyParser.json());

// app.use(express.urlencoded({ extended: true }));


// Database connection
mongoose.connect(dbConfig.url)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Subscription Routes
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', protect, jobRoutes);
app.use('/api/jobpool', protect, jobPoolRoutes);
app.use('/api/preferences', protect, jobPreferencesRoutes);
app.use('/api/saved-jobs', protect, savedJobsRoutes);
app.use('/api/documents', protect, documentRoutes);
// app.use('/uploads', express.static('uploads'));



// cron job Schedule for 8am, 12pm, and 6pm daily
cron.schedule('0 8,12,18 * * *', async () => {
    console.log('Running job fetch cron job');
    await fetchJobs();
});

// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to delete expired jobs...');
    await deleteExpiredJobs();
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
