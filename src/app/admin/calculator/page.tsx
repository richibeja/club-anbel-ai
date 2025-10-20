'use client';

import { useState, useEffect } from 'react';
import Database from '@/lib/database';
import { Member } from '@/types';

export default function CalculatorPage() {
  const [prizeAmount, setPrizeAmount] = useState('');
  const [taxRate, setTaxRate] = useState('24');
  const [members, setMembers] = useState<Member[]>([]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    loadActiveMembers();
  }, []);

  async function loadActiveMembers() {
    try {
      const activeMembers = await Database.getActiveMembers();
      setMembers(activeMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  function calculate() {
    const prize = parseFloat(prizeAmount);
    const tax = parseFloat(taxRate);
    const memberCount = members.length;

    if (!prize || !tax || memberCount === 0) {
      alert('⚠️ Completa todos los campos y asegúrate de tener socios activos');
      return;
    }

    const taxAmount = prize * (tax / 100);
    const netPrize = prize - taxAmount;

    let distributionLevel = '';
    let winnerAmount = 0;
    let perMember = 0;
    let groupTotal = 0;
    let clubFund = 0;
    let winnerBonus = 0;

    // NIVEL 1: $1 - $999 → Ganador se lo queda todo
    if (netPrize < 1000) {
      distributionLevel = 'NIVEL 1: Premio Pequeño';
      winnerAmount = netPrize;
      perMember = 0;
      groupTotal = 0;
      alert('💡 Premio menor a $1,000: El ganador se lo queda completo (no se reparte)');
    }
    // NIVEL 2: $1,000 - $9,999 → Partes iguales
    else if (netPrize < 10000) {
      distributionLevel = 'NIVEL 2: Premio Mediano - Partes Iguales';
      perMember = netPrize / memberCount;
      winnerAmount = perMember;
      groupTotal = netPrize;
    }
    // NIVEL 3: $10,000 - $99,999 → Partes iguales + bono 10%
    else if (netPrize < 100000) {
      distributionLevel = 'NIVEL 3: Premio Grande - Partes Iguales + Bono 10%';
      perMember = netPrize / memberCount;
      winnerBonus = netPrize * 0.10;
      winnerAmount = perMember + winnerBonus;
      groupTotal = netPrize;
    }
    // NIVEL 4: $100,000+ → Partes iguales + bono 15% + fondo 5%
    else {
      distributionLevel = 'NIVEL 4: JACKPOT - Partes Iguales + Bono 15% + Fondo 5%';
      clubFund = netPrize * 0.05;
      const toDistribute = netPrize * 0.95;
      perMember = toDistribute / memberCount;
      winnerBonus = netPrize * 0.15;
      winnerAmount = perMember + winnerBonus;
      groupTotal = toDistribute;
    }

    setResults({
      grossPrize: prize,
      taxRate: tax,
      taxAmount,
      netPrize,
      distributionLevel,
      winnerAmount,
      winnerBonus,
      groupTotal,
      memberCount,
      perMember,
      clubFund,
    });
  }

  function downloadList() {
    if (!results) return;

    let csv = 'Nombre,Telegram,Email,Monto,Enviado,Confirmado\n';
    
    members.forEach(member => {
      csv += `${member.first_name} ${member.last_name || ''},@${member.telegram_username || member.telegram_id},${member.email || 'N/A'},$${results.perMember.toFixed(2)},NO,NO\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reparto-premio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  function copyMessage() {
    if (!results) return;

    let message = `🎊 PROCESO DE REPARTO - CLUB ANBEL AI

Premio ganado: $${results.grossPrize.toLocaleString('en-US', {minimumFractionDigits: 2})}
Impuestos (${results.taxRate}%): -$${results.taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
Premio neto: $${results.netPrize.toLocaleString('en-US', {minimumFractionDigits: 2})}

📊 ${results.distributionLevel}
`;

    if (results.perMember === 0) {
      // NIVEL 1: Premio pequeño
      message += `
✨ El ganador recibe el premio completo: $${results.winnerAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}

Este premio NO se reparte (menor a $1,000).
¡Felicidades al ganador! 🎉`;
    } else {
      // NIVEL 2, 3 o 4: Se reparte
      message += `
SOCIOS ACTIVOS: ${results.memberCount}

DISTRIBUCIÓN:`;

      if (results.clubFund > 0) {
        message += `
• Fondo del Club (5%): $${results.clubFund.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      }

      message += `
• Parte Base (cada miembro): $${results.perMember.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

      if (results.winnerBonus > 0) {
        message += `
• Bono Especial Ganador: $${results.winnerBonus.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      }

      message += `

💰 GANADOR RECIBE: $${results.winnerAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
👥 OTROS ${results.memberCount - 1} MIEMBROS: $${results.perMember.toLocaleString('en-US', {minimumFractionDigits: 2})} cada uno

Plazo: 7 días máximo

¡Felicidades a todos! 🍀`;
    }

    navigator.clipboard.writeText(message).then(() => {
      alert('✅ Mensaje copiado! Puedes pegarlo en el grupo.');
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calculadora de Premios</h1>
        <p className="text-gray-600 mt-2">Calcula el reparto de premios grandes automáticamente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Datos del Premio</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">Monto Total del Premio (USD)</label>
              <input
                type="number"
                className="input-field"
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(e.target.value)}
                placeholder="Ejemplo: 10000"
                step="0.01"
              />
            </div>

            <div>
              <label className="label">Porcentaje de Impuestos (%)</label>
              <input
                type="number"
                className="input-field"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                step="0.1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Federal: 24% | Estatal: 0-8% (depende del estado)
              </p>
            </div>

            <div>
              <label className="label">Socios Activos</label>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-2">
                <p className="text-2xl font-bold text-green-900">{members.length}</p>
                <p className="text-sm text-green-800">socios activos detectados</p>
              </div>
              <button
                onClick={loadActiveMembers}
                className="text-sm text-green-600 hover:text-green-700"
              >
                🔄 Recargar lista de socios
              </button>
            </div>

            <button
              onClick={calculate}
              className="btn-primary w-full py-4 text-lg"
            >
              🧮 Calcular Reparto
            </button>
          </div>
        </div>

        {results && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Resultados</h2>
            
            {/* Distribution Level Badge */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm font-semibold text-purple-800 mb-1">Sistema de Distribución</p>
              <p className="text-lg font-bold text-purple-900">{results.distributionLevel}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">Premio Bruto</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${results.grossPrize.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">Impuestos ({results.taxRate}%)</p>
                <p className="text-xl font-bold text-red-900">
                  -${results.taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-500">
                <p className="text-sm text-green-800">Premio Neto</p>
                <p className="text-3xl font-bold text-green-900">
                  ${results.netPrize.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </div>

              {/* Club Fund (Level 4 only) */}
              {results.clubFund > 0 && (
                <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-400">
                  <p className="text-sm text-indigo-800">🏛️ Fondo del Club (5%)</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    ${results.clubFund.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </p>
                </div>
              )}

              {/* Winner Amount */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-500">
                <p className="text-sm text-yellow-800">💰 Ganador Recibe</p>
                <p className="text-3xl font-bold text-yellow-900">
                  ${results.winnerAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
                {results.winnerBonus > 0 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    (Incluye bono especial de ${results.winnerBonus.toLocaleString('en-US', {minimumFractionDigits: 2})})
                  </p>
                )}
              </div>

              {/* Per Member (if distributed) */}
              {results.perMember > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-500">
                  <p className="text-sm text-purple-800">👥 Cada Miembro Recibe ({results.memberCount} socios)</p>
                  <p className="text-3xl font-bold text-purple-900">
                    ${results.perMember.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </p>
                </div>
              )}

              {/* No distribution message */}
              {results.perMember === 0 && (
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm font-bold text-orange-900 mb-1">ℹ️ Este premio NO se reparte</p>
                  <p className="text-sm text-orange-800">
                    Los premios menores a $1,000 van completos para el ganador.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={copyMessage}
                  className="btn-primary flex-1"
                >
                  📋 Copiar Anuncio
                </button>
                {results.perMember > 0 && (
                  <button
                    onClick={downloadList}
                    className="btn-secondary flex-1"
                  >
                    📥 Descargar Lista
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {results && members.length > 0 && results.perMember > 0 && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            👥 Lista de Socios para Reparto ({members.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Nombre</th>
                  <th className="text-left py-3 px-4">Telegram</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Monto</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="py-3 px-4">
                      {member.telegram_username ? `@${member.telegram_username}` : member.telegram_id}
                    </td>
                    <td className="py-3 px-4">{member.email || 'N/A'}</td>
                    <td className="py-3 px-4 font-bold text-green-600">
                      ${results.perMember.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 font-bold">
                  <td colSpan={4} className="py-3 px-4 text-right">TOTAL A DISTRIBUIR:</td>
                  <td className="py-3 px-4 text-green-900">
                    ${results.groupTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="font-bold text-yellow-900 mb-2">⚠️ Instrucciones para el Ganador:</p>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Descarga la lista CSV haciendo clic en "Descargar Lista"</li>
              <li>Abre el archivo en Excel</li>
              <li>Envía ${results.perMember.toFixed(2)} a cada socio usando Zelle/PayPal</li>
              <li>Marca cada uno cuando lo envíes</li>
              <li>Pide confirmación a cada socio</li>
              <li>Marca cuando confirmen</li>
              <li>Completa en máximo 7 días</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}







