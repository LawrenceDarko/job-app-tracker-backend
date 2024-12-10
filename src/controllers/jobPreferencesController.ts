import { Request, Response } from 'express';
import JobPreferences from '../models/JobPreferences';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Create or Update Job Preferences
export const upsertPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // const { preferences } = req.body;
        const userId = req.user._id;

        // console.log("Job Preference" ,req.body);

        // Find and update or create new preferences
        const updatedPreferences = await JobPreferences.findOneAndUpdate(
            { user: userId },
            { ...req.body },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedPreferences });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Job Preferences by User ID
export const getPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // console.log(req.user);
        const userId = req.user._id;

        const preferences = await JobPreferences.findOne({ user: userId });
        // console.log(preferences);
        if (!preferences) {
            res.status(404).json({ success: false, message: 'Preferences not found' });
            return;
        }

        res.status(200).json({ success: true, data: preferences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching preferences', error });
    }
};

// Delete Job Preferences
export const deletePreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;

        await JobPreferences.deleteOne({ user: userId });
        res.status(200).json({ success: true, message: 'Preferences deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting preferences', error });
    }
};
