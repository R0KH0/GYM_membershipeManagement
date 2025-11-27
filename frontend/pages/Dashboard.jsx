import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { api } from '../src/api/axios';
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

// Custom Tooltip for Recharts to match Dark Theme
const CustomTooltip = ({ active, payload, label }) => {
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

export const Dashboard = () => {
  // Stats state
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newMembersThisMonth: 0,
    memberChange: '+0%'
  });
  const [earningsStats, setEarningsStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    monthChange: '+0%'
  });

  // Chart data
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [memberGrowthData, setMemberGrowthData] = useState([]);

  // View toggles for Member Growth chart
  const [memberViewMode, setMemberViewMode] = useState('monthly'); // 'monthly' or 'daily'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingEarnings, setIsLoadingEarnings] = useState(true);
  const [isLoadingMemberChart, setIsLoadingMemberChart] = useState(true);

  // Fetch member statistics
  useEffect(() => {
    const fetchMemberStats = async () => {
      try {
        setIsLoadingStats(true);
        const res = await api.get('api/members/stats');
        setMemberStats(res.data);
      } catch (error) {
        console.error('Error fetching member stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchMemberStats();
  }, []);

  // Fetch earnings statistics
  useEffect(() => {
    const fetchEarningsStats = async () => {
      try {
        setIsLoadingEarnings(true);
        const [statsRes, monthlyRes] = await Promise.all([
          api.get('api/payments/earnings/stats'),
          api.get('api/payments/earnings/monthly')
        ]);
        setEarningsStats(statsRes.data);
        setMonthlyEarnings(monthlyRes.data);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setIsLoadingEarnings(false);
      }
    };

    fetchEarningsStats();
  }, []);

  // Fetch member growth data based on view mode
  useEffect(() => {
    const fetchMemberGrowth = async () => {
      try {
        setIsLoadingMemberChart(true);
        
        if (memberViewMode === 'monthly') {
          const res = await api.get(`api/members/growth/monthly?year=${selectedYear}`);
          setMemberGrowthData(res.data);
        } else {
          const res = await api.get(`api/members/growth/daily?year=${selectedYear}&month=${selectedMonth}`);
          setMemberGrowthData(res.data);
        }
      } catch (error) {
        console.error('Error fetching member growth:', error);
      } finally {
        setIsLoadingMemberChart(false);
      }
    };

    fetchMemberGrowth();
  }, [memberViewMode, selectedYear, selectedMonth]);

  const formatCurrency = (amount) => `${amount.toLocaleString()} DH`;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const availableYears = [2023, 2024, 2025, 2026];

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Dashboard" />
      
      <main className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard 
            title="Total Earnings" 
            value={formatCurrency(earningsStats.totalEarnings)} 
            change={earningsStats.monthChange}
            isPositive={earningsStats.monthChange.startsWith('+')}
            isLoading={isLoadingEarnings}
          />
          <StatCard 
            title="This Month Earnings" 
            value={formatCurrency(earningsStats.thisMonthEarnings)} 
            isLoading={isLoadingEarnings}
          />
          <StatCard 
            title="Total Members" 
            value={memberStats.totalMembers.toLocaleString()} 
            change={memberStats.memberChange}
            isPositive={memberStats.memberChange.startsWith('+')}
            isLoading={isLoadingStats}
          />
        </div>

        {/* Financial Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Revenue Growth Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Yearly</span>
             </div>
             
             {isLoadingEarnings ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyEarnings}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E60000" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#E60000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                      <Area type="monotone" dataKey="value" stroke="#E60000" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>

          {/* Monthly Earnings Bar Chart */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
                <button className="text-gray-500 hover:text-white"><Icons.More className="w-5 h-5" /></button>
             </div>
             
             {isLoadingEarnings ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                      <Bar dataKey="value" fill="#E60000" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>

        </div>

        {/* Membership Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Member Growth Chart - WITH TOGGLE */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-white">Member Growth</h3>
                
                {/* Controls */}
                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-panda-border">
                    <button
                      onClick={() => setMemberViewMode('monthly')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        memberViewMode === 'monthly'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setMemberViewMode('daily')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        memberViewMode === 'daily'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                  </div>

                  {/* Year Selector */}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Month Selector - Only show in daily mode */}
                  {memberViewMode === 'daily' && (
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                    >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
             </div>
             
             {isLoadingMemberChart ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memberGrowthData}>
                      <defs>
                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#555" 
                        tick={{fill: '#555'}} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{stroke: '#333', strokeWidth: 1}} />
                      <Area type="monotone" dataKey="totalMembers" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorMembers)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>

          {/* New Members Chart - WITH INDEPENDENT TOGGLE */}
          <div className="bg-[#111] border border-panda-border p-4 md:p-6 rounded-2xl">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-white">
                  {memberViewMode === 'monthly' ? 'Monthly New Members' : 'Daily New Members'}
                </h3>
                
                {/* Same Controls as Member Growth */}
                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-panda-border">
                    <button
                      onClick={() => setMemberViewMode('monthly')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        memberViewMode === 'monthly'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setMemberViewMode('daily')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        memberViewMode === 'daily'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                  </div>

                  {/* Year Selector */}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Month Selector - Only show in daily mode */}
                  {memberViewMode === 'daily' && (
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                    >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
             </div>
             
             {isLoadingMemberChart ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#555" 
                        tick={{fill: '#555'}} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis stroke="#555" tick={{fill: '#555'}} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                      <Bar dataKey="newMembers" fill="#333" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
             )}
          </div>
          
        </div>
      </main>
    </div>
  );
};