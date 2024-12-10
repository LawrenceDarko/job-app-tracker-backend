import express from 'express';
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    saveJob,
    getSavedJobs,
    getJobStatistics,
    getRecentActivities,
    getUpcomingDeadlines,
    getUpcomingInterviews
} from '../controllers/jobController';
import { fetchJobs } from '../jobs/fetchJobs';

const router = express.Router();

// Job statistics and analysis
router.get('/stats', getJobStatistics);
router.get('/interviews/upcoming', getUpcomingInterviews);
router.get('/deadlines/upcoming', getUpcomingDeadlines);
router.get('/activities/recent', getRecentActivities);

// Job creation and retrieval
router.post('/', createJob);
router.get('/', getJobs);
router.get('/saved', getSavedJobs);
router.get('/:id', getJobById);  // Place this last in order

// Job updates and deletion
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/save', saveJob);



export default router;
