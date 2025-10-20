'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            🎰 Club Anbel AI
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            Sistema Inteligente de Loterías con IA
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Únete a nuestra comunidad, recibe predicciones generadas por inteligencia artificial
            y participa en la distribución de premios entre todos los miembros activos.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Predicciones IA</h3>
            <p className="text-gray-300">
              Números generados con inteligencia artificial basados en análisis histórico y patrones estadísticos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-white mb-3">Premios Compartidos</h3>
            <p className="text-gray-300">
              Sistema justo de distribución: cuando alguien gana, todos los miembros activos participan del premio.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Transparencia Total</h3>
            <p className="text-gray-300">
              Directiva electa, contrato claro y reportes mensuales. Todo es verificable y transparente.
            </p>
          </div>
        </div>

        {/* Precios */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">💳 Planes de Membresía</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border-2 border-blue-400/50">
              <div className="text-center">
                <div className="text-lg text-blue-300 mb-2">Plan Semanal</div>
                <div className="text-5xl font-bold text-white mb-4">$10</div>
                <div className="text-gray-300 text-sm">USD por semana</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border-2 border-green-400">
              <div className="text-center">
                <div className="text-lg text-green-300 mb-2">Plan Mensual</div>
                <div className="text-5xl font-bold text-white mb-4">$40</div>
                <div className="text-gray-300 text-sm">USD por mes • Ahorra $10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Programa de Referidos */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/50 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-6">🎁 Programa de Referidos</h2>
          <p className="text-gray-300 text-center mb-8">¡Gana beneficios por invitar amigos!</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">1</div>
              <div className="text-sm text-gray-300">referido</div>
              <div className="text-green-400 font-semibold mt-2">1 semana gratis</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm text-gray-300">referidos</div>
              <div className="text-green-400 font-semibold mt-2">1 mes gratis</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">5</div>
              <div className="text-sm text-gray-300">referidos</div>
              <div className="text-green-400 font-semibold mt-2">2 meses gratis</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center border-2 border-yellow-400">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-sm text-gray-300">referidos</div>
              <div className="text-yellow-400 font-semibold mt-2">3 meses gratis</div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="text-center space-y-6">
          <div className="space-x-4">
            <Link
              href="/contract"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              📜 Leer Contrato
            </Link>
            <Link
              href="/team"
              className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              🏛️ Conocer el Equipo
            </Link>
          </div>
          
          <div className="text-gray-400">
            <p className="mb-2">📱 Contáctanos para unirte:</p>
            <p className="text-white font-semibold">WhatsApp: +573144467389 | Telegram: +17867725681</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>🏛️ Club Anbel AI - Unidos por el Éxito</p>
          <p className="mt-2">Sistema transparente y profesional de loterías con IA</p>
        </div>
      </div>
    </div>
  );
}

