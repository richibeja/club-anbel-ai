'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Member } from '@/types';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await Database.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMemberStatus(id: string, status: Member['membership_status']) {
    try {
      await Database.updateMember(id, { membership_status: status });
      await loadMembers();
      alert(`Member status updated to ${status}`);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member status');
    }
  }

  const filteredMembers = members.filter(member => {
    if (filter === 'all') return true;
    return member.membership_status === filter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-2">Manage club members</p>
        </div>
        <button 
          onClick={loadMembers}
          className="btn-primary"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All ({members.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Active ({members.filter(m => m.membership_status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'inactive' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Inactive ({members.filter(m => m.membership_status === 'inactive').length})
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Telegram</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Total Paid</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium">{member.first_name} {member.last_name}</div>
                  {member.email && <div className="text-sm text-gray-500">{member.email}</div>}
                </td>
                <td className="py-3 px-4">
                  {member.telegram_username ? (
                    <a
                      href={`https://t.me/${member.telegram_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @{member.telegram_username}
                    </a>
                  ) : (
                    <span className="text-gray-500">No username</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`badge-${member.membership_status}`}>
                    {member.membership_status}
                  </span>
                </td>
                <td className="py-3 px-4">{member.membership_type}</td>
                <td className="py-3 px-4">${member.total_paid}</td>
                <td className="py-3 px-4">
                  {new Date(member.joined_date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {member.membership_status !== 'active' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'active')}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Activate
                      </button>
                    )}
                    {member.membership_status === 'active' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'inactive')}
                        className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Deactivate
                      </button>
                    )}
                    {member.membership_status !== 'expelled' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to expel this member?')) {
                            updateMemberStatus(member.id, 'expelled');
                          }
                        }}
                        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Expel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No members found
          </div>
        )}
      </div>
    </div>
  );
}

