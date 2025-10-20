'use client';

import { useState } from 'react';
import { LotteryType, LotteryStatistics, GeneratedPrediction } from '@/lib/lottery-types';
import { LotteryAnalyzer } from '@/lib/lottery-analyzer';
import { LotteryGenerator } from '@/lib/lottery-generator';
import { HistoricalDataLoader } from '@/lib/historical-data-loader';
import { LotteryAPIFetcher } from '@/lib/lottery-api-fetcher';
import { RealLotteryFetcher } from '@/lib/real-lottery-fetcher';
import { LocalAnalyzer } from '@/lib/local-analyzer';

export default function GeneratorPage() {
  const [lotteryType, setLotteryType] = useState<LotteryType>('Powerball');
  const [count, setCount] = useState(50);
  const [drawDate, setDrawDate] = useState('');
  
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  
  const [historicalCount, setHistoricalCount] = useState(0);
  const [statistics, setStatistics] = useState<any>(null);
  const [predictions, setPredictions] = useState<GeneratedPrediction[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [fetchingReal, setFetchingReal] = useState(false);

  // Cargar conteo de datos históricos
  const loadHistoricalCount = async () => {
    const count = await HistoricalDataLoader.countHistoricalDraws(lotteryType);
    setHistoricalCount(count);
  };

  // Importar datos históricos
  const handleImport = async () => {
    if (!csvData.trim()) {
      setError('Por favor ingresa datos CSV');
      return;
    }

    setImporting(true);
    setError('');
    setImportResult(null);

    try {
      const result = await HistoricalDataLoader.importFromCSV(csvData, lotteryType);
      setImportResult(result);
      
      if (result.success) {
        await loadHistoricalCount();
      }
    } catch (err: any) {
      setError(err.message || 'Error al importar datos');
    } finally {
      setImporting(false);
    }
  };

  // Sincronizar con API de lotería
  const syncWithAPI = async () => {
    setSyncing(true);
    setError('');
    setSyncResult(null);

    try {
      const result = await LotteryAPIFetcher.syncLottery(lotteryType, 100);
      setSyncResult(result);
      
      if (result.success) {
        await loadHistoricalCount();
      }
    } catch (err: any) {
      setError(err.message || 'Error al sincronizar con API');
    } finally {
      setSyncing(false);
    }
  };

  // Obtener datos REALES de APIs oficiales
  const handleFetchRealData = async () => {
    setFetchingReal(true);
    setError('');

    try {
      const lotteryTypeKey = lotteryType.toLowerCase() as 'powerball' | 'megamillions' | 'baloto';
      const realData = await RealLotteryFetcher.getRealData(lotteryTypeKey);
      
      // Guardar en localStorage para uso inmediato
      RealLotteryFetcher.saveToLocalStorage(lotteryTypeKey, realData);
      
      // Convertir a CSV y importar
      const csvData = RealLotteryFetcher.convertToCSV(realData);
      setCsvData(csvData);
      
      // Importar automáticamente
      await handleImport();
      
      setError(`✅ Datos REALES obtenidos: ${realData.length} sorteos históricos`);
      
    } catch (err: any) {
      setError(`❌ Error obteniendo datos reales: ${err.message}`);
    } finally {
      setFetchingReal(false);
    }
  };

  // Descargar CSV de ejemplo
  const downloadSampleCSV = () => {
    const csv = HistoricalDataLoader.generateSampleCSV(lotteryType);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejemplo-${lotteryType}.csv`;
    a.click();
  };

  // Analizar datos históricos
  const analyzeHistorical = async () => {
    setLoading(true);
    setError('');
    setStatistics(null);

    try {
      // Intentar análisis local primero
      const localStats = LocalAnalyzer.analyzeHistoricalData(lotteryType);
      
      // Usar las estadísticas locales directamente
      const compatibleStats = localStats;
      
      setStatistics(compatibleStats);
      setError(`✅ Análisis completado: ${localStats.totalDraws} sorteos analizados`);
      
    } catch (err: any) {
      setError(`❌ Error en análisis: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generar predicciones
  const generatePredictions = async () => {
    if (!statistics) {
      setError('Analiza los datos históricos primero');
      return;
    }

    if (!drawDate) {
      setError('Selecciona una fecha de sorteo');
      return;
    }

    if (count < 1 || count > 1000) {
      setError('La cantidad debe estar entre 1 y 1000');
      return;
    }

    setLoading(true);
    setError('');
    setPredictions([]);

    try {
      // Usar LocalAnalyzer para generar predicciones
      const generated = LocalAnalyzer.generatePredictions(lotteryType.toLowerCase(), count);
      
      // Convertir a formato compatible
      const compatiblePredictions: GeneratedPrediction[] = generated.map((pred: any, index: number) => ({
        numbers: pred.numbers,
        bonus_number: Math.floor(Math.random() * 26) + 1, // Bonus aleatorio
        score: pred.score,
        analysis: {
          hot_numbers_used: pred.numbers.filter((n: number) => 
            statistics?.hot_numbers?.includes(n) || false
          ).length,
          cold_numbers_used: pred.numbers.filter((n: number) => 
            statistics?.cold_numbers?.includes(n) || false
          ).length,
          pairs_matched: 0,
          odd_even_balance: `${pred.numbers.filter((n: number) => n % 2 === 1).length}-${pred.numbers.filter((n: number) => n % 2 === 0).length}`,
          range_balance: 'balanced',
          sum_value: pred.sum,
          has_consecutive: false
        }
      }));

      setPredictions(compatiblePredictions);
      setError(`✅ ${count} predicciones generadas exitosamente`);
      
    } catch (err: any) {
      setError(`❌ Error al generar predicciones: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Guardar predicciones localmente
  const savePredictions = async () => {
    if (predictions.length === 0) {
      setError('No hay predicciones para guardar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Guardar en localStorage
      const savedPredictions = {
        id: `predictions_${Date.now()}`,
        lottery_type: lotteryType,
        draw_date: drawDate,
        count: predictions.length,
        predictions: predictions,
        created_at: new Date().toISOString(),
        statistics: statistics
      };

      // Obtener predicciones existentes
      const existingData = localStorage.getItem('saved_predictions');
      const allPredictions = existingData ? JSON.parse(existingData) : [];
      
      // Agregar nuevas predicciones
      allPredictions.push(savedPredictions);
      
      // Guardar actualizado
      localStorage.setItem('saved_predictions', JSON.stringify(allPredictions));

      // También crear archivo CSV para descargar
      const csvContent = generateCSVForDownload(predictions);
      downloadCSV(csvContent, `predicciones_${lotteryType}_${drawDate}.csv`);

      setError(`✅ ${predictions.length} predicciones guardadas exitosamente`);
      setPredictions([]);
      
    } catch (err: any) {
      setError(`❌ Error al guardar predicciones: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generar CSV para descarga
  const generateCSVForDownload = (preds: GeneratedPrediction[]) => {
    const headers = 'ID,Números,Bonus,Fecha,Lotería,Score,Suma,Par,Impar\n';
    const rows = preds.map((pred, index) => {
      const numbers = pred.numbers.join('-');
      const sum = pred.numbers.reduce((a, b) => a + b, 0);
      const even = pred.numbers.filter(n => n % 2 === 0).length;
      const odd = pred.numbers.length - even;
      
      return `${index + 1},${numbers},${pred.bonus_number},${drawDate},${lotteryType},${pred.score},${sum},${even},${odd}`;
    }).join('\n');
    
    return headers + rows;
  };

  // Descargar CSV
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Sistema de Predicciones Inteligente
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Análisis estadístico avanzado con datos reales de loterías oficiales. 
            <span className="font-semibold text-green-400">Ciencia, no magia.</span>
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-green-300">📊 200+ Sorteos Analizados</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-green-300">🧮 Estrategias Matemáticas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-green-300">🌐 APIs Oficiales</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Configuración */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Lotería:</label>
              <select
                value={lotteryType}
                onChange={(e) => {
                  setLotteryType(e.target.value as LotteryType);
                  setStatistics(null);
                  setPredictions([]);
                  loadHistoricalCount();
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Powerball">Powerball (USA)</option>
                <option value="MegaMillions">Mega Millions (USA)</option>
                <option value="Baloto">Baloto (Colombia)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Cantidad:</label>
              <input
                type="number"
                value={count}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setCount(Math.max(1, Math.min(1000, value)));
                }}
                min="1"
                max="1000"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Fecha Sorteo:</label>
              <input
                type="date"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Datos Históricos */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Datos Históricos</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              📈 Datos históricos de {lotteryType}: {historicalCount} sorteos
            </p>
            <div className="flex gap-2">
              <button
                onClick={loadHistoricalCount}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                🔄 Actualizar Conteo
              </button>
              <button
                onClick={handleFetchRealData}
                disabled={fetchingReal}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {fetchingReal ? '⏳ Obteniendo...' : '🌐 Datos REALES'}
              </button>
            </div>
          </div>
        </div>

        {/* Obtener Datos REALES */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-xl p-8 mb-8 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🌐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Datos REALES de APIs Oficiales
                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold">OFICIAL</span>
              </h2>
              <p className="text-gray-600">
                Conexión directa con APIs oficiales de loterías para datos históricos verificados
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleFetchRealData}
              disabled={fetchingReal}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold shadow-lg"
            >
              {fetchingReal ? '⏳ Obteniendo datos REALES...' : '🌐 Obtener Datos REALES'}
            </button>
            
            <div className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">✅</span>
              <span>Powerball & Mega Millions: APIs oficiales NY Lottery</span>
            </div>
          </div>

          {lotteryType === 'Baloto' && (
            <p className="mt-3 text-sm text-amber-600">
              ⚠️ Baloto: Implementando web scraping de página oficial
            </p>
          )}
        </div>

        {/* Analizar Datos */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🔬</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Análisis Estadístico Avanzado</h2>
              <p className="text-gray-600">Procesamiento de datos con algoritmos matemáticos profesionales</p>
            </div>
          </div>
          
          <button
            onClick={analyzeHistorical}
            disabled={loading || historicalCount === 0}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando Datos...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🔬</span>
                <span>Analizar Datos Históricos</span>
              </div>
            )}
          </button>

          {statistics && (
            <div className="mt-8">
              {/* Métricas Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.total_draws}</div>
                  <div className="text-sm text-blue-700 font-semibold">Sorteos Analizados</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">{statistics.distribution?.average_sum || 0}</div>
                  <div className="text-sm text-green-700 font-semibold">Suma Promedio</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{statistics.distribution?.consecutive_percentage || 0}%</div>
                  <div className="text-sm text-purple-700 font-semibold">Con Consecutivos</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{statistics.distribution?.optimal_sum_percentage || 0}%</div>
                  <div className="text-sm text-orange-700 font-semibold">Suma Óptima</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Números Calientes */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span>Números Calientes</span>
                    <span className="text-sm bg-red-200 text-red-800 px-2 py-1 rounded-full">Más Frecuentes</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {statistics.hot_numbers?.map((num: number) => (
                      <span key={num} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md transform hover:scale-110 transition-transform">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Números Fríos */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">❄️</span>
                    <span>Números Fríos</span>
                    <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Menos Frecuentes</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {statistics.cold_numbers?.map((num: number) => (
                      <span key={num} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md transform hover:scale-110 transition-transform">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Números Vencidos */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    <span>Números Vencidos</span>
                    <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Más Tiempo Sin Salir</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {statistics.overdue_numbers?.map((num: number) => (
                      <span key={num} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md transform hover:scale-110 transition-transform">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estadísticas Generales */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-md md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <span>Estadísticas Generales</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{statistics.total_draws}</div>
                      <div className="text-sm text-gray-600">Total Sorteos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{statistics.distribution?.even_odd?.even || 0}% / {statistics.distribution?.even_odd?.odd || 0}%</div>
                      <div className="text-sm text-gray-600">Par / Impar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{statistics.distribution?.ranges?.low || 0}% / {statistics.distribution?.ranges?.mid || 0}% / {statistics.distribution?.ranges?.high || 0}%</div>
                      <div className="text-sm text-gray-600">Bajo / Medio / Alto</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{statistics.distribution?.consecutive_percentage || 0}%</div>
                      <div className="text-sm text-gray-600">Consecutivos</div>
                    </div>
                  </div>
                </div>

                {/* Top Parejas */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 shadow-md md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <span>Parejas Más Comunes</span>
                    <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Patrones Detectados</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {statistics.pair_analysis?.slice(0, 5).map((pair: any, i: number) => (
                      <div key={i} className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md transform hover:scale-110 transition-transform">
                        ({pair.pair[0]}, {pair.pair[1]}) - {pair.frequency}x
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generar Predicciones */}
        {statistics && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎲</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Generación de Predicciones Inteligentes</h2>
                <p className="text-gray-600">Algoritmos avanzados aplicando todas las estrategias matemáticas</p>
              </div>
            </div>
            
            <button
              onClick={generatePredictions}
              disabled={loading || !drawDate}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-10 py-5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-200 w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generando Predicciones Inteligentes...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>🎲</span>
                  <span>Generar {count} Predicciones Inteligentes</span>
                </div>
              )}
            </button>

            {predictions.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Predicciones Generadas ({predictions.length})</h3>
                  <button
                    onClick={savePredictions}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    💾 Guardar Predicciones
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Números</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Bonus</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Análisis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((pred, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex gap-1">
                              {pred.numbers.map((num: number) => (
                                <span key={num} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                  {num}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">
                              {pred.bonus_number}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              pred.score >= 70 ? 'bg-green-100 text-green-700' :
                              pred.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {pred.score}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-xs">
                            🔥{pred.analysis.hot_numbers_used} 
                            🎯{pred.analysis.pairs_matched}p
                            {pred.analysis.has_consecutive && ' 🔢'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}