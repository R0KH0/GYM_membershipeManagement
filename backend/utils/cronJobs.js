import cron from 'node-cron';
import Member from '../models/memberModel.js';


export const startCronJobs = () => {
    // runs daily at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();
            // expire members whose endDate < now and are not already expired or cancelled
            const res = await Member.updateMany({ endDate: { $lt: now }, status: { $in: ['active','pending','frozen'] } }, { status: 'expired' });
            console.log('Cron job: expired members updated', res.modifiedCount);
        } catch (err) {
            console.error('Cron job error', err);
        }
    });
}