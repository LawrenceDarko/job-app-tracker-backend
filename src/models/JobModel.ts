import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    title: string;
    company: string;
    date: Date;
    status: 'pending' | 'applied' | 'interview' | 'offer' | 'rejected';
    location: string;
    jobType: 'full-time' | 'part-time';
    workingOption: 'remote' | 'onsite' | 'hybrid';
    maxSalary?: number;
    minSalary?: number;
    description?: string;
    link?: string;
    saved: boolean;
    interviewDate?: Date;
    deadline?: Date;
    user: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>({
    title: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'applied', 'interview', 'offer', 'rejected'], default: 'pending' },
    location: { type: String, required: true },
    jobType: { type: String, enum: ['full-time', 'part-time'], required: false },
    workingOption: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: false },
    maxSalary: { type: Number, required: false },
    minSalary: { type: Number, required: false },
    description: { type: String, required: false },
    link: { type: String, required: false },
    saved: { type: Boolean, default: false },
    interviewDate: { type: Date, required: false },
    deadline: { type: Date, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true});

export default mongoose.model<IJob>('Job', jobSchema);
