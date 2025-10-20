'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Member, Ticket, Payment } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    totalTickets: 0,
    pendingPayments: 0,
    availablePredictions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [members, tickets, payments, predictions] = await Promise.all([
        Database.getAllMembers(),
        Database.getAllTickets(),
        Database.getPendingPayments(),
        Database.getAvailablePredictions(),
      ]);

      const activeMembers = members.filter(m => m.membership_status === 'active');
      const inactiveMembers = members.filter(m => m.membership_status === 'inactive');

      setStats({
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        inactiveMembers: inactiveMembers.length,
        totalTickets: tickets.length,
        pendingPayments: payments.length,
        availablePredictions: predictions.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Club overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Total Members</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalMembers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Active Members</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.activeMembers}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">Inactive Members</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.inactiveMembers}</p>
            </div>
            <div className="text-4xl">⏸️</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">Total Tickets</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalTickets}</p>
            </div>
            <div className="text-4xl">📸</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-medium">Pending Payments</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{stats.pendingPayments}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-coffee-50 to-coffee-100 border-l-4 border-coffee-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-coffee-800 font-medium">Available Predictions</p>
              <p className="text-3xl font-bold text-coffee-900 mt-2">{stats.availablePredictions}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/predictions" className="block btn-primary text-center">
              📊 Import Predictions
            </a>
            <a href="/admin/payments" className="block btn-secondary text-center">
              💰 Verify Payments
            </a>
            <a href="/admin/members" className="block btn-secondary text-center">
              👥 Manage Members
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Telegram Bot</span>
              <span className="badge-active">✅ Active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Database</span>
              <span className="badge-active">✅ Connected</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Storage</span>
              <span className="badge-active">✅ Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

