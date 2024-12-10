import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedJob extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    company: string;
    date: Date;
    status: string;
    location: string;
    jobType: string;
    workingOption: string;
    maxSalary?: number;
    minSalary?: number;
    description?: string;
    link?: string;
    interviewDate?: Date;
    deadline?: Date;
    jobPoolId?: string;
}

const SavedJobSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        date: { type: Date, required: true },
        status: { type: String, enum: ['pending', 'applied', 'interview', 'offer', 'rejected'], required: true, },
        location: { type: String, required: true },
        jobType: { type: String, enum: ['full-time', 'part-time'], required: true },
        workingOption: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true, },
        maxSalary: { type: Number },
        minSalary: { type: Number },
        description: { type: String },
        link: { type: String },
        interviewDate: { type: Date },
        deadline: { type: Date },
        jobPoolId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);
