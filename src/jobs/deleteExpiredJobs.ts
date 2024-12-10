import JobPool, { IJobPool } from '../models/JobPoolModel';

// Function to delete jobs past their deadline
export const deleteExpiredJobs = async (): Promise<void> => {
    try {
        const now = new Date();

        // Find and delete all jobs with deadlines in the past
        const result = await JobPool.deleteMany({ deadline: { $lte: now } });

        console.log(`${result.deletedCount} expired jobs were removed from the JobPool.`);
    } catch (error) {
        console.error('Error deleting expired jobs:', error);
    }
};