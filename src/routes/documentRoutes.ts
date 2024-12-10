import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments, deleteDocument, getUserDocuments } from '../controllers/documentsController';
import protect from '../middleware/authMiddleware';

const router = Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Routes
router.get('/', getUserDocuments); // Get all documents for the logged-in user
router.get('/documents', getDocuments); // Fetch all documents
router.post('/upload', upload.single('file'), uploadDocument); // File upload
router.delete('/:id', deleteDocument); // Delete a document

export default router;
