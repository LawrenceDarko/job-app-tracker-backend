import { Request, Response } from 'express';
import SavedJob from '../models/savedJobsModel';
import JobPool from '../models/JobPoolModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Save a job from JobPool
export const saveJob = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { jobId } = req.body;
        console.log("Job ID", jobId);
        const userId = req.user._id;

        if (!userId || !jobId) {
            res .status(400) .json({ success: false, message: 'User ID and Job ID are required' });
            return;
        }

        // Check if the job already exists in saved jobs
        const existingSavedJob = await SavedJob.findOne({ user: userId, jobPoolId: jobId });
        if (existingSavedJob) {
            res .status(400) .json({ success: false, message: 'Job is already saved' });
            return;
        }

        // Fetch job details from JobPool
        const job = await JobPool.findById(jobId);
        if (!job) {
            res .status(404) .json({ success: false, message: 'Job not found in JobPool' });
            return;
        }

        // Copy job details to SavedJobs
        const savedJob = new SavedJob({
            user: userId,
            title: job.title,
            company: job.company,
            date: job.date,
            status: job.status,
            location: job.location,
            jobType: job.jobType,
            workingOption: job.workingOption,
            maxSalary: job.maxSalary,
            minSalary: job.minSalary,
            description: job.description,
            link: job.link,
            interviewDate: job.interviewDate,
            deadline: job.deadline,
            jobPoolId: job._id
        });

        await savedJob.save();

        res .status(201) .json({ success: true, message: 'Job saved successfully', data: savedJob });
        return;
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        return;
    }
};

// Remove a saved job
export const removeSavedJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedJob = await SavedJob.findByIdAndDelete(id);
        if (!deletedJob) {
            res .status(404) .json({ success: false, message: 'Saved job not found' }); 
            return;
        }
        

        res .status(200) .json({ success: true, message: 'Job removed successfully' });
    } catch (error) {
        console.error('Error removing job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        return;
    }
};

// Get all saved jobs for a user
export const getSavedJobs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user._id;

        const savedJobs = await SavedJob.find({ user: userId });

        res.status(200).json({ success: true, count: savedJobs.length, data: savedJobs});
        return;
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        return;
    }
};
