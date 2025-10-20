// Motor de análisis estadístico de loterías
// Análisis matemático puro basado en datos históricos

import { 
  LotteryType, 
  HistoricalDraw, 
  LotteryStatistics,
  NumberFrequency,
  NumberPair,
  LOTTERY_CONFIGS 
} from './lottery-types';

export class LotteryAnalyzer {
  
  /**
   * Analiza datos históricos y retorna estadísticas matemáticas
   */
  static analyze(draws: HistoricalDraw[], lotteryType: LotteryType): LotteryStatistics {
    const config = LOTTERY_CONFIGS[lotteryType];
    
    // 1. FRECUENCIA DE NÚMEROS
    const numberFrequencies = this.calculateFrequencies(
      draws, 
      config.mainNumbers.min, 
      config.mainNumbers.max
    );
    
    // 2. FRECUENCIA DE BONUS
    const bonusFrequencies = this.calculateBonusFrequencies(
      draws,
      config.bonusNumber.min,
      config.bonusNumber.max
    );
    
    // 3. NÚMEROS CALIENTES (top 10 más frecuentes)
    const hotNumbers = numberFrequencies
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(f => f.number);
    
    // 4. NÚMEROS FRÍOS (top 10 menos frecuentes)
    const coldNumbers = numberFrequencies
      .sort((a, b) => a.count - b.count)
      .slice(0, 10)
      .map(f => f.number);
    
    // 5. NÚMEROS CON MAYOR GAP (tiempo sin salir)
    const overdueNumbers = numberFrequencies
      .sort((a, b) => b.lastSeen - a.lastSeen)
      .slice(0, 10)
      .map(f => f.number);
    
    // 6. PAREJAS MÁS COMUNES
    const topPairs = this.findTopPairs(draws, 10);
    
    // 7. TRÍOS MÁS COMUNES
    const topTriplets = this.findTopTriplets(draws, 5);
    
    // 8. DISTRIBUCIÓN PAR/IMPAR
    const oddEvenRatio = this.calculateOddEvenRatio(draws);
    
    // 9. DISTRIBUCIÓN POR RANGOS
    const rangeDistribution = this.calculateRangeDistribution(draws, config.mainNumbers.max);
    
    // 10. ESTADÍSTICAS DE SUMAS
    const sumStats = this.calculateSumStatistics(draws);
    
    // 11. FRECUENCIA DE CONSECUTIVOS
    const consecutiveFrequency = this.calculateConsecutiveFrequency(draws);
    
    return {
      lottery_type: lotteryType,
      total_draws: draws.length,
      last_updated: new Date().toISOString(),
      number_frequencies: numberFrequencies,
      bonus_frequencies: bonusFrequencies,
      hot_numbers: hotNumbers,
      cold_numbers: coldNumbers,
      overdue_numbers: overdueNumbers,
      top_pairs: topPairs,
      top_triplets: topTriplets,
      odd_even_ratio: oddEvenRatio,
      range_distribution: rangeDistribution,
      sum_stats: sumStats,
      consecutive_frequency: consecutiveFrequency
    };
  }
  
  /**
   * Calcula frecuencia de aparición de cada número
   */
  private static calculateFrequencies(
    draws: HistoricalDraw[], 
    min: number, 
    max: number
  ): NumberFrequency[] {
    const frequencies: Map<number, { count: number; lastSeenIndex: number }> = new Map();
    
    // Inicializar todos los números posibles
    for (let i = min; i <= max; i++) {
      frequencies.set(i, { count: 0, lastSeenIndex: -1 });
    }
    
    // Contar apariciones (recorremos del más reciente al más antiguo)
    draws.forEach((draw, index) => {
      draw.numbers.forEach(num => {
        const freq = frequencies.get(num)!;
        freq.count++;
        if (freq.lastSeenIndex === -1) {
          freq.lastSeenIndex = index;
        }
      });
    });
    
    const totalDraws = draws.length;
    
    // Convertir a array con porcentajes y gaps
    return Array.from(frequencies.entries()).map(([number, data]) => ({
      number,
      count: data.count,
      percentage: (data.count / totalDraws) * 100,
      lastSeen: data.lastSeenIndex === -1 ? totalDraws : data.lastSeenIndex
    }));
  }
  
  /**
   * Calcula frecuencia del número bonus
   */
  private static calculateBonusFrequencies(
    draws: HistoricalDraw[],
    min: number,
    max: number
  ): NumberFrequency[] {
    const frequencies: Map<number, number> = new Map();
    
    // Inicializar
    for (let i = min; i <= max; i++) {
      frequencies.set(i, 0);
    }
    
    // Contar
    draws.forEach(draw => {
      const count = frequencies.get(draw.bonus_number) || 0;
      frequencies.set(draw.bonus_number, count + 1);
    });
    
    const totalDraws = draws.length;
    
    return Array.from(frequencies.entries()).map(([number, count]) => ({
      number,
      count,
      percentage: (count / totalDraws) * 100,
      lastSeen: 0 // Simplificado para bonus
    }));
  }
  
  /**
   * Encuentra las parejas de números más comunes
   */
  private static findTopPairs(draws: HistoricalDraw[], topN: number): NumberPair[] {
    const pairs: Map<string, number> = new Map();
    
    draws.forEach(draw => {
      const sorted = [...draw.numbers].sort((a, b) => a - b);
      
      // Generar todas las combinaciones de 2
      for (let i = 0; i < sorted.length - 1; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]}-${sorted[j]}`;
          pairs.set(key, (pairs.get(key) || 0) + 1);
        }
      }
    });
    
    // Ordenar y tomar top N
    return Array.from(pairs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([key, count]) => {
        const [n1, n2] = key.split('-').map(Number);
        return { numbers: [n1, n2] as [number, number], count };
      });
  }
  
  /**
   * Encuentra los tríos de números más comunes
   */
  private static findTopTriplets(draws: HistoricalDraw[], topN: number) {
    const triplets: Map<string, number> = new Map();
    
    draws.forEach(draw => {
      const sorted = [...draw.numbers].sort((a, b) => a - b);
      
      // Generar todas las combinaciones de 3
      for (let i = 0; i < sorted.length - 2; i++) {
        for (let j = i + 1; j < sorted.length - 1; j++) {
          for (let k = j + 1; k < sorted.length; k++) {
            const key = `${sorted[i]}-${sorted[j]}-${sorted[k]}`;
            triplets.set(key, (triplets.get(key) || 0) + 1);
          }
        }
      }
    });
    
    return Array.from(triplets.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([key, count]) => {
        const nums = key.split('-').map(Number) as [number, number, number];
        return { numbers: nums, count };
      });
  }
  
  /**
   * Calcula ratio de números pares vs impares
   */
  private static calculateOddEvenRatio(draws: HistoricalDraw[]) {
    let oddCount = 0;
    let evenCount = 0;
    
    draws.forEach(draw => {
      draw.numbers.forEach(num => {
        if (num % 2 === 0) evenCount++;
        else oddCount++;
      });
    });
    
    const total = oddCount + evenCount;
    return {
      odd: Math.round((oddCount / total) * 100),
      even: Math.round((evenCount / total) * 100)
    };
  }
  
  /**
   * Calcula distribución por rangos (bajo/medio/alto)
   */
  private static calculateRangeDistribution(draws: HistoricalDraw[], maxNumber: number) {
    const lowThreshold = Math.floor(maxNumber / 3);
    const highThreshold = Math.floor((maxNumber * 2) / 3);
    
    let low = 0, mid = 0, high = 0;
    
    draws.forEach(draw => {
      draw.numbers.forEach(num => {
        if (num <= lowThreshold) low++;
        else if (num <= highThreshold) mid++;
        else high++;
      });
    });
    
    const total = low + mid + high;
    return {
      low: Math.round((low / total) * 100),
      mid: Math.round((mid / total) * 100),
      high: Math.round((high / total) * 100)
    };
  }
  
  /**
   * Calcula estadísticas de las sumas de números
   */
  private static calculateSumStatistics(draws: HistoricalDraw[]) {
    const sums = draws.map(draw => 
      draw.numbers.reduce((acc, num) => acc + num, 0)
    );
    
    sums.sort((a, b) => a - b);
    
    const sum = sums.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / sums.length);
    const median = sums[Math.floor(sums.length / 2)];
    
    // Encontrar sumas más comunes
    const sumFrequency: Map<number, number> = new Map();
    sums.forEach(s => sumFrequency.set(s, (sumFrequency.get(s) || 0) + 1));
    
    const mostCommon = Array.from(sumFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sum]) => sum);
    
    return {
      min: sums[0],
      max: sums[sums.length - 1],
      average,
      median,
      most_common: mostCommon
    };
  }
  
  /**
   * Calcula frecuencia de números consecutivos
   */
  private static calculateConsecutiveFrequency(draws: HistoricalDraw[]): number {
    let withConsecutive = 0;
    
    draws.forEach(draw => {
      const sorted = [...draw.numbers].sort((a, b) => a - b);
      
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) {
          withConsecutive++;
          break;
        }
      }
    });
    
    return Math.round((withConsecutive / draws.length) * 100);
  }
}




