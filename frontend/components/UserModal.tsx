import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { User, UserRole } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  userData?: User;
  onSave?: (user: Partial<User> & { password?: string }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, mode, userData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.EMPLOYEE
  });

  useEffect(() => {
    if (mode === 'edit' && userData) {
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '', // Don't populate password on edit for security
        role: userData.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: UserRole.EMPLOYEE
      });
    }
  }, [mode, userData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...userData,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });
    }
    console.log(`${mode === 'add' ? 'Creating' : 'Updating'} user:`, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#151515] border border-panda-border rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-panda-border flex justify-between items-center bg-[#111]">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            {mode === 'add' ? <Icons.CreateUser className="w-5 h-5 text-panda-red" /> : <Icons.Edit className="w-5 h-5 text-panda-red" />}
            {mode === 'add' ? 'Create System User' : 'Edit User Details'}
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
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
              {mode === 'edit' ? 'New Password (Optional)' : 'Password'}
            </label>
            <input
              type="password"
              required={mode === 'add'}
              className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Role</label>
            <div className="relative">
              <select
                className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red focus:ring-1 focus:ring-panda-red transition-all appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.TRAINER}>Trainer</option>
                <option value={UserRole.EMPLOYEE}>Employee</option>
              </select>
              <Icons.Down className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
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
              {mode === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};