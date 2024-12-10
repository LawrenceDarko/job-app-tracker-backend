import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
    name: string;
    type: string;
    size: string;
    uploadDate: Date;
    filePath: string;
    user: mongoose.Types.ObjectId;
}

const DocumentSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    filePath: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
