import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { api } from '../src/api/axios';
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-panda-border p-3 rounded-lg shadow-xl z-50">
        <p className="text-gray-300 text-sm mb-1">{label}</p>
        <p className="text-panda-red font-bold text-lg">
          {payload[0].value.toLocaleString()} DH
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, isPositive, isLoading }) => (
  <div className="bg-[#111] border border-panda-border p-6 rounded-2xl hover:border-white/10 transition-colors duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-panda-red/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-panda-red/10 transition-all"></div>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
    <div className="flex items-baseline gap-3">
      {isLoading ? (
        <div className="w-20 h-8 bg-gray-800 animate-pulse rounded"></div>
      ) : (
        <>
          <span className="text-3xl font-bold text-white">{value}</span>
          {change && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              isPositive
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
              {change}
            </span>
          )}
        </>
      )}
    </div>
  </div>
);

export const Earnings = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    ytdEarnings: 0,
    monthChange: '+0%'
  });

  // Chart data - SEPARATE for each chart
  const [revenueGrowthData, setRevenueGrowthData] = useState([]);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);
  
  const [transactions, setTransactions] = useState([]);

  // View toggles for Revenue Growth chart (LEFT CHART)
  const [revenueViewMode, setRevenueViewMode] = useState('monthly');
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [revenueMonth, setRevenueMonth] = useState(new Date().getMonth() + 1);

  // View toggles for Monthly Earnings chart (RIGHT CHART)
  const [earningsViewMode, setEarningsViewMode] = useState('monthly');
  const [earningsYear, setEarningsYear] = useState(new Date().getFullYear());
  const [earningsMonth, setEarningsMonth] = useState(new Date().getMonth() + 1);

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRevenueChart, setIsLoadingRevenueChart] = useState(true);
  const [isLoadingEarningsChart, setIsLoadingEarningsChart] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const availableYears = [2023, 2024, 2025, 2026];

  // Fetch earnings statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const res = await api.get('api/payments/earnings/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch Revenue Growth data (LEFT CHART)
  useEffect(() => {
    const fetchRevenueGrowth = async () => {
      try {
        setIsLoadingRevenueChart(true);
        
        if (revenueViewMode === 'monthly') {
          const res = await api.get(`api/payments/earnings/monthly?year=${revenueYear}`);
          setRevenueGrowthData(res.data);
        } else {
          const res = await api.get(`api/payments/earnings/daily?year=${revenueYear}&month=${revenueMonth}`);
          setRevenueGrowthData(res.data);
        }
      } catch (error) {
        console.error('Error fetching revenue growth:', error);
      } finally {
        setIsLoadingRevenueChart(false);
      }
    };

    fetchRevenueGrowth();
  }, [revenueViewMode, revenueYear, revenueMonth]);

  // Fetch Monthly Earnings data (RIGHT CHART)
  useEffect(() => {
    const fetchMonthlyEarnings = async () => {
      try {
        setIsLoadingEarningsChart(true);
        
        if (earningsViewMode === 'monthly') {
          const res = await api.get(`api/payments/earnings/monthly?year=${earningsYear}`);
          setMonthlyEarningsData(res.data);
        } else {
          const res = await api.get(`api/payments/earnings/daily?year=${earningsYear}&month=${earningsMonth}`);
          setMonthlyEarningsData(res.data);
        }
      } catch (error) {
        console.error('Error fetching monthly earnings:', error);
      } finally {
        setIsLoadingEarningsChart(false);
      }
    };

    fetchMonthlyEarnings();
  }, [earningsViewMode, earningsYear, earningsMonth]);

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        const res = await api.get('api/payments/all');
        // Show only the 10 most recent
        setTransactions(res.data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  const downloadReceipt = (tx) => {
    const receiptContent = `
================================================
           ROKHO's GYM - RECEIPT
================================================
Transaction ID: ${tx.id}
Date:           ${new Date(tx.date).toLocaleString()}
Member Name:    ${tx.memberName}
Phone:          ${tx.memberPhone || 'N/A'}
Email:          ${tx.memberEmail || 'N/A'}
================================================
Payment Method: ${tx.method.toUpperCase()}
Amount Paid:    ${tx.amount.toFixed(2)} DH
Period:         ${tx.periodMonths} Month(s)
Status:         ${tx.status.toUpperCase()}
================================================
${tx.notes ? `Notes: ${tx.notes}\n================================================\n` : ''}
Thank you for training with us!
ROKHO's Gym
================================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${tx.memberName.replace(/\s+/g, '_')}_${new Date(tx.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} DH`;
  };

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Earnings" />
      
      <main className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto pb-20">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard 
            title="Total Earning" 
            value={formatCurrency(stats.totalEarnings)} 
            isLoading={isLoadingStats}
          />
          <StatCard 
            title="This Month Earning" 
            value={formatCurrency(stats.thisMonthEarnings)} 
            change={stats.monthChange}
            isPositive={stats.monthChange.startsWith('+')}
            isLoading={isLoadingStats}
          />
          <StatCard 
            title="YTD Earning" 
            value={formatCurrency(stats.ytdEarnings)} 
            isLoading={isLoadingStats}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Revenue Growth Chart - WITH INDEPENDENT CONTROLS */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                
                {/* Controls for Revenue Chart */}
                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-panda-border">
                    <button
                      onClick={() => setRevenueViewMode('monthly')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        revenueViewMode === 'monthly'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setRevenueViewMode('daily')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        revenueViewMode === 'daily'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                  </div>

                  {/* Year Selector */}
                  <select
                    value={revenueYear}
                    onChange={(e) => setRevenueYear(Number(e.target.value))}
                    className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Month Selector - Only show in daily mode */}
                  {revenueViewMode === 'daily' && (
                    <select
                      value={revenueMonth}
                      onChange={(e) => setRevenueMonth(Number(e.target.value))}
                      className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                    >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
             </div>
             
             {isLoadingRevenueChart ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueGrowthData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E60000" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#E60000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                      <Area type="monotone" dataKey="value" stroke="#E60000" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>

          {/* Monthly Earnings Bar Chart - WITH INDEPENDENT CONTROLS */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-white">
                  {earningsViewMode === 'monthly' ? 'Monthly Earnings' : 'Daily Earnings'}
                </h3>
                
                {/* Controls for Earnings Chart */}
                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-panda-border">
                    <button
                      onClick={() => setEarningsViewMode('monthly')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        earningsViewMode === 'monthly'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setEarningsViewMode('daily')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        earningsViewMode === 'daily'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                  </div>

                  {/* Year Selector */}
                  <select
                    value={earningsYear}
                    onChange={(e) => setEarningsYear(Number(e.target.value))}
                    className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Month Selector - Only show in daily mode */}
                  {earningsViewMode === 'daily' && (
                    <select
                      value={earningsMonth}
                      onChange={(e) => setEarningsMonth(Number(e.target.value))}
                      className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                    >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
             </div>
             
             {isLoadingEarningsChart ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                      <Bar dataKey="value" fill="#E60000" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#111] border border-panda-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-panda-border flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-panda-border bg-white/5">
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panda-border">
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin" />
                        <span className="text-gray-500">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="text-white font-medium">{tx.memberName}</span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(tx.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300 border border-white/10 uppercase">
                          {tx.method}
                        </span>
                      </td>
                      <td className="p-4 text-green-500 font-mono font-bold">
                        {tx.amount.toFixed(2)} DH
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          tx.status === 'paid' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};