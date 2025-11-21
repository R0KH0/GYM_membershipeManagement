import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Member, MemberStatus, PaymentType } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  memberData?: Member;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, mode, memberData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    joinDate: '',
    endDate: '',
    createdBy: '',
    status: MemberStatus.ACTIVE,
    paymentAmount: 0,
    paymentType: PaymentType.SUBSCRIPTION
  });

  useEffect(() => {
    if (mode === 'edit' && memberData) {
      setFormData({
        name: memberData.name,
        phone: memberData.phone,
        joinDate: memberData.joinDate,
        endDate: memberData.endDate || '',
        createdBy: memberData.createdBy,
        status: memberData.status,
        paymentAmount: memberData.lastPaymentAmount || 0,
        paymentType: memberData.lastPaymentType || PaymentType.SUBSCRIPTION
      });
    } else {
      // Default join date to today, end date to one month from today
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      setFormData({
        name: '',
        phone: '',
        joinDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
        createdBy: 'Admin',
        status: MemberStatus.ACTIVE,
        paymentAmount: 0,
        paymentType: PaymentType.SUBSCRIPTION
      });
    }
  }, [mode, memberData, isOpen]);

  const downloadReceipt = () => {
    const receiptContent = `
------------------------------------------------
           IRONPANDA GYM - RECEIPT
------------------------------------------------
Date:         ${new Date().toLocaleString()}
Member Name:  ${formData.name}
Phone:        ${formData.phone}
------------------------------------------------
Payment Type: ${formData.paymentType}
Amount Paid:  $${formData.paymentAmount.toFixed(2)}
Status:       PAID
------------------------------------------------
Valid From:   ${formData.joinDate}
Valid Until:  ${formData.endDate}
------------------------------------------------
Thank you for training with us!
IronPanda Gym Management
------------------------------------------------
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      // TODO: submit new member to database including payment info
      console.log('Adding member with payment', formData);
      
      // Trigger receipt download automatically for new members
      if (formData.paymentAmount > 0) {
         downloadReceipt();
      }
    } else {
      // TODO: update member in database including payment info
      console.log('Updating member with payment', formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#151515] border border-panda-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-panda-border flex justify-between items-center bg-[#111]">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            {mode === 'add' ? <Icons.Plus className="w-5 h-5 text-panda-red" /> : <Icons.Edit className="w-5 h-5 text-panda-red" />}
            {mode === 'add' ? 'Add New Member' : 'Edit Member Details'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Join Date</label>
              <input
                type="date"
                required
                className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red transition-all"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
              <input
                type="date"
                className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red transition-all"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Membership Status</label>
              <div className="relative">
                <select
                  className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red appearance-none transition-all"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                >
                  <option value={MemberStatus.ACTIVE}>Active</option>
                  <option value={MemberStatus.FROZEN}>Frozen</option>
                  <option value={MemberStatus.PENDING}>Pending</option>
                  <option value={MemberStatus.CANCELLED}>Cancelled</option>
                </select>
                <Icons.Down className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Created By</label>
              <input
                type="text"
                className="w-full bg-[#222] border border-panda-border rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed"
                value={formData.createdBy}
                readOnly
              />
            </div>
          </div>

          <div className="border-t border-panda-border pt-4 mt-2">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icons.Earnings className="w-4 h-4 text-panda-red" />
              Payment Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-black border border-panda-border rounded-lg pl-7 pr-4 py-2.5 text-white focus:outline-none focus:border-panda-red transition-all"
                    value={formData.paymentAmount}
                    onChange={(e) => setFormData({ ...formData, paymentAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Payment Type</label>
                <div className="relative">
                  <select
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-panda-red appearance-none transition-all"
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
                  >
                    <option value={PaymentType.SUBSCRIPTION}>Subscription</option>
                    <option value={PaymentType.RENEWAL}>Renewal</option>
                    <option value={PaymentType.FEE}>Fee</option>
                    <option value={PaymentType.MERCHANDISE}>Merchandise</option>
                  </select>
                  <Icons.Down className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-panda-border text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-panda-red text-white hover:bg-red-600 shadow-neon transition-all text-sm font-medium"
            >
              {mode === 'add' ? 'Add & Download Receipt' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};