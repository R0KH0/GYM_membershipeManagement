import React from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { PaymentType } from '../types';
import {
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

// Mock Data for Earnings
const earningsData = [
  { name: 'Jan', value: 12500 },
  { name: 'Feb', value: 15200 },
  { name: 'Mar', value: 18900 },
  { name: 'Apr', value: 16400 },
  { name: 'May', value: 21500 },
  { name: 'Jun', value: 19800 },
  { name: 'Jul', value: 24200 },
  { name: 'Aug', value: 28900 },
  { name: 'Sep', value: 32400 },
  { name: 'Oct', value: 30500 },
  { name: 'Nov', value: 35600 },
  { name: 'Dec', value: 38200 },
];

// Mock Data for Transactions
const MOCK_TRANSACTIONS = [
  { id: 't1', memberId: '1', memberName: 'Sarah Connor', date: '2023-12-01', amount: 150, type: PaymentType.SUBSCRIPTION, status: 'completed' },
  { id: 't2', memberId: '4', memberName: 'Clark Kent', date: '2023-12-01', amount: 150, type: PaymentType.RENEWAL, status: 'completed' },
  { id: 't3', memberId: '2', memberName: 'John Wick', date: '2023-11-28', amount: 50, type: PaymentType.FEE, status: 'completed' },
  { id: 't4', memberId: '5', memberName: 'Peter Parker', date: '2023-11-25', amount: 25, type: PaymentType.FEE, status: 'pending' },
  { id: 't5', memberId: '3', memberName: 'Bruce Wayne', date: '2023-11-20', amount: 500, type: PaymentType.SUBSCRIPTION, status: 'completed' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-panda-border p-3 rounded-lg shadow-xl z-50">
        <p className="text-gray-300 text-sm mb-1">{label}</p>
        <p className="text-panda-red font-bold text-lg">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, isPositive }) => (
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
    {/* TODO: fetch from /api/earnings/stats */}
  </div>
);

export const Earnings = () => {

  const downloadReceipt = (tx) => {
    const receiptContent = `
------------------------------------------------
           IRONPANDA GYM - RECEIPT
------------------------------------------------
Transaction ID: ${tx.id}
Date:           ${tx.date}
Member Name:    ${tx.memberName}
------------------------------------------------
Payment Type:   ${tx.type}
Amount Paid:    $${tx.amount.toFixed(2)}
Status:         ${tx.status.toUpperCase()}
------------------------------------------------
Thank you for training with us!
IronPanda Gym Management
------------------------------------------------
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${tx.memberName.replace(/\s+/g, '_')}_${tx.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Earnings" />
      
      <main className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto pb-20">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard title="Total Earning" value="$342,500" change="+15.3%" isPositive={true} />
          <StatCard title="This Month Earning" value="$38,200" change="+8.2%" isPositive={true} />
          <StatCard title="YTD Earning" value="$294,100" change="+12.1%" isPositive={true} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Revenue Growth Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                <div className="flex gap-2">
                    <span className="text-xs text-white bg-panda-red px-2 py-1 rounded shadow-neon">Yearly</span>
                </div>
             </div>
             {/* TODO: Load chart data here */}
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E60000" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E60000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                    <Area type="monotone" dataKey="value" stroke="#E60000" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Monthly Earnings Bar Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
                <button className="text-gray-500 hover:text-white"><Icons.More className="w-5 h-5" /></button>
             </div>
             {/* TODO: Load chart data here */}
             <div className="h-60 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                    <Bar dataKey="value" fill="#E60000" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#111] border border-panda-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-panda-border flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <button className="text-xs text-panda-red hover:text-white transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-panda-border bg-white/5">
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panda-border">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="text-white font-medium">{tx.memberName}</span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{tx.date}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300 border border-white/10">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-green-500 font-mono font-bold">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        tx.status === 'completed' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => downloadReceipt(tx)}
                        className="text-gray-500 hover:text-panda-red transition-colors p-2"
                        title="Download Receipt"
                      >
                        <Icons.Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};