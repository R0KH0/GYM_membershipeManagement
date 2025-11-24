import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { UserRole } from '../types';
import { UserModal } from '../components/UserModal';
import { DeleteConfirmationModal } from '../components/MemberModals';
import { api } from "../src/api/axios";

const RolePill = ({ role }) => {
  const styles = {
    [UserRole.SUPER_ADMIN]: 'bg-panda-red/10 text-panda-red border-panda-red/20',
    [UserRole.ADMIN]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [UserRole.EMPLOYEE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[role]} uppercase tracking-wider flex items-center gap-1 w-fit`}>
       {role === UserRole.SUPER_ADMIN && <Icons.Lock className="w-3 h-3" />}
       {role}
    </span>
  );
};

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(undefined);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --------------------------------------
  // Fetch users from backend
  // --------------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("api/users/all", { withCredentials: true });

        const formatted = res.data.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role
        }));
        setUsers(formatted);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --------------------------------------
  // Edit User
  // --------------------------------------
  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // --------------------------------------
  // Delete User
  // --------------------------------------
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
  if (!userToDelete) return;

  try {
    setIsDeleting(true);

    // DELETE request to backend
    await api.delete(`api/users/delete/${userToDelete.id}`);

    // Remove from UI
    setUsers(prev => prev.filter(u => u._id !== userToDelete.id));

    // Close modal
    setIsDeleteModalOpen(false);
    setUserToDelete(null);

  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    setIsDeleting(false);
  }
};

  // --------------------------------------
  // Add new user
  // --------------------------------------
  const handleAdd = () => {
    setSelectedUser(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // --------------------------------------
  // Save User (Add or Edit)
  // --------------------------------------
  const handleSaveUser = async (savedUser) => {
    try {
      if (modalMode === "add") {
        const res = await api.post("api/users/create", savedUser);
        const newUser = {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        };
        setUsers(prev => [...prev, newUser]);
      } else {
        const res = await api.put(`api/users/update/${selectedUser.id}`, savedUser);

        const updated = users.map(u =>
          u.id === selectedUser.id
            ? { ...u, ...res.data }
            : u
        );

        setUsers(updated);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // --------------------------------------
  // Filtering users
  // --------------------------------------
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
  };

  // --------------------------------------
  // UI
  // --------------------------------------
  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="System Users" />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.filter(u =>[UserRole.ADMIN, UserRole.EMPLOYEE].includes(u.role)).length}</p>
          </div>
          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Admins</p>
            <p className="text-3xl font-bold text-panda-red">{users.filter(u => u.role === UserRole.ADMIN).length}</p>
          </div>
          <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Employee</p>
            <p className="text-3xl font-bold text-blue-500">{users.filter(u => u.role === UserRole.EMPLOYEE).length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full">
              
              {/* Search */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Name or Email..." 
                    className="w-full bg-[#111] border border-panda-border rounded-xl pl-10 pr-4 py-2.5 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Role */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Role</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
              {(searchTerm || roleFilter !== 'all') && (
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
                <Icons.CreateUser className="w-5 h-5" />
                <span>CREATE USER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#111] border border-panda-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-panda-border bg-white/5">
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-24 text-center">Actions</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panda-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="text-gray-500 hover:text-white p-2 rounded-full"
                        >
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-sm">{user.email}</td>
                    <td className="p-4">
                      <RolePill role={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Icons.Search className="w-8 h-8 mb-3 opacity-20" />
              <p>No users found matching your filters.</p>
              <button onClick={clearFilters} className="text-panda-red text-sm mt-2 hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        userData={selectedUser}
        onSave={handleSaveUser}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        memberName={userToDelete?.name || ''}
        isDeleting={isDeleting}
        type="User"
      />
    </div>
  );
};