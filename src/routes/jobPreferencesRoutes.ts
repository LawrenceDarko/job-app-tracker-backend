import express from 'express';
import { upsertPreferences, getPreferences, deletePreferences } from '../controllers/jobPreferencesController';

const router = express.Router();

// Update or Create Job Preferences
router.post('/', upsertPreferences);

// Get Job Preferences by User ID
router.get('/', getPreferences);

// Delete Job Preferences
router.delete('/', deletePreferences);

export default router;
