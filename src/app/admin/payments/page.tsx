'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Payment, Member } from '@/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const data = await Database.getPendingPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment(paymentId: string, memberId: string, amount: number) {
    if (!confirm('Verify this payment?')) return;

    try {
      await Database.verifyPayment(paymentId, 'admin');
      
      const member = await Database.getMemberByTelegramId(memberId);
      if (member) {
        const newTotal = member.total_paid + amount;
        const nextDue = new Date();
        nextDue.setDate(nextDue.getDate() + 7);
        
        await Database.updateMember(member.id, {
          membership_status: 'active',
          total_paid: newTotal,
          last_payment_date: new Date().toISOString(),
          next_payment_due: nextDue.toISOString(),
        });
      }

      alert('Payment verified successfully!');
      await loadPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment');
    }
  }

  async function rejectPayment(paymentId: string) {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await Database.rejectPayment(paymentId, reason);
      alert('Payment rejected');
      await loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Error rejecting payment');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Verify pending payments</p>
        </div>
        <button onClick={loadPayments} className="btn-primary">
          🔄 Refresh
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="card hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{payment.member_name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Amount:</strong> ${payment.amount} {payment.currency}</p>
                  <p><strong>Method:</strong> {payment.payment_method}</p>
                  <p><strong>Date:</strong> {new Date(payment.payment_date).toLocaleString()}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                {payment.payment_proof_url && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof:</p>
                    <a
                      href={payment.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={payment.payment_proof_url}
                        alt="Payment proof"
                        className="w-full max-w-xs rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors"
                      />
                    </a>
                  </div>
                )}
                {payment.notes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                    <p className="text-sm text-gray-600">{payment.notes}</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 flex flex-col justify-center gap-3">
                <button
                  onClick={() => verifyPayment(payment.id, payment.member_id, payment.amount)}
                  className="btn-primary"
                >
                  ✓ Verify & Activate
                </button>
                <button
                  onClick={() => rejectPayment(payment.id)}
                  className="btn-danger"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-500 text-lg">No pending payments</p>
            <p className="text-gray-400 text-sm mt-2">All payments have been processed</p>
          </div>
        )}
      </div>
    </div>
  );
}

