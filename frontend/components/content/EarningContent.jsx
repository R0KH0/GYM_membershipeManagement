import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatCard from '../StatCard';
import { earningMembers, monthlyEarningData, thisMonthLineData } from '../../data/mockData';

const EarningMembersTable = ({ members }) => (
    <div className="bg-brand-gray p-4 rounded-xl flex-1">
        <h3 className="text-lg font-semibold text-white mb-4 px-2">Members List</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="p-2 text-sm font-semibold text-brand-light-gray">Name</th>
                        <th className="p-2 text-sm font-semibold text-brand-light-gray">Cose</th>
                        <th className="p-2 text-sm font-semibold text-red-500">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id} className="border-b border-gray-800">
                            <td className="p-3 text-white">{member.name}</td>
                            <td className="p-3 text-brand-light-gray">{member.type}</td>
                            <td className="p-3 text-brand-light-gray">{member.price} Dh</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ThisMonthChart = () => (
    <div className="bg-brand-gray p-4 rounded-xl h-64">
        <h3 className="text-lg font-semibold text-white mb-4">This Month</h3>
        <ResponsiveContainer width="100%" height="80%">
             <AreaChart data={thisMonthLineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E60000" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#E60000" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#B3B3B3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B3B3B3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FFFFFF' }}/>
                <Area type="monotone" dataKey="value" stroke="#E60000" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const MonthlyEarningChart = () => (
    <div className="bg-brand-gray p-4 rounded-xl h-64">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly earning</h3>
        <ResponsiveContainer width="100%" height="80%">
            <BarChart data={monthlyEarningData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#B3B3B3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B3B3B3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FFFFFF' }}/>
                <Bar dataKey="value" fill="#E60000" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const EarningContent = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Earning" value="45,678.90 DH" />
                <StatCard title="This Month Earning" value="10,540.00 DH" change="+33% month over last month" changeType="increase" />
                <StatCard title="Total Members" value="476" change="-8% month over last month" changeType="decrease" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EarningMembersTable members={earningMembers} />
                </div>
                <div className="space-y-8">
                    <ThisMonthChart />
                    <MonthlyEarningChart />
                </div>
            </div>
        </div>
    );
};

export default EarningContent;