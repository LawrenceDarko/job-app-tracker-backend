import express from 'express';
import {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    addJobToJobModel,
    getTopMatchingJobs,
} from '../controllers/jobPoolController';
import { fetchJobs } from '../jobs/fetchJobs';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/new-jobs', fetchJobs);
router.get('/top-matching', getTopMatchingJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/:id/add-to-jobs', addJobToJobModel);

export default router;
