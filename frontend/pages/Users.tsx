import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Icons } from '../components/Icons';
import { User, UserRole } from '../types';
import { UserModal } from '../components/UserModal';
import { DeleteConfirmationModal } from '../components/MemberModals';

// Mock Data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Marwane Rohko', email: 'marwane@ironpanda.com', role: UserRole.ADMIN },
  { id: '2', name: 'Mike Tyson', email: 'mike@ironpanda.com', role: UserRole.TRAINER },
  { id: '3', name: 'Sarah Connor', email: 'sarah@ironpanda.com', role: UserRole.EMPLOYEE },
  { id: '4', name: 'John Doe', email: 'john@ironpanda.com', role: UserRole.TRAINER },
  { id: '5', name: 'Jane Smith', email: 'jane@ironpanda.com', role: UserRole.EMPLOYEE },
];

const RolePill = ({ role }: { role: UserRole }) => {
  const styles = {
    [UserRole.ADMIN]: 'bg-panda-red/10 text-panda-red border-panda-red/20',
    [UserRole.TRAINER]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [UserRole.EMPLOYEE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[role]} uppercase tracking-wider flex items-center gap-1 w-fit`}>
       {role === UserRole.ADMIN && <Icons.Lock className="w-3 h-3" />}
       {role}
    </span>
  );
};

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      // Simulate API delay for "action appending" effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSaveUser = (savedUser: Partial<User>) => {
    if (modalMode === 'add') {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: savedUser.name || '',
        email: savedUser.email || '',
        role: savedUser.role || UserRole.EMPLOYEE,
      };
      setUsers([...users, newUser]);
    } else if (modalMode === 'edit' && selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...savedUser } as User : u));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
  };

  return (
    <div className="flex-1 bg-black min-h-screen flex flex-col">
      <TopBar title="System Users" />
      
      <main className="p-4 md:p-8 space-y-6 md:space-y-8">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Users</p>
             <p className="text-3xl font-bold text-white">{users.length}</p>
           </div>
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Admins</p>
             <p className="text-3xl font-bold text-panda-red">{users.filter(u => u.role === UserRole.ADMIN).length}</p>
           </div>
           <div className="bg-[#111] border border-panda-border p-6 rounded-2xl">
             <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Trainers</p>
             <p className="text-3xl font-bold text-blue-500">{users.filter(u => u.role === UserRole.TRAINER).length}</p>
           </div>
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full">
              
              {/* Search Name/Email */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Name or Email..." 
                    className="w-full bg-[#111] border border-panda-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all placeholder-gray-600"
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
                    className="w-full bg-[#111] border border-panda-border rounded-xl px-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all appearance-none"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.TRAINER}>Trainer</option>
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                  </select>
                  <Icons.Down className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
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

        {/* Table */}
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
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="text-gray-500 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-all"
                          title="Edit User"
                        >
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-all"
                          title="Delete User"
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
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <Icons.Search className="w-8 h-8 mb-3 opacity-20" />
              <p>No users found matching your filters.</p>
              <button onClick={clearFilters} className="text-panda-red text-sm mt-2 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </main>

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