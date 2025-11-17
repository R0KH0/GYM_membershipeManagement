import React from 'react';
import StatCard from '../StatCard';
import { members } from '../../data/mockData';
import { MemberStatus } from '../../types';
import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full capitalize";
    const statusClasses = {
        [MemberStatus.Active]: "bg-green-500/20 text-green-400",
        [MemberStatus.Pending]: "bg-yellow-500/20 text-yellow-400",
        [MemberStatus.Frozen]: "bg-blue-500/20 text-blue-400",
        [MemberStatus.Cancelled]: "bg-red-500/20 text-red-500",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const MembersTable = ({ members }) => (
    <div className="bg-brand-gray p-4 md:p-6 rounded-xl mt-8">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="p-4 text-sm font-semibold text-brand-light-gray">Name</th>
                        <th className="p-4 text-sm font-semibold text-brand-light-gray">Phone</th>
                        <th className="p-4 text-sm font-semibold text-brand-light-gray">Date</th>
                        <th className="p-4 text-sm font-semibold text-brand-light-gray">Create By</th>
                        <th className="p-4 text-sm font-semibold text-brand-light-gray">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{member.name}</td>
                            <td className="p-4 text-brand-light-gray">{member.phone}</td>
                            <td className="p-4 text-brand-light-gray">{member.date}</td>
                            <td className="p-4 text-brand-light-gray">{member.createdBy}</td>
                            <td className="p-4"><StatusBadge status={member.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const MembersContent = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Members" 
                    value="571" 
                />
                <StatCard
                    title="Total Active"
                    value="300"
                    change="+33% month over last month"
                    changeType="increase"
                />
                <StatCard
                    title="This Month"
                    value="476"
                    change="-8% month over last month"
                    changeType="decrease"
                />
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search ..."
                        className="w-full bg-brand-gray border border-gray-700 rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-brand-gray border border-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800">
                        <FilterIcon className="h-5 w-5" />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-2 bg-brand-red text-white px-4 py-3 rounded-lg hover:bg-red-700">
                        <span className="text-xl font-light">+</span>
                        <span>ADD</span>
                    </button>
                </div>
            </div>

            <MembersTable members={members} />
        </div>
    );
};

export default MembersContent;