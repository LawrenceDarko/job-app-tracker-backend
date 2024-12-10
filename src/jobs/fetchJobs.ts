import axios from 'axios';
// import JobPool, { IJobPool } from '../models/JobPoolModel';/
import dotenv from 'dotenv';
import JobPool, { IJobPool } from '../models/JobPoolModel';
import jobPreferences from '../models/JobPreferences';
// import JobPool from '../models/JobPoolModel';

dotenv.config();

interface PositionRemuneration {
    MaximumRange: string;
    MinimumRange: string;
}

interface MatchedObjectDescriptor {
    PositionTitle: string;
    OrganizationName: string;
    PositionLocationDisplay: string;
    PositionSchedule: { Code: string }[];
    UserArea: { Details: { TeleworkEligible: boolean; JobSummary: string } };
    PositionRemuneration: PositionRemuneration[];
    ApplyURI: string[];
    ApplicationCloseDate: string;
}

interface JobAPIResponseItem {
    MatchedObjectId: string;
    MatchedObjectDescriptor: MatchedObjectDescriptor;
}

export const fetchJobs = async (): Promise<void> => {
    try {
        const jobpreferenceces = await jobPreferences.find();
        const response = await axios.get('https://data.usajobs.gov/api/search', {
            headers: {
                'Host': 'data.usajobs.gov',
                'User-Agent': 'axios',
                'Authorization-Key': process.env.USAJOBS_API_KEY,
            },
        });
        const jobs: JobAPIResponseItem[] = response.data.SearchResult.SearchResultItems;

        for (const job of jobs) {
            const jobData = job.MatchedObjectDescriptor;
            const MatchedObjectId = job.MatchedObjectId

            // Check if the job already exists in the JobPool by title and company
            const existingJob = await JobPool.findOne({
                title: jobData.PositionTitle,
                company: jobData.OrganizationName,
                MatchedObjectId: MatchedObjectId
            });

            // Skip this job if it already exists
            if (existingJob) {
                console.log(`Job "${jobData.PositionTitle}" at "${jobData.OrganizationName}" already exists. Skipping.`);
                continue;
            }

            // Prepare the job data to add to the JobPool
            const newJob: Partial<IJobPool> = {
                MatchedObjectId,
                title: jobData.PositionTitle,
                company: jobData.OrganizationName,
                location: jobData.PositionLocationDisplay,
                jobType: jobData.PositionSchedule[0].Code === '1' ? 'full-time' : 'part-time',
                workingOption: jobData.UserArea.Details.TeleworkEligible
                    ? 'remote'
                    : jobData.PositionLocationDisplay.includes(',')
                    ? 'hybrid'
                    : 'onsite',
                maxSalary: jobData.PositionRemuneration[0]?.MaximumRange
                    ? parseFloat(jobData.PositionRemuneration[0].MaximumRange)
                    : undefined,
                minSalary: jobData.PositionRemuneration[0]?.MinimumRange
                    ? parseFloat(jobData.PositionRemuneration[0].MinimumRange)
                    : undefined,
                description: jobData.UserArea.Details.JobSummary,
                link: jobData.ApplyURI[0],
                deadline: new Date(jobData.ApplicationCloseDate),
                saved: false,
            };

            await JobPool.create(newJob);
            console.log(`Added new job: "${newJob.title}" at "${newJob.company}"`);
        }
    } catch (error) {
        console.error('Error fetching or saving jobs:', error);
    }
};









// import axios from 'axios';
// import JobPool, { IJobPool } from '../models/jobPoolModel';

// interface PositionRemuneration {
//     MaximumRange: string;
//     MinimumRange: string;
// }

// interface MatchedObjectDescriptor {
//     PositionTitle: string;
//     OrganizationName: string;
//     PositionLocationDisplay: string;
//     PositionSchedule: { Code: string }[];
//     UserArea: { Details: { TeleworkEligible: boolean; JobSummary: string } };
//     PositionRemuneration: PositionRemuneration[];
//     ApplyURI: string[];
//     ApplicationCloseDate: string;
// }

// interface JobAPIResponseItem {
//     MatchedObjectDescriptor: MatchedObjectDescriptor;
// }

// export const fetchJobs = async (): Promise<void> => {
//     try {
//         const response = await axios.get('https://data.usajobs.gov/api/search?Keyword=software', {
//             headers: {
//                 'Host': 'data.usajobs.gov',
//                 'User-Agent': 'axios',
//                 'Authorization-Key': process.env.USAJOBS_API_KEY,
//             },
//         });
//         const jobs: JobAPIResponseItem[] = response.data.SearchResult.SearchResultItems;

//         for (const job of jobs) {
//             const jobData = job.MatchedObjectDescriptor;

//             const newJob: Partial<IJobPool> = {
//                 title: jobData.PositionTitle,
//                 company: jobData.OrganizationName,
//                 location: jobData.PositionLocationDisplay,
//                 jobType: jobData.PositionSchedule[0].Code === '1' ? 'full-time' : 'part-time',
//                 workingOption: jobData.UserArea.Details.TeleworkEligible
//                     ? 'remote'
//                     : jobData.PositionLocationDisplay.includes(',')
//                     ? 'hybrid'
//                     : 'onsite',
//                 maxSalary: jobData.PositionRemuneration[0]?.MaximumRange
//                     ? parseFloat(jobData.PositionRemuneration[0].MaximumRange)
//                     : undefined,
//                 minSalary: jobData.PositionRemuneration[0]?.MinimumRange
//                     ? parseFloat(jobData.PositionRemuneration[0].MinimumRange)
//                     : undefined,
//                 description: jobData.UserArea.Details.JobSummary,
//                 link: jobData.ApplyURI[0],
//                 deadline: new Date(jobData.ApplicationCloseDate),
//                 saved: false,
//             };

//             await JobPool.create(newJob);
//         }
//     } catch (error) {
//         console.error('Error fetching or saving jobs:', error);
//     }
// };





