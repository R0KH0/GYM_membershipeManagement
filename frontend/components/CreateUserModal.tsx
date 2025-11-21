import React, { useState } from 'react';
import { Icons } from './Icons';
import { UserRole } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.EMPLOYEE
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API request to create user
    // fetch('/api/users', { method: 'POST', body: JSON.stringify(formData) })
    console.log('Creating user:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#151515] border border-panda-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-panda-border flex justify-between items-center bg-[#111]">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Icons.CreateUser className="w-5 h-5 text-panda-red" />
            Create System User
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all"
              placeholder="john@ironpanda.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Role</label>
            <select
              className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value={UserRole.EMPLOYEE}>Employee</option>
              <option value={UserRole.TRAINER}>Trainer</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-panda-border text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-panda-red text-white hover:bg-red-600 shadow-[0_0_15px_rgba(230,0,0,0.4)] transition-all text-sm font-medium"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};