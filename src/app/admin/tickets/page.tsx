'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Ticket } from '@/types';
import Image from 'next/image';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const data = await Database.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-2">View uploaded lottery tickets</p>
        </div>
        <button onClick={loadTickets} className="btn-primary">
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={ticket.photo_url}
                alt="Lottery ticket"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{ticket.member_name}</h3>
                <span className={`badge-${ticket.verified ? 'active' : 'inactive'}`}>
                  {ticket.verified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                <strong>{ticket.lottery_type}</strong>
              </p>
              
              <p className="text-sm font-mono text-gray-800">
                {ticket.prediction_numbers.join(', ')}
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>📅 Draw: {ticket.draw_date}</p>
                <p>📸 Uploaded: {new Date(ticket.upload_date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No tickets uploaded yet</p>
        </div>
      )}

      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedTicket.photo_url}
                      alt="Lottery ticket"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={selectedTicket.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full mt-4"
                  >
                    🔍 Open Full Size
                  </a>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Member</label>
                    <p className="text-lg font-semibold">{selectedTicket.member_name}</p>
                  </div>

                  <div>
                    <label className="label">Lottery Type</label>
                    <p className="text-lg">{selectedTicket.lottery_type}</p>
                  </div>

                  <div>
                    <label className="label">Prediction Numbers</label>
                    <p className="text-xl font-mono font-bold text-green-600">
                      {selectedTicket.prediction_numbers.join(', ')}
                    </p>
                  </div>

                  <div>
                    <label className="label">Draw Date</label>
                    <p className="text-lg">{selectedTicket.draw_date}</p>
                  </div>

                  <div>
                    <label className="label">Upload Date</label>
                    <p className="text-lg">{new Date(selectedTicket.upload_date).toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="label">Status</label>
                    <div className="flex gap-2">
                      <span className={`badge-${selectedTicket.verified ? 'active' : 'inactive'}`}>
                        {selectedTicket.verified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                      {selectedTicket.result && (
                        <span className={`badge-${selectedTicket.result === 'no_win' ? 'inactive' : 'active'}`}>
                          {selectedTicket.result}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedTicket.prize_amount && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <p className="text-sm text-green-800 font-medium">Prize Won</p>
                      <p className="text-2xl font-bold text-green-900">
                        ${selectedTicket.prize_amount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

