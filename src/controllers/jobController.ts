import { Request, Response } from 'express';
import Job, {IJob } from '../models/JobModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import JobPool from '../models/JobPoolModel';

// Create a job application
export const createJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const job: IJob = await Job.create({...req.body, user: req.user._id});
        res.status(201).json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all job applications
export const getJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // console.log("User", req.user)
        const jobs = await Job.find({ user: req.user._id });
        res.status(200).json({success: true, data: jobs});
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single job application by ID
export const getJobById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update a job application by ID
export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json({success: true, data: job});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a job application by ID
export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Save a job application to saved list
export const saveJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { saved: true }, { new: true });
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all saved job applications
export const getSavedJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const jobs = await JobPool.find({ user: req.user._id, saved: true });
        // console.log(jobs);
        res.status(200).json(jobs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get statistics on job applications
export const getJobStatistics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const totalApplications = await Job.countDocuments({ user: userId });
        const totalInterviews = await Job.countDocuments({ user: userId, status: 'interview' });
        const offersReceived = await Job.countDocuments({ user: userId, status: 'offer' });
        const rejectedApplications = await Job.countDocuments({ user: userId, status: 'rejected' });

        res.status(200).json({
            totalApplications,
            totalInterviews,
            offersReceived,
            rejectedApplications
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get upcoming interviews
export const getUpcomingInterviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const currentDate = new Date();
        const jobs = await Job.find({
            user: req.user._id,
            status: 'interview',
            interviewDate: { $gte: currentDate }
        }).sort({ interviewDate: 1 });  // Sort by interviewDate in ascending order

        res.status(200).json({ success: true, data: jobs });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const currentDate = new Date();
        const jobs = await Job.find({
            user: req.user._id,
            deadline: { $gte: currentDate }
        }).sort({ deadline: 1 });  // Sort by deadline in ascending order

        res.status(200).json({ success: true, data: jobs });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get recent job activities
export const getRecentActivities = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const recentJobs = await Job.find({ user: req.user._id })
            .sort({ updatedAt: -1 })  // Sort by latest updated first
            .limit(10);  // Limit to last 10 activities

        res.status(200).json(recentJobs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};