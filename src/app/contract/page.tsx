'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContractPage() {
  const [accepted, setAccepted] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    read: false,
    understand: false,
    organization: false,
    payment: false,
    rules: false,
    honest: false,
    directive: false,
  });

  const allChecked = Object.values(checkboxes).every(v => v);

  const handleAccept = () => {
    if (!allChecked) {
      alert('Por favor, acepta todas las condiciones para continuar');
      return;
    }
    setAccepted(true);
    alert('¡Contrato aceptado! Bienvenido al Club Anbel AI 🎉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📜 Contrato de Membresía
          </h1>
          <p className="text-xl text-gray-600">
            Club Anbel AI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Versión 1.0 - Octubre 2025
          </p>
        </div>

        {/* Contract Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* Section: Entre las Partes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🤝 ENTRE LAS PARTES
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>EL CLUB:</strong> Club Anbel AI, comunidad organizada de apostadores de loterías estadounidenses, representado por su Directiva electa.</p>
              <p><strong>EL MIEMBRO:</strong> La persona que acepta este contrato y se une al club como miembro activo.</p>
            </div>
          </div>

          {/* Section: Estructura */}
          <div className="mb-8 bg-green-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🏛️ ESTRUCTURA ORGANIZACIONAL
            </h2>
            <p className="text-gray-700 mb-4">El club está gobernado por una Directiva electa:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <span><strong>Presidente:</strong> Representa oficialmente al club</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <span><strong>Vicepresidente:</strong> Apoya y coordina decisiones</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span><strong>Tesorero:</strong> Gestiona finanzas y pagos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <span><strong>Secretario:</strong> Mantiene registros</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span><strong>Coordinador:</strong> Genera números</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗣️</span>
                <span><strong>Vocales (2):</strong> Representan a miembros</span>
              </div>
            </div>
          </div>

          {/* Section: Derechos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              ✅ DERECHOS DEL MIEMBRO
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Predicciones Semanales:</strong> Números generados por IA</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Participación en Premios:</strong> Sistema de partes iguales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Transparencia Total:</strong> Reportes mensuales públicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Voz y Voto:</strong> Participación en decisiones importantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Elegibilidad:</strong> Poder ser elegido para directiva (2+ meses)</span>
              </li>
            </ul>
          </div>

          {/* Section: Obligaciones */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📌 OBLIGACIONES DEL MIEMBRO
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Pago Puntual:</strong> Mantener membresía al día</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Compra de Boletos:</strong> Jugar números asignados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Subir Comprobantes:</strong> Fotografiar boletos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Honestidad:</strong> Reportar ganancias transparentemente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Respeto:</strong> Mantener buena conducta</span>
              </li>
            </ul>
          </div>

          {/* Section: Membresía */}
          <div className="mb-8 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📅 PLANES DE MEMBRESÍA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">$10</div>
                <div className="font-semibold">Plan Semanal</div>
                <div className="text-sm text-gray-600">Por semana</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-2 border-green-500">
                <div className="text-3xl font-bold text-green-600 mb-2">$40</div>
                <div className="font-semibold">Plan Mensual</div>
                <div className="text-sm text-gray-600">Ahorra $10/mes</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Métodos de pago:</strong> Zelle, Cash App, Venmo, PayPal, Transferencias, Crypto, Remesas, Hotmart
            </div>
          </div>

          {/* Section: Premios */}
          <div className="mb-8 bg-yellow-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              💰 ¿CÓMO SE REPARTEN LOS PREMIOS?
            </h2>
            
            <div className="bg-blue-100 border-2 border-blue-500 p-4 rounded-lg mb-4">
              <p className="text-center font-bold text-blue-900 text-lg mb-2">
                📌 REGLA SIMPLE: Depende del tamaño del premio
              </p>
            </div>

            <div className="space-y-4">
              {/* Nivel 1 */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">Premios Pequeños</div>
                    <div className="text-sm text-gray-600">Menos de $1,000</div>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold text-orange-900 mb-2">El ganador se queda con TODO</p>
                  <p className="text-sm text-gray-700">
                    <strong>Ejemplo:</strong> Ganaste $500 → <span className="text-green-600 font-bold">Recibes $500 completos</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    ¿Por qué? Porque no tiene sentido repartir $5-10 entre cada miembro.
                  </p>
                </div>
              </div>

              {/* Nivel 2, 3, 4 agrupados */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">💰</div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">Premios Grandes</div>
                    <div className="text-sm text-gray-600">$1,000 o más</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-3">
                  <p className="font-semibold text-green-900 mb-3">Se reparte entre TODOS los miembros activos</p>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-bold text-gray-900 mb-2">¿Cómo funciona?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">1.</span>
                        <span>Se divide el premio entre todos los miembros activos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">2.</span>
                        <span>Cada uno recibe su parte igual</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">3.</span>
                        <span>En premios MUY grandes, el ganador recibe un BONO EXTRA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ejemplos concretos */}
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Ejemplo 1: Premio de $5,000</p>
                    <p className="text-sm text-gray-700">
                      → Club tiene 25 miembros activos<br/>
                      → $5,000 ÷ 25 = <span className="font-bold text-green-600">$200 para cada uno</span><br/>
                      → El ganador también recibe $200 (parte igual como todos)
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm font-semibold text-purple-900 mb-1">Ejemplo 2: Premio de $50,000</p>
                    <p className="text-sm text-gray-700">
                      → Club tiene 30 miembros activos<br/>
                      → Cada uno recibe: $1,267<br/>
                      → <span className="font-bold text-purple-600">BONO: El ganador recibe $5,000 EXTRA</span><br/>
                      → Total ganador: <span className="font-bold text-green-600">$6,267</span><br/>
                      → Los otros 29 miembros: $1,267 cada uno
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Ejemplo 3: JACKPOT $1,000,000</p>
                    <p className="text-sm text-gray-700">
                      → Club tiene 50 miembros activos<br/>
                      → Fondo del club: $50,000 (para eventos)<br/>
                      → Cada uno recibe: $14,440<br/>
                      → <span className="font-bold text-yellow-600">BONO: El ganador recibe $150,000 EXTRA</span><br/>
                      → Total ganador: <span className="font-bold text-green-600">$164,440</span><br/>
                      → Los otros 49 miembros: $14,440 cada uno
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen claro */}
            <div className="mt-4 bg-green-100 border-2 border-green-500 p-4 rounded-lg">
              <p className="font-bold text-green-900 mb-2 text-center">✅ RESUMEN SIMPLE:</p>
              <div className="text-sm text-gray-800 space-y-1">
                <p>• <strong>Premio pequeño:</strong> El ganador se lo queda completo</p>
                <p>• <strong>Premio grande:</strong> Se divide entre todos los miembros activos</p>
                <p>• <strong>En premios muy grandes:</strong> El ganador recibe un bono especial</p>
                <p>• <strong>Solo participan:</strong> Miembros con pagos al día</p>
              </div>
            </div>
          </div>

          {/* Section: Programa de Referidos */}
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🎁 Programa de Referidos
            </h2>
            
            <div className="bg-white p-5 rounded-lg shadow-md mb-4">
              <p className="font-bold text-purple-900 mb-3 text-center">
                ¡Gana beneficios por invitar amigos al club!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">1</div>
                  <div className="text-xs text-blue-700">referido</div>
                  <div className="text-sm font-semibold text-green-700 mt-2">1 semana gratis</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-900">3</div>
                  <div className="text-xs text-purple-700">referidos</div>
                  <div className="text-sm font-semibold text-green-700 mt-2">1 mes gratis</div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-900">5</div>
                  <div className="text-xs text-pink-700">referidos</div>
                  <div className="text-sm font-semibold text-green-700 mt-2">2 meses gratis</div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg text-center border-2 border-yellow-400">
                  <div className="text-2xl font-bold text-yellow-900">10+</div>
                  <div className="text-xs text-yellow-700">referidos</div>
                  <div className="text-sm font-semibold text-green-700 mt-2">3 meses gratis</div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg mb-3">
              <p className="font-bold text-green-900 mb-2">✨ Tu amigo también gana:</p>
              <p className="text-sm text-gray-700">
                Quien use tu código de referido recibe <strong>$5 de descuento</strong> en su primer pago.
              </p>
            </div>

            <div className="text-sm text-gray-700 bg-white p-3 rounded">
              <p className="mb-2"><strong>¿Cómo funciona?</strong></p>
              <div className="space-y-1 text-sm">
                <p>1. Obtienes tu código único (ej: ANBEL-12345)</p>
                <p>2. Compartes con amigos</p>
                <p>3. Ellos se registran con tu código</p>
                <p>4. Cuando paguen, acumulas beneficios automáticamente</p>
              </div>
            </div>
          </div>

          {/* Section: Predicciones Disclaimer */}
          <div className="mb-8 bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              ⚠️ IMPORTANTE - Sistema de Predicciones
            </h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Las predicciones son <strong>apoyo estadístico</strong>, NO garantías de ganancia.</p>
              <p>Las loterías son juegos de azar con probabilidades matemáticas.</p>
              <p className="font-semibold text-red-700">El club NO garantiza premios ni ganancias.</p>
            </div>
          </div>

          {/* Section: Conducta */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚫 CONDUCTAS PROHIBIDAS
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Fraude o engaño con boletos/premios</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Acoso o violencia verbal</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Robo de premios o fondos</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Difamación del club</span>
              </p>
              <p className="text-sm text-red-600 font-semibold mt-3">
                Estas conductas resultan en expulsión inmediata.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-3">📞 CONTACTOS OFICIALES</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>💬 WhatsApp: +573144467389</p>
              <p>📱 Telegram: +17867725681</p>
              <p>📧 Email: richardbejarano52@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Acceptance Checkboxes */}
        {!accepted && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ✅ ACEPTACIÓN DEL CONTRATO
            </h2>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.read}
                  onChange={(e) => setCheckboxes({...checkboxes, read: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">He leído el contrato completo</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.understand}
                  onChange={(e) => setCheckboxes({...checkboxes, understand: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Entiendo el sistema de distribución de premios</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.organization}
                  onChange={(e) => setCheckboxes({...checkboxes, organization: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Acepto la estructura organizacional del club</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.payment}
                  onChange={(e) => setCheckboxes({...checkboxes, payment: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Me comprometo a pagar puntualmente mi membresía</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.rules}
                  onChange={(e) => setCheckboxes({...checkboxes, rules: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Respetaré las reglas de convivencia</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.honest}
                  onChange={(e) => setCheckboxes({...checkboxes, honest: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Participaré honestamente en el club</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.directive}
                  onChange={(e) => setCheckboxes({...checkboxes, directive: e.target.checked})}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">Acepto las decisiones de la directiva electa</span>
              </label>
            </div>

            <button
              onClick={handleAccept}
              disabled={!allChecked}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                allChecked
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {allChecked ? '🎉 Aceptar y Unirme al Club' : '⚠️ Debes aceptar todas las condiciones'}
            </button>
          </div>
        )}

        {/* Success Message */}
        {accepted && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-900 mb-3">
              ¡Bienvenido al Club Anbel AI!
            </h2>
            <p className="text-gray-700 mb-6">
              Has aceptado el contrato exitosamente. Ahora puedes proceder con tu registro y primer pago.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/admin/dashboard" className="btn-primary">
                Ir al Dashboard
              </Link>
              <Link href="/team" className="btn-secondary">
                Conocer el Equipo
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>🏛️ Club Anbel AI - Unidos por el Éxito</p>
          <p className="mt-2">Este contrato representa un acuerdo simbólico de buena fe.</p>
        </div>
      </div>
    </div>
  );
}

