import React from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock Data for Charts
const monthlyData = [
  { name: 'Jan', value: 4000, members: 24 },
  { name: 'Feb', value: 3000, members: 13 },
  { name: 'Mar', value: 5000, members: 98 },
  { name: 'Apr', value: 2780, members: 39 },
  { name: 'May', value: 1890, members: 48 },
  { name: 'Jun', value: 2390, members: 38 },
  { name: 'Jul', value: 3490, members: 43 },
];

const memberActivityData = [
  { name: 'Jan', totalMembers: 850, newMembers: 45 },
  { name: 'Feb', totalMembers: 895, newMembers: 52 },
  { name: 'Mar', totalMembers: 945, newMembers: 61 },
  { name: 'Apr', totalMembers: 998, newMembers: 58 },
  { name: 'May', totalMembers: 1050, newMembers: 65 },
  { name: 'Jun', totalMembers: 1110, newMembers: 72 },
  { name: 'Jul', totalMembers: 1180, newMembers: 81 },
];

// Custom Tooltip for Recharts to match Dark Theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-panda-border p-3 rounded-lg shadow-xl z-50">
        <p className="text-gray-300 text-sm mb-1">{label}</p>
        <p className="text-panda-red font-bold text-lg">
          {payload[0].name === 'value' ? '$' : ''}{payload[0].value.toLocaleString()}
          {payload[0].name !== 'value' ? '' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, isPositive }: { title: string, value: string, change: string, isPositive: boolean }) => (
  <div className="bg-[#111] border border-panda-border p-6 rounded-2xl hover:border-white/10 transition-colors duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-panda-red/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-panda-red/10 transition-all"></div>
    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-white">{value}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        isPositive
          ? 'bg-green-500/10 text-green-500 border-green-500/20'
          : 'bg-red-500/10 text-red-500 border-red-500/20'
      }`}>
        {change}
      </span>
    </div>
    {/* TODO: fetch from /api/earnings or /api/stats */}
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Dashboard" />
      
      <main className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard title="Total Earnings" value="$124,500" change="+12.5%" isPositive={true} />
          <StatCard title="This Month Earnings" value="$8,400" change="+5.2%" isPositive={true} />
          <StatCard title="Total Members" value="1,240" change="-1.1%" isPositive={false} />
        </div>

        {/* Financial Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Line Chart Container */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">This Month</span>
             </div>
             {/* TODO: Load chart data here */}
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E60000" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E60000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                    <Area type="monotone" dataKey="value" stroke="#E60000" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Bar Chart Container */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
                <button className="text-gray-500 hover:text-white"><Icons.More className="w-5 h-5" /></button>
             </div>
             {/* TODO: Load chart data here */}
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                    <Bar dataKey="value" fill="#E60000" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* Membership Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Member Growth Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Member Growth</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">YTD</span>
             </div>
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memberActivityData}>
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                    <Area type="monotone" dataKey="totalMembers" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorMembers)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Monthly New Members Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Monthly New Members</h3>
                <button className="text-gray-500 hover:text-white"><Icons.More className="w-5 h-5" /></button>
             </div>
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                    <Bar dataKey="newMembers" fill="#333" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};