import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { MemberStatus } from '../types';
import { api } from '../src/api/axios';

export const MemberModal = ({ isOpen, onClose, mode, memberData, refresh }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: MemberStatus.ACTIVE,
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'cash',
    periodMonths: 1,
    notes: ''
  });

  const [createPayment, setCreatePayment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ------------------------------------------------
  // PREFILL DATA WHEN EDITING
  // ------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    try {
      if (mode === 'edit' && memberData) {
        console.log('Edit mode - memberData:', memberData);
        
        setFormData({
          firstName: memberData.firstName || '',
          lastName: memberData.lastName || '',
          email: memberData.email || '',
          phone: memberData.phone || '',
          status: memberData.status || MemberStatus.ACTIVE,
          startDate: memberData.startDate ? memberData.startDate.split('T')[0] : '',
          endDate: memberData.endDate ? memberData.endDate.split('T')[0] : '',
          notes: memberData.notes || ''
        });
        setCreatePayment(false);
        setError('');

      } else if (mode === 'add') {
        console.log('Add mode - resetting form');
        
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          status: MemberStatus.ACTIVE,
          startDate: today.toISOString().split('T')[0],
          endDate: nextMonth.toISOString().split('T')[0],
          notes: ''
        });

        setPaymentData({
          amount: 0,
          method: 'cash',
          periodMonths: 1,
          notes: ''
        });

        setCreatePayment(true);
        setError('');
      }
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError('Failed to initialize form');
    }
  }, [mode, memberData, isOpen]);

  if (!isOpen) return null;

  // ------------------------------------------------
  // DOWNLOAD RECEIPT
  // ------------------------------------------------
  const downloadReceipt = (memberName, payment) => {
    try {
      console.log('Downloading receipt for:', memberName);
      
      const receiptContent = `
================================================
           ROKHO's GYM - RECEIPT
================================================
Date:         ${new Date().toLocaleString()}
Member Name:  ${memberName}
Phone:        ${formData.phone || 'N/A'}
================================================
Payment Method: ${payment.method.toUpperCase()}
Amount Paid:    ${Number(payment.amount).toFixed(2)} DH
Period:         ${payment.periodMonths} Month(s)
Status:         PAID
================================================
Valid From:     ${formData.startDate}
Valid Until:    ${formData.endDate}
================================================
${payment.notes ? `Notes: ${payment.notes}\n================================================\n` : ''}
Thank you for training with us!
ROKHO's Gym
================================================
      `;

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_${memberName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Receipt downloaded successfully');
    } catch (error) {
      console.error('Receipt download error:', error);
    }
  };

  // ------------------------------------------------
  // SUBMIT (ADD OR EDIT)
  // ------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted - mode:', mode);
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring...');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const memberName = `${formData.firstName} ${formData.lastName}`.trim();
      console.log('Member name:', memberName);

      if (mode === 'add') {
        console.log('Creating new member with data:', formData);
        
        // Create new member
        const memberResponse = await api.post('api/members/create', formData);
        console.log('Member created:', memberResponse.data);
        
        const memberId = memberResponse.data.member._id;
        
        if (!memberId) {
          throw new Error('Member created but no ID returned from server');
        }

        // Create payment if checkbox is checked and amount > 0
        if (createPayment && paymentData.amount > 0) {
          console.log('Creating payment for member:', memberId);
          
          const paymentPayload = {
            member: memberId,
            amount: Number(paymentData.amount),
            method: paymentData.method,
            status: 'paid',
            periodMonths: Number(paymentData.periodMonths),
            notes: paymentData.notes
          };
          
          console.log('Payment payload:', paymentPayload);
          
          const paymentResponse = await api.post('api/payments/create', paymentPayload);
          console.log('Payment created:', paymentResponse.data);
        }
        
        if (formData.status === MemberStatus.ACTIVE && createPayment && paymentData.amount > 0) {
          downloadReceipt(memberName, paymentData);
        }

      } else if (mode === 'edit') {
        console.log('Updating member:', memberData?._id);
        
        // Validate member ID exists
        if (!memberData?._id) {
          throw new Error('Cannot update: Member ID is missing');
        }
        
        console.log('Update data:', formData);
        const updateResponse = await api.put(`api/members/update/${memberData._id}`, formData);
        console.log('Member updated:', updateResponse.data);
      }

      console.log('Operation successful, refreshing list...');
      
      // Refresh the members list
      if (typeof refresh === 'function') {
        await refresh();
      }
      
      // Close modal
      onClose();

    } catch (error) {
      console.error('Member save error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save member.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-calculate end date based on period
  const handlePeriodChange = (months) => {
    try {
      const monthsNum = parseInt(months) || 1;
      console.log('Period changed to:', monthsNum);
      
      setPaymentData({ ...paymentData, periodMonths: monthsNum });

      if (formData.startDate) {
        const start = new Date(formData.startDate);
        
        if (isNaN(start.getTime())) {
          console.error('Invalid start date:', formData.startDate);
          return;
        }
        
        const end = new Date(start);
        end.setMonth(end.getMonth() + monthsNum);
        
        const endDateStr = end.toISOString().split('T')[0];
        console.log('Calculated end date:', endDateStr);
        
        setFormData({ ...formData, endDate: endDateStr });
      }
    } catch (error) {
      console.error('Date calculation error:', error);
    }
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#151515] border border-panda-border rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-panda-border flex justify-between items-center bg-[#111]">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            {mode === 'add'
              ? <Icons.Plus className="w-5 h-5 text-panda-red" />
              : <Icons.Edit className="w-5 h-5 text-panda-red" />}
            {mode === 'add' ? 'Add New Member' : 'Edit Member Details'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* MEMBER INFORMATION */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Icons.Members className="w-4 h-4 text-panda-red" />
              Member Information
            </h4>

            <div className="space-y-4">
              {/* First Name + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Start Date + End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Membership Status</label>
                  <select
                    className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value={MemberStatus.ACTIVE}>Active</option>
                    {mode === 'edit' && <option value={MemberStatus.FROZEN}>Frozen</option>}
                    <option value={MemberStatus.PENDING}>Pending</option>
                    {mode === 'edit' && <option value={MemberStatus.CANCELLED}>Cancelled</option>}
                    {mode === 'edit' && <option value="expired">Expired</option>}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Notes</label>
                <textarea
                  className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors min-h-[80px]"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes about the member..."
                />
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION - Only show when adding new member */}
          {mode === 'add' && (
            <div className="border-t border-panda-border pt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Icons.Earnings className="w-4 h-4 text-panda-red" />
                  Payment Details
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createPayment}
                    onChange={(e) => setCreatePayment(e.target.checked)}
                    className="w-4 h-4 rounded border-panda-border bg-black text-panda-red focus:ring-panda-red focus:ring-offset-0"
                  />
                  <span className="text-xs text-gray-400">Create payment record</span>
                </label>
              </div>

              {createPayment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Amount (DH)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="w-full bg-black border border-panda-border rounded-lg pl-7 pr-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Payment Method</label>
                      <select
                        className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                        value={paymentData.method}
                        onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>

                  {/* Period Months */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Subscription Period (Months)</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors"
                        value={paymentData.periodMonths}
                        onChange={(e) => handlePeriodChange(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">End date will be calculated automatically</p>
                    </div>
                  </div>

                  {/* Payment Notes */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Payment Notes</label>
                    <textarea
                      className="w-full bg-black border border-panda-border rounded-lg px-4 py-2.5 text-white focus:border-panda-red focus:outline-none transition-colors min-h-[60px]"
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      placeholder="Add payment notes..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg border border-panda-border text-gray-300 hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-panda-red text-white hover:bg-red-600 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : mode === 'add' ? (
                createPayment && paymentData.amount > 0 ? 'Add Member & Create Payment' : 'Add Member'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};



// ------------------------------------------------
// DELETE CONFIRM MODAL
// ------------------------------------------------

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  isDeleting = false,
  type = 'Member'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#151515] border border-panda-border rounded-2xl shadow-2xl">
        <div className="p-6 text-center">

          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/20">
            <Icons.Trash className="w-8 h-8 text-panda-red" />
          </div>

          <h3 className="text-white font-bold text-xl mb-2">Delete {type}?</h3>

          <p className="text-gray-400 mb-8 text-sm">
            Are you sure you want to remove
            <span className="text-white font-semibold"> {memberName}</span>?
            <br />This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              type="button"
              className="flex-1 px-4 py-3 rounded-xl border border-panda-border text-gray-300 hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              type="button"
              className="flex-1 px-4 py-3 rounded-xl bg-panda-red text-white hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${type}`
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};