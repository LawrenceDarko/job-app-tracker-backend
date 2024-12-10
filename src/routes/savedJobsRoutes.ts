import express from 'express';
import { getSavedJobs, removeSavedJob, saveJob } from '../controllers/savedJobsController';


const router = express.Router();

router.post('/save', saveJob); // Save a job
router.delete('/remove/:id', removeSavedJob); // Remove a saved job
router.get('/', getSavedJobs); // Get all saved jobs for a user

export default router;
