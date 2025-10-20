'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Member } from '@/types';
import { calculateReferralBenefits } from '@/lib/referrals';

export default function ReferralsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [topReferrers, setTopReferrers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const allMembers = await Database.getAllMembers();
      setMembers(allMembers);

      // Top referidores
      const sorted = [...allMembers]
        .filter(m => (m.referrals_count || 0) > 0)
        .sort((a, b) => (b.referrals_count || 0) - (a.referrals_count || 0))
        .slice(0, 10);
      
      setTopReferrers(sorted);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalReferrals = members.reduce((sum, m) => sum + (m.referrals_count || 0), 0);
  const membersWithReferrals = members.filter(m => (m.referrals_count || 0) > 0).length;

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
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          🎁 Sistema de Referidos
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona y visualiza el programa de referidos del club
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">Total Referidos</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{totalReferrals}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Miembros Referidores</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{membersWithReferrals}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Promedio por Referidor</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {membersWithReferrals > 0 ? (totalReferrals / membersWithReferrals).toFixed(1) : '0'}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Referral Tiers Info */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎁 Niveles de Beneficios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-300">
            <div className="text-3xl mb-2">✨</div>
            <div className="font-bold text-blue-900">1 Referido</div>
            <div className="text-2xl font-bold text-green-600 mt-2">1 semana</div>
            <div className="text-xs text-blue-700">Gratis ($10)</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-300">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-bold text-purple-900">3 Referidos</div>
            <div className="text-2xl font-bold text-green-600 mt-2">1 mes</div>
            <div className="text-xs text-purple-700">Gratis ($40)</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border-2 border-pink-300">
            <div className="text-3xl mb-2">🌟</div>
            <div className="font-bold text-pink-900">5 Referidos</div>
            <div className="text-2xl font-bold text-green-600 mt-2">2 meses</div>
            <div className="text-xs text-pink-700">Gratis ($80)</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
            <div className="text-3xl mb-2">👑</div>
            <div className="font-bold text-yellow-900">10+ Referidos</div>
            <div className="text-2xl font-bold text-green-600 mt-2">3 meses</div>
            <div className="text-xs text-yellow-700">Gratis ($120) + Badge</div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🏆 Top 10 Referidores
        </h2>
        
        {topReferrers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-600">
              Aún no hay referidos. ¡Sé el primero en referir y ganar beneficios!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 px-4">Ranking</th>
                  <th className="text-left py-3 px-4">Miembro</th>
                  <th className="text-left py-3 px-4">Código</th>
                  <th className="text-center py-3 px-4">Referidos</th>
                  <th className="text-center py-3 px-4">Nivel</th>
                  <th className="text-right py-3 px-4">Beneficios</th>
                </tr>
              </thead>
              <tbody>
                {topReferrers.map((member, index) => {
                  const benefits = calculateReferralBenefits(member.referrals_count || 0);
                  const available = (member.free_weeks_earned || 0) - (member.free_weeks_used || 0);
                  
                  return (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && <span className="font-bold text-gray-500">#{index + 1}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {member.first_name} {member.last_name || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{member.telegram_username || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="bg-purple-100 px-2 py-1 rounded text-sm font-mono">
                          {member.referral_code || 'N/A'}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xl font-bold text-purple-600">
                          {member.referrals_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xl">{benefits.badge}</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {benefits.level}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-green-600">
                          {available} semanas
                        </div>
                        <div className="text-xs text-gray-500">
                          ${available * 10} ahorrados
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Members with Referral Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Todos los Miembros - Códigos de Referido
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Miembro</th>
                <th className="text-left py-2 px-3">Código</th>
                <th className="text-center py-2 px-3">Referidos</th>
                <th className="text-left py-2 px-3">Referido Por</th>
                <th className="text-center py-2 px-3">Beneficios</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const available = (member.free_weeks_earned || 0) - (member.free_weeks_used || 0);
                
                return (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <div className="font-medium">
                        {member.first_name} {member.last_name || ''}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {member.referral_code || '-'}
                      </code>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-semibold text-purple-600">
                        {member.referrals_count || 0}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {member.referred_by_code ? (
                        <code className="bg-green-100 px-2 py-1 rounded text-xs font-mono">
                          {member.referred_by_code}
                        </code>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin código</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {available > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {available} sem.
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

