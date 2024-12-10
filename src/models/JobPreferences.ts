import mongoose, { Schema, Document } from 'mongoose';

interface IJobPreferences extends Document {
    industries: string[];
    jobType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    remote: boolean;
    keywords: string[];
    locations: string[];
    notifications: {
        email: boolean;
        sms: boolean;
    };
    user: mongoose.Types.ObjectId;
}

const JobPreferencesSchema: Schema = new Schema({
    industries: { type: [String], required: true },
    jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], required: true },
    remote: { type: Boolean, required: true },
    keywords: { type: [String], required: true },
    locations: { type: [String], required: true },
    notifications: {
        email: { type: Boolean, required: true },
        sms: { type: Boolean, required: true },
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
);

export default mongoose.model<IJobPreferences>('JobPreferences', JobPreferencesSchema);
