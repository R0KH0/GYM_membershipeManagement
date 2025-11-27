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
  const [revenueGrowthData, setRevenueGrowthData] = useState([]);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);
  const [memberGrowthData, setMemberGrowthData] = useState([]);
  const [newMembersData, setNewMembersData] = useState([]);

  // View toggles for Revenue Growth chart (LEFT CHART - Earnings)
  const [revenueViewMode, setRevenueViewMode] = useState('monthly');
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [revenueMonth, setRevenueMonth] = useState(new Date().getMonth() + 1);

  // View toggles for Monthly Earnings chart (RIGHT CHART - Earnings)
  const [earningsViewMode, setEarningsViewMode] = useState('monthly');
  const [earningsYear, setEarningsYear] = useState(new Date().getFullYear());
  const [earningsMonth, setEarningsMonth] = useState(new Date().getMonth() + 1);

  // View toggles for Member Growth chart (LEFT CHART)
  const [memberViewMode, setMemberViewMode] = useState('monthly'); // 'monthly' or 'daily'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12

  // View toggles for New Members chart (RIGHT CHART)
  const [newMembersViewMode, setNewMembersViewMode] = useState('monthly'); // 'monthly' or 'daily'
  const [newMembersYear, setNewMembersYear] = useState(new Date().getFullYear());
  const [newMembersMonth, setNewMembersMonth] = useState(new Date().getMonth() + 1); // 1-12

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRevenueChart, setIsLoadingRevenueChart] = useState(true);
  const [isLoadingEarningsChart, setIsLoadingEarningsChart] = useState(true);
  const [isLoadingMemberChart, setIsLoadingMemberChart] = useState(true);
  const [isLoadingNewMembersChart, setIsLoadingNewMembersChart] = useState(true);

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
        setIsLoadingStats(true);
        const res = await api.get('api/payments/earnings/stats');
        setEarningsStats(res.data);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchEarningsStats();
  }, []);

  // Fetch Revenue Growth data (LEFT CHART - Earnings)
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

  // Fetch Monthly Earnings data (RIGHT CHART - Earnings)
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

  // Fetch member growth data based on view mode (LEFT CHART)
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

  // Fetch new members data based on view mode (RIGHT CHART)
  useEffect(() => {
    const fetchNewMembers = async () => {
      try {
        setIsLoadingNewMembersChart(true);
        
        if (newMembersViewMode === 'monthly') {
          const res = await api.get(`api/members/growth/monthly?year=${newMembersYear}`);
          setNewMembersData(res.data);
        } else {
          const res = await api.get(`api/members/growth/daily?year=${newMembersYear}&month=${newMembersMonth}`);
          setNewMembersData(res.data);
        }
      } catch (error) {
        console.error('Error fetching new members:', error);
      } finally {
        setIsLoadingNewMembersChart(false);
      }
    };

    fetchNewMembers();
  }, [newMembersViewMode, newMembersYear, newMembersMonth]);

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
            isLoading={isLoadingStats}
          />
          <StatCard 
            title="This Month Earnings" 
            value={formatCurrency(earningsStats.thisMonthEarnings)} 
            change={earningsStats.monthChange}
            isPositive={earningsStats.monthChange.startsWith('+')}
            isLoading={isLoadingStats}
          />
          <StatCard 
            title="Total Members" 
            value={memberStats.totalMembers.toLocaleString()} 
            isLoading={isLoadingStats}
          />
        </div>

        {/* Financial Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Revenue Growth Chart */}
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
                  {newMembersViewMode === 'monthly' ? 'Monthly New Members' : 'Daily New Members'}
                </h3>
                
                {/* Independent Controls for New Members Chart */}
                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-panda-border">
                    <button
                      onClick={() => setNewMembersViewMode('monthly')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        newMembersViewMode === 'monthly'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setNewMembersViewMode('daily')}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        newMembersViewMode === 'daily'
                          ? 'bg-panda-red text-white shadow-neon'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                  </div>

                  {/* Year Selector */}
                  <select
                    value={newMembersYear}
                    onChange={(e) => setNewMembersYear(Number(e.target.value))}
                    className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Month Selector - Only show in daily mode */}
                  {newMembersViewMode === 'daily' && (
                    <select
                      value={newMembersMonth}
                      onChange={(e) => setNewMembersMonth(Number(e.target.value))}
                      className="bg-black border border-panda-border text-white text-xs px-3 py-1 rounded-lg focus:outline-none focus:border-panda-red"
                    >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
             </div>
             
             {isLoadingNewMembersChart ? (
               <div className="h-60 md:h-72 w-full flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin"></div>
               </div>
             ) : (
               <div className="h-60 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newMembersData}>
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