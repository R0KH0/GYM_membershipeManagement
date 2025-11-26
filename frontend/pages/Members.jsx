import React, { useState, useEffect, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { MemberStatus } from '../types';
import { MemberModal, DeleteConfirmationModal } from '../components/MemberModals';
import { api } from '../src/api/axios';

// Status Pill
const StatusPill = ({ status }) => {
  const styles = {
    [MemberStatus.ACTIVE]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [MemberStatus.FROZEN]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [MemberStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [MemberStatus.CANCELLED]: 'bg-red-500/10 text-red-500 border-red-500/20',
    'expired': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles[MemberStatus.PENDING]} uppercase tracking-wider`}>
      {status}
    </span>
  );
};



export const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedMember, setSelectedMember] = useState(undefined);

  // DELETE MODAL
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get unique creators from members
  const AVAILABLE_CREATORS = useMemo(
    () => [...new Set(members.map(m => m.createdByName).filter(Boolean))],
    [members]
  );

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("api/members/all");

      // Format member data
      const formatted = res.data.map(m => ({
        ...m,
        fullName: `${m.firstName || ""} ${m.lastName || ""}`.trim(),
        joinDate: m.startDate?.split("T")[0] || "",
        endDate: m.endDate?.split("T")[0] || "",
        createdByName: m.createdBy?.name || m.createdBy?.email || "Unknown"
    }));

      setMembers(formatted);
    } catch (error) {
      console.error("Error loading members:", error);
      alert("Failed to load members. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete?._id) return;

    try {
      setIsDeleting(true);
      await api.delete(`api/members/delete/${memberToDelete._id}`);
      setMembers(prev => prev.filter(m => m._id !== memberToDelete._id));
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete member. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setSelectedMember(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleExport = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Start Date", "End Date", "Status", "Created By"];

    const csvRows = [
      headers.join(','),
      ...filteredMembers.map(member => {
        return [
          member._id,
          `"${member.firstName || ""}"`,
          `"${member.lastName || ""}"`,
          `"${member.email || ""}"`,
          `"${member.phone || ""}"`,
          member.joinDate,
          member.endDate || '',
          member.status,
          `"${member.createdByName}"`
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.phone && m.phone.includes(searchTerm)) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesDate = dateFilter === '' || m.joinDate === dateFilter;
    const matchesCreator = creatorFilter === '' || m.createdByName === creatorFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesCreator;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setCreatorFilter('');
  };

  // Calculate stats
  const activeCount = members.filter(m => m.status === MemberStatus.ACTIVE).length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const newThisMonth = members.filter(m => {
    const joinDate = new Date(m.startDate);
    return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
  }).length;

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="Members Management" />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Members</p>
            <p className="text-3xl font-bold text-white">{members.length.toLocaleString()}</p>
          </div>

          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Active</p>
            <p className="text-3xl font-bold text-panda-red">
              {activeCount.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">New This Month</p>
            <p className="text-3xl font-bold text-white">+{newThisMonth}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">

              {/* SEARCH */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text"
                    placeholder="Name, Phone, or Email..."
                    className="w-full bg-[#111] border border-panda-border rounded-xl pl-10 pr-4 py-2.5 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* STATUS FILTER */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Status</label>
                <select
                  className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value={MemberStatus.ACTIVE}>Active</option>
                  <option value={MemberStatus.FROZEN}>Frozen</option>
                  <option value={MemberStatus.PENDING}>Pending</option>
                  <option value={MemberStatus.CANCELLED}>Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* CREATOR FILTER */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Created By</label>
                <select
                  className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white"
                  value={creatorFilter}
                  onChange={(e) => setCreatorFilter(e.target.value)}
                >
                  <option value="">All Creators</option>
                  {AVAILABLE_CREATORS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* DATE FILTER */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Joined On</label>
                <input
                  type="date"
                  className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full xl:w-auto">

              {(searchTerm || statusFilter !== 'all' || dateFilter || creatorFilter) && (
                <button onClick={clearFilters} className="bg-[#111] border border-panda-border text-gray-300 px-4 py-2.5 rounded-xl hover:bg-white/5">
                  Clear
                </button>
              )}

              {/* EXPORT */}
              <button onClick={handleExport} className="bg-[#111] border border-panda-border text-gray-300 px-6 py-2.5 rounded-xl hover:bg-white/5 flex items-center gap-2">
                <Icons.Download className="w-5 h-5" /> Export
              </button>

              {/* ADD MEMBER */}
              <button 
                onClick={handleAdd}
                className="bg-panda-red text-white px-6 py-2.5 rounded-xl hover:bg-red-600 flex items-center gap-2"
              >
                <Icons.Plus className="w-5 h-5" /> ADD MEMBER
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#111] border border-panda-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-panda-border bg-white/5">
                  <th className="p-4 w-24 text-center text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Name</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Email</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Phone</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Start Date</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">End Date</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Created By</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-panda-border">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-panda-red/30 border-t-panda-red rounded-full animate-spin" />
                        Loading members...
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member._id} className="group hover:bg-white/5">
                      
                      {/* ACTIONS */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(member)} 
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Edit member"
                          >
                            <Icons.Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(member)} 
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete member"
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* NAME */}
                      <td className="p-4 text-white font-medium">{member.fullName}</td>

                      {/* EMAIL */}
                      <td className="p-4 text-gray-400">{member.email || '-'}</td>

                      {/* PHONE */}
                      <td className="p-4 text-gray-400">{member.phone || '-'}</td>

                      {/* START DATE */}
                      <td className="p-4 text-gray-400">{member.joinDate}</td>

                      {/* END DATE */}
                      <td className="p-4 text-gray-400">{member.endDate || '-'}</td>

                      {/* STATUS */}
                      <td className="p-4">
                        <StatusPill status={member.status} />
                      </td>

                      {/* CREATED BY */}
                      <td className="p-4 text-gray-400">{member.createdByName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <MemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        memberData={selectedMember}
        refresh={fetchMembers}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        memberName={memberToDelete?.fullName || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};