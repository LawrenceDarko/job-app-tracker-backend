import { Request, Response } from 'express';
import JobPool from '../models/JobPoolModel';
import Job from '../models/JobModel'; 
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import JobPreferences from '../models/JobPreferences';

// Get all jobs in the JobPool
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await JobPool.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch jobs', error });
    }
};

// Get a job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
        const job = await JobPool.findById(req.params.id);
        if (!job) {
            res.status(404).json({ message: 'Job post not found' });
        } else {
            res.status(200).json(job);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch job post', error });
    }
};

// Create a new job in the JobPool
export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobData = req.body;
        const newJob = await JobPool.create(jobData);
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create job', error });
    }
};

// Update a job in the JobPool
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedJob = await JobPool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            res.status(404).json({ message: 'Job not found' });
        } else {
            res.status(200).json(updatedJob);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update job', error });
    }
};

// Delete a job from the JobPool
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedJob = await JobPool.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            res.status(404).json({ message: 'Job not found' });
        } else {
            res.status(200).json({ message: 'Job deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete job', error });
    }
};

export const addJobToJobModel = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.id;

        // Find the job in the JobPool by ID
        const jobPoolEntry = await JobPool.findById(jobId);

        if (!jobPoolEntry) {
            res.status(404).json({ message: 'Job not found in JobPool' });
            return;
        }

        // Check if the job already exists in the Job model
        const existingJob = await Job.findOne({ title: jobPoolEntry.title, company: jobPoolEntry.company });
        if (existingJob) {
            res.status(409).json({ message: 'Application has already been opened for this job' });
            return;
        }

        // Create a new job entry in the Job model
        const newJob = new Job({
            title: jobPoolEntry.title,
            company: jobPoolEntry.company,
            date: jobPoolEntry.date,
            status: 'applied',
            location: jobPoolEntry.location,
            jobType: jobPoolEntry.jobType,
            workingOption: jobPoolEntry.workingOption,
            maxSalary: jobPoolEntry.maxSalary,
            minSalary: jobPoolEntry.minSalary,
            description: jobPoolEntry.description,
            link: jobPoolEntry.link,
            saved: jobPoolEntry.saved,
            interviewDate: jobPoolEntry.interviewDate,
            deadline: jobPoolEntry.deadline,
            user: req.user._id
        });

        // Save the new job to the Job model
        await newJob.save();

        res.status(201).json({ message: 'Job added to Job model', data: newJob });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add job to Job model', error });
    }
};


export const getTopMatchingJobs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const userPreferences = await JobPreferences.findOne({ user: userId });

        if (!userPreferences) {
            res.status(404).json({ success: false, message: 'Preferences not found' });
            return;
        }

        // Extract preferences from user preferences
        const {
            industries,
            jobType,
            remote,
            keywords,
            locations
        } = userPreferences;

        // Convert query parameters into usable filters
        const industryList = industries || [];
        const keywordList = keywords || [];
        const locationList = locations || [];

        // Build the query
        const query: any = {};

            // if (industryList.length > 0) {
            //     query['company'] = { $in: industryList };
            // }

            if (jobType) {
                query['jobType'] = jobType.toLowerCase();
            }

            if (remote) {
                query['workingOption'] = remote ? 'remote' : { $ne: 'remote' };
            }
            // if (locationList.length > 0) {
            //     // query['location'] = { $in: locationList };
            //     query['location'] = { $in: locationList.map((loc) => loc.toLowerCase()) };
            // }

            // if (keywordList.length > 0) {
            //     query['$or'] = keywordList.map((keyword) => ({
            //         title: { $regex: keyword, $options: 'i' },
            //     }));
            // }

        // Fetch the top 10 matching jobs
        const jobs = await JobPool.find(query)
        .sort({ deadline: 1 }) // Prioritize jobs with closer deadlines
        .limit(10);

        // Return the response
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        console.error('Error fetching matching jobs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
