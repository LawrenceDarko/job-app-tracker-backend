import { Request, Response } from 'express';
import Document from '../models/Document';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';

// Upload a document
export const uploadDocument = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { type } = req.body;
        const file = req.file;

        if (!file){
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const newDocument = new Document({
            name: file.originalname,
            type: type || 'Other',
            size: `${(file.size / 1024).toFixed(2)}KB`,
            filePath: file.path,
            user: req.user._id,
        });

        await newDocument.save();

        res.status(201).json({ message: 'File uploaded successfully', document: newDocument });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
};

export const getUserDocuments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const documents = await Document.find({ user: req.user._id });
    
        res.status(200).json({ success: true, data: documents });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch all documents
export const getDocuments = async (_req: Request, res: Response) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
};

// Delete a document
export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Find the document belonging to the logged-in user
        const document = await Document.findOne({ _id: id, user: req.user._id });

        if (!document) {
            res.status(404).json({ message: 'Document not found or you do not have permission to delete it.' });
            return;
        }

        // Delete the file from the filesystem
        const filePath = path.resolve(document.filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove document entry from the database
        await document.deleteOne();

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Error deleting document', error });
    }
};
