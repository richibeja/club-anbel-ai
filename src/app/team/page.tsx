'use client';

import { useEffect, useState } from 'react';
import Database from '@/lib/database';
import { Member } from '@/types';

export default function TeamPage() {
  const [directive, setDirective] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirective();
  }, []);

  async function loadDirective() {
    try {
      const members = await Database.getAllMembers();
      const directiveMembers = members.filter(m => m.club_role && m.club_role !== 'member');
      
      // Ordenar por jerarquía
      const roleOrder: any = {
        president: 1,
        vice_president: 2,
        treasurer: 3,
        secretary: 4,
        predictions_coordinator: 5,
        vocal_1: 6,
        vocal_2: 7,
      };
      
      directiveMembers.sort((a, b) => {
        const orderA = roleOrder[a.club_role || ''] || 999;
        const orderB = roleOrder[b.club_role || ''] || 999;
        return orderA - orderB;
      });
      
      setDirective(directiveMembers);
    } catch (error) {
      console.error('Error loading directive:', error);
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
    };
    return titles[role || ''] || 'Miembro';
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
    };
    return icons[role || ''] || '👤';
  };

  const getRoleDescription = (role?: string) => {
    const descriptions: any = {
      president: 'Representa oficialmente al club y supervisa todas las operaciones',
      vice_president: 'Apoya al presidente y coordina votaciones del club',
      treasurer: 'Gestiona finanzas, verifica pagos y distribuye premios',
      secretary: 'Mantiene registros de miembros y comunicaciones oficiales',
      predictions_coordinator: 'Genera predicciones semanales y verifica resultados',
      vocal_1: 'Representa la voz de los miembros en decisiones importantes',
      vocal_2: 'Participa en votaciones y propone mejoras al sistema',
    };
    return descriptions[role || ''] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏛️ Nuestro Equipo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce a la directiva del Club Anbel AI. Somos un equipo comprometido con la 
            transparencia, la confianza y el éxito de todos nuestros miembros.
          </p>
        </div>

        {/* Directive Cards */}
        {directive.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Directiva en Proceso de Elección
            </h3>
            <p className="text-gray-600">
              Próximamente anunciaremos la directiva oficial del club
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directive.map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Card Header with Role Color */}
                <div className={`h-3 ${
                  member.club_role === 'president' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  member.club_role === 'vice_president' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  member.club_role === 'treasurer' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  member.club_role === 'secretary' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                  member.club_role === 'predictions_coordinator' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                  'bg-gradient-to-r from-gray-400 to-gray-600'
                }`}></div>
                
                {/* Photo */}
                <div className="p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl border-4 border-white shadow-lg">
                    {member.profile_photo_url ? (
                      <img 
                        src={member.profile_photo_url} 
                        alt={`${member.first_name} ${member.last_name || ''}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{getRoleIcon(member.club_role)}</span>
                    )}
                  </div>
                  
                  {/* Name & Role */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.first_name} {member.last_name || ''}
                  </h3>
                  <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold mb-4">
                    {getRoleTitle(member.club_role)}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {getRoleDescription(member.club_role)}
                  </p>
                  
                  {/* Bio */}
                  {member.bio && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-sm italic">
                        "{member.bio}"
                      </p>
                    </div>
                  )}
                  
                  {/* Member Since */}
                  <div className="text-xs text-gray-500 mt-4">
                    Miembro desde {new Date(member.joined_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transparency Section */}
        <div className="mt-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              💎 Transparencia y Confianza
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro club se basa en la transparencia total y la confianza mutua. 
              Todos los miembros tienen acceso a reportes mensuales y pueden participar 
              en decisiones importantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Reportes Mensuales</h3>
              <p className="text-sm text-gray-600">
                Publicamos informes financieros y de actividades cada mes
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-3">🗳️</div>
              <h3 className="font-bold text-gray-900 mb-2">Votaciones Abiertas</h3>
              <p className="text-sm text-gray-600">
                Los miembros activos votan en decisiones importantes del club
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2">Verificación Pública</h3>
              <p className="text-sm text-gray-600">
                Todos los procesos son auditables y verificables
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Quieres ser parte de nuestro club?
          </h3>
          <p className="text-gray-600 mb-6">
            Únete a una comunidad transparente, profesional y comprometida con tu éxito
          </p>
          <a 
            href="/admin/dashboard" 
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 Únete Ahora
          </a>
        </div>
      </div>
    </div>
  );
}

