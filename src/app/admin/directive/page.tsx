'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Member } from '@/types';

export default function DirectivePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const allMembers = await Database.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  }

  const getRoleTitle = (role?: string) => {
    const titles: any = {
      president: 'Presidente',
      vice_president: 'Vicepresidente',
      treasurer: 'Tesorero',
      secretary: 'Secretario',
      predictions_coordinator: 'Coordinador de Predicciones',
      vocal_1: 'Vocal 1',
      vocal_2: 'Vocal 2',
      member: 'Miembro Regular',
    };
    return titles[role || 'member'] || 'Miembro Regular';
  };

  const getRoleIcon = (role?: string) => {
    const icons: any = {
      president: '👑',
      vice_president: '🤝',
      treasurer: '💰',
      secretary: '📋',
      predictions_coordinator: '🎯',
      vocal_1: '🗣️',
      vocal_2: '🗣️',
      member: '👤',
    };
    return icons[role || 'member'] || '👤';
  };

  async function assignRole(memberId: string, role: string) {
    try {
      await Database.updateMember(memberId, {
        club_role: role as any,
        role_start_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      await loadMembers();
      setShowModal(false);
      setSelectedMember(null);
      alert('Rol asignado exitosamente');
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Error al asignar rol');
    }
  }

  const directiveMembers = members.filter(m => m.club_role && m.club_role !== 'member');
  const regularMembers = members.filter(m => !m.club_role || m.club_role === 'member');

  const availableRoles = [
    { value: 'president', label: 'Presidente 👑', occupied: directiveMembers.some(m => m.club_role === 'president') },
    { value: 'vice_president', label: 'Vicepresidente 🤝', occupied: directiveMembers.some(m => m.club_role === 'vice_president') },
    { value: 'treasurer', label: 'Tesorero 💰', occupied: directiveMembers.some(m => m.club_role === 'treasurer') },
    { value: 'secretary', label: 'Secretario 📋', occupied: directiveMembers.some(m => m.club_role === 'secretary') },
    { value: 'predictions_coordinator', label: 'Coordinador de Predicciones 🎯', occupied: directiveMembers.some(m => m.club_role === 'predictions_coordinator') },
    { value: 'vocal_1', label: 'Vocal 1 🗣️', occupied: directiveMembers.some(m => m.club_role === 'vocal_1') },
    { value: 'vocal_2', label: 'Vocal 2 🗣️', occupied: directiveMembers.some(m => m.club_role === 'vocal_2') },
  ];

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
          🏛️ Gestión de Directiva
        </h1>
        <p className="text-gray-600 mt-2">
          Asigna roles organizacionales a los miembros del club
        </p>
      </div>

      {/* Current Directive */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Directiva Actual
        </h2>
        
        {directiveMembers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🏛️</div>
            <p className="text-gray-600">
              No hay directiva asignada aún. Comienza asignando roles a los miembros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {directiveMembers.map((member) => (
              <div key={member.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-l-4 border-green-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{getRoleIcon(member.club_role)}</div>
                  <button
                    onClick={() => {
                      if (confirm('¿Remover este rol?')) {
                        assignRole(member.id, 'member');
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="font-bold text-gray-900">
                  {member.first_name} {member.last_name || ''}
                </h3>
                <p className="text-sm text-green-700 font-semibold">
                  {getRoleTitle(member.club_role)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Desde {member.role_start_date ? new Date(member.role_start_date).toLocaleDateString('es-ES') : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Roles */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Roles Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableRoles.map((role) => (
            <div 
              key={role.value}
              className={`p-4 rounded-lg border-2 ${
                role.occupied 
                  ? 'bg-gray-50 border-gray-300 opacity-60' 
                  : 'bg-white border-green-300 hover:border-green-500 cursor-pointer'
              }`}
            >
              <div className="text-2xl mb-2">{role.label}</div>
              <div className="text-sm">
                {role.occupied ? (
                  <span className="text-gray-500">✅ Ocupado</span>
                ) : (
                  <span className="text-green-600 font-semibold">Disponible</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regular Members */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Miembros Regulares ({regularMembers.length})
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Miembro</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Miembro desde</th>
                <th className="text-right py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {regularMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {member.first_name} {member.last_name || ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{member.telegram_username || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge-${member.membership_status}`}>
                      {member.membership_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(member.joined_date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowModal(true);
                      }}
                      className="btn-primary text-sm"
                    >
                      Asignar Rol
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Role Assignment */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Asignar Rol a {selectedMember.first_name}
            </h3>
            
            <div className="space-y-2 mb-6">
              {availableRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => assignRole(selectedMember.id, role.value)}
                  disabled={role.occupied}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    role.occupied
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-green-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="font-semibold">{role.label}</div>
                  {role.occupied && (
                    <div className="text-xs text-gray-500 mt-1">Ya ocupado</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMember(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

