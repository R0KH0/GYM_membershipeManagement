import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { Member, MemberStatus } from '../types';
import { MemberModal } from '../components/MemberModals';

// Mock Data
const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Sarah Connor', phone: '+1 (555) 000-1111', joinDate: '2023-10-12', createdBy: 'Admin', status: MemberStatus.ACTIVE },
  { id: '2', name: 'John Wick', phone: '+1 (555) 999-2222', joinDate: '2023-09-05', createdBy: 'Trainer Mike', status: MemberStatus.FROZEN },
  { id: '3', name: 'Bruce Wayne', phone: '+1 (555) 123-4567', joinDate: '2023-11-01', createdBy: 'Admin', status: MemberStatus.PENDING },
  { id: '4', name: 'Clark Kent', phone: '+1 (555) 321-7654', joinDate: '2023-01-15', createdBy: 'Admin', status: MemberStatus.ACTIVE },
  { id: '5', name: 'Peter Parker', phone: '+1 (555) 888-7777', joinDate: '2023-08-20', createdBy: 'Trainer Mike', status: MemberStatus.CANCELLED },
];

const StatusPill = ({ status }: { status: MemberStatus }) => {
  const styles = {
    [MemberStatus.ACTIVE]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [MemberStatus.FROZEN]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [MemberStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [MemberStatus.CANCELLED]: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export const Members: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);

  // TODO: fetch member list from database
  // useEffect(() => { fetch('/api/members')... }, [])

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedMember(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const filteredMembers = MOCK_MEMBERS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesDate = dateFilter === '' || m.joinDate === dateFilter;
    const matchesCreator = creatorFilter === '' || m.createdBy.toLowerCase().includes(creatorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDate && matchesCreator;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setCreatorFilter('');
  };

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Members Management" />
      
      <main className="p-8 space-y-8">
        
        {/* Top Cards */}
        {/* TODO: fetch from /api/members/stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Members</p>
             <p className="text-3xl font-bold text-white">1,240</p>
           </div>
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Active</p>
             <p className="text-3xl font-bold text-panda-red">892</p>
           </div>
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">New This Month</p>
             <p className="text-3xl font-bold text-white">+45</p>
           </div>
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
              
              {/* Search Name/Phone */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Name or Phone..." 
                    className="w-full bg-[#111] border border-panda-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all placeholder-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Status */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value={MemberStatus.ACTIVE}>Active</option>
                    <option value={MemberStatus.FROZEN}>Frozen</option>
                    <option value={MemberStatus.PENDING}>Pending</option>
                    <option value={MemberStatus.CANCELLED}>Cancelled</option>
                  </select>
                  <Icons.Down className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Filter Created By */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Created By</label>
                <div className="relative">
                  <Icons.User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Admin, Trainer..." 
                    className="w-full bg-[#111] border border-panda-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all placeholder-gray-600"
                    value={creatorFilter}
                    onChange={(e) => setCreatorFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Join Date */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Joined On</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all [color-scheme:dark]"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                  {dateFilter && (
                     <button 
                       onClick={() => setDateFilter('')}
                       className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                     >
                       <Icons.Close className="w-5 h-5" />
                     </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full xl:w-auto">
              {(searchTerm || statusFilter !== 'all' || dateFilter || creatorFilter) && (
                <button 
                  onClick={clearFilters}
                  className="flex-1 xl:flex-none bg-[#111] border border-panda-border text-gray-300 px-4 py-2.5 rounded-xl hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2 h-[46px] mt-auto"
                >
                  <Icons.Close className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}

              <button 
                onClick={handleAdd}
                className="flex-1 xl:flex-none bg-panda-red text-white px-6 py-2.5 rounded-xl font-medium shadow-neon hover:bg-red-600 transition-all flex items-center justify-center gap-2 h-[46px] mt-auto whitespace-nowrap"
              >
                <Icons.Plus className="w-5 h-5" />
                <span>ADD MEMBER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111] border border-panda-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-panda-border bg-white/5">
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-16 text-center">Edit</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Join Date</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Created By</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panda-border">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEdit(member)}
                        className="text-gray-500 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-all"
                      >
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-sm">{member.phone}</td>
                    <td className="p-4 text-gray-400 text-sm">{member.joinDate}</td>
                    <td className="p-4 text-gray-400 text-sm">{member.createdBy}</td>
                    <td className="p-4">
                      <StatusPill status={member.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredMembers.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <Icons.Search className="w-8 h-8 mb-3 opacity-20" />
              <p>No members found matching your filters.</p>
              <button onClick={clearFilters} className="text-panda-red text-sm mt-2 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </main>

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        memberData={selectedMember}
      />
    </div>
  );
};