
import { Member, MemberStatus, EarningMember, ChartData } from '../types';

export const members: Member[] = [
    { id: 1, name: 'Rufus Shannon', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Active },
    { id: 2, name: 'Stephen Snow', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Active },
    { id: 3, name: 'Peter Walker', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Frozen },
    { id: 4, name: 'Aaron Richards', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Pending },
    { id: 5, name: 'Joe Hagen', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Active },
    { id: 6, name: 'Claude Glover', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Cancelled },
    { id: 7, name: 'William Kessler', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Active },
    { id: 8, name: 'Jessie Dickson', phone: '0600000000', date: '2025-11-15 22:53 GMT', createdBy: 'Rufus Shannon', status: MemberStatus.Active },
];

export const earningMembers: EarningMember[] = [
    { id: 1, name: 'Ahmed Ali', type: 'subscription', price: 400 },
    { id: 2, name: 'Mouhamed Hamouch', type: 'subscription', price: 300 },
    { id: 3, name: 'Aya Ibno El fakir', type: 'subscription', price: 100 },
    { id: 4, name: 'Amine mohamed', type: 'subscription', price: 1000 },
    { id: 5, name: 'Wiam bnt iblad', type: 'subscription', price: 2000 },
    { id: 6, name: 'Soufyan Zid', type: 'subscription', price: 200 },
    { id: 7, name: 'Youssef malik', type: 'subscription', price: 200 },
    { id: 8, name: 'Youssef malik', type: 'subscription', price: 200 },
    { id: 9, name: 'Youssef malik', type: 'subscription', price: 200 },
];

export const monthlyEarningData: ChartData[] = [
    { name: 'Jan', value: 58000 },
    { name: 'Feb', value: 72000 },
    { name: 'Mar', value: 65000 },
    { name: 'Apr', value: 81000 },
    { name: 'May', value: 56000 },
    { name: 'Jun', value: 75000 },
    { name: 'Jul', value: 50000 },
    { name: 'Aug', value: 78000 },
    { name: 'Sep', value: 92000 },
    { name: 'Oct', value: 85000 },
    { name: 'Nov', value: 95000 },
    { name: 'Dec', value: 88000 },
];

export const thisMonthLineData: ChartData[] = [
    { name: 'W1', value: 25000 },
    { name: 'W2', value: 30000 },
    { name: 'W3', value: 28000 },
    { name: 'W4', value: 35000 },
    { name: 'W5', value: 41000 },
];
