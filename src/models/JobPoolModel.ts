import mongoose, { Document, Schema } from 'mongoose';

export interface IJobPool extends Document {
    title: string;
    company: string;
    date: Date;
    status: 'pending' | 'applied' | 'interview' | 'offer' | 'rejected';
    location: string;
    jobType: 'full-time' | 'part-time'| 'contract' | 'internship';
    workingOption: 'remote' | 'onsite' | 'hybrid';
    maxSalary?: number;
    minSalary?: number;
    description?: string;
    link?: string;
    saved: boolean;
    interviewDate?: Date;
    deadline?: Date;
    MatchedObjectId: string;
    user: mongoose.Types.ObjectId;
}

const jobPoolSchema = new Schema<IJobPool>({
    title: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'applied', 'interview', 'offer', 'rejected'], default: 'pending', },
    location: { type: String, required: true },
    jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true, },
    workingOption: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true, },
    maxSalary: Number,
    minSalary: Number,
    description: String,
    link: String,
    saved: { type: Boolean, default: false },
    interviewDate: Date,
    deadline: Date,
    MatchedObjectId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
});

const JobPool = mongoose.model<IJobPool>('JobPool', jobPoolSchema);

export default JobPool;
