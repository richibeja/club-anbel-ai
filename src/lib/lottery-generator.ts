// Generador de predicciones basado en análisis estadístico
// Usa matemáticas reales, no magia

import { 
  LotteryType,
  LotteryStatistics,
  GeneratedPrediction,
  GenerationConfig,
  LOTTERY_CONFIGS 
} from './lottery-types';

export class LotteryGenerator {
  
  /**
   * Genera N predicciones basadas en análisis estadístico
   * ESTRATEGIA: Usa matemáticas reales, no magia
   */
  static generate(
    stats: LotteryStatistics, 
    config: GenerationConfig
  ): GeneratedPrediction[] {
    const predictions: GeneratedPrediction[] = [];
    const lotteryConfig = LOTTERY_CONFIGS[config.lottery_type];
    const used = new Set<string>(); // Evitar duplicados
    
    // Pesos por defecto si no se especifican
    const weights = config.weights || {
      frequency: 0.4,  // 40% peso a números frecuentes
      pairs: 0.2,      // 20% peso a parejas conocidas
      gaps: 0.2,       // 20% peso a números con gap
      distribution: 0.2 // 20% peso a distribución balanceada
    };
    
    let attempts = 0;
    const maxAttempts = config.count * 20; // Más intentos para filtros estrictos
    
    while (predictions.length < config.count && attempts < maxAttempts) {
      attempts++;
      
      // Generar una predicción
      const prediction = this.generateSingle(stats, lotteryConfig, weights);
      
      // ESTRATEGIA 1: Validar suma en rango óptimo (104-176)
      // 70% de ganadores históricos tienen suma en este rango
      const sum = prediction.numbers.reduce((a, b) => a + b, 0);
      const isOptimalSum = sum >= 104 && sum <= 176;
      
      // ESTRATEGIA 2: Evitar SOLO números bajos (cumpleaños 1-31)
      const numbersAbove31 = prediction.numbers.filter(n => n > 31).length;
      const hasHighNumbers = numbersAbove31 >= 2; // Al menos 2 números > 31
      
      // Verificar que no sea duplicada
      const key = prediction.numbers.sort((a, b) => a - b).join('-') + '-' + prediction.bonus_number;
      
      // Aceptar predicción si cumple estrategias o si es buena de todas formas
      if (!used.has(key) && (isOptimalSum || prediction.score > 65) && hasHighNumbers) {
        used.add(key);
        predictions.push(prediction);
      }
    }
    
    // Ordenar por score (mejores primero)
    return predictions.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Genera una sola predicción usando análisis estadístico
   */
  private static generateSingle(
    stats: LotteryStatistics,
    config: any,
    weights: any
  ): GeneratedPrediction {
    const numbers: number[] = [];
    const numberCount = config.mainNumbers.count;
    
    // Pool de números con probabilidades ajustadas
    const numberPool = this.buildWeightedPool(stats, config, weights);
    
    // Seleccionar números principales
    while (numbers.length < numberCount) {
      const num = this.selectWeightedNumber(numberPool, numbers);
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    numbers.sort((a, b) => a - b);
    
    // Seleccionar bonus basado en frecuencia
    const bonusNumber = this.selectBonusNumber(stats.bonus_frequencies);
    
    // Calcular score de calidad
    const analysis = this.analyzeGeneration(numbers, bonusNumber, stats, config);
    const score = this.calculateScore(analysis, weights);
    
    return {
      numbers,
      bonus_number: bonusNumber,
      score,
      analysis
    };
  }
  
  /**
   * Construye un pool de números con pesos estadísticos
   */
  private static buildWeightedPool(stats: LotteryStatistics, config: any, weights: any) {
    const pool: Array<{ number: number; weight: number }> = [];
    
    const { min, max } = config.mainNumbers;
    
    for (let num = min; num <= max; num++) {
      let weight = 1.0;
      
      // Factor 1: Frecuencia histórica
      const freq = stats.number_frequencies.find(f => f.number === num);
      if (freq) {
        const normalizedFreq = freq.percentage / 100;
        weight += normalizedFreq * weights.frequency * 10;
      }
      
      // Factor 2: Gap (tiempo sin salir)
      if (freq && freq.lastSeen > 10) {
        weight += (freq.lastSeen / 50) * weights.gaps * 5;
      }
      
      // Factor 3: Números calientes
      if (stats.hot_numbers.includes(num)) {
        weight += weights.frequency * 2;
      }
      
      // Factor 4: Números vencidos (overdue)
      if (stats.overdue_numbers.includes(num)) {
        weight += weights.gaps * 1.5;
      }
      
      pool.push({ number: num, weight });
    }
    
    return pool;
  }
  
  /**
   * Selecciona un número del pool usando pesos
   */
  private static selectWeightedNumber(
    pool: Array<{ number: number; weight: number }>,
    excludeNumbers: number[]
  ): number {
    // Filtrar números ya usados
    const available = pool.filter(p => !excludeNumbers.includes(p.number));
    
    if (available.length === 0) {
      return Math.floor(Math.random() * pool.length) + 1;
    }
    
    // Calcular peso total
    const totalWeight = available.reduce((sum, p) => sum + p.weight, 0);
    
    // Selección aleatoria ponderada
    let random = Math.random() * totalWeight;
    
    for (const item of available) {
      random -= item.weight;
      if (random <= 0) {
        return item.number;
      }
    }
    
    return available[0].number;
  }
  
  /**
   * Selecciona número bonus basado en frecuencia
   */
  private static selectBonusNumber(bonusFreqs: any[]): number {
    const totalWeight = bonusFreqs.reduce((sum, f) => sum + f.count, 0);
    let random = Math.random() * totalWeight;
    
    for (const freq of bonusFreqs) {
      random -= freq.count;
      if (random <= 0) {
        return freq.number;
      }
    }
    
    return bonusFreqs[0].number;
  }
  
  /**
   * Analiza la calidad de la predicción generada
   */
  private static analyzeGeneration(
    numbers: number[],
    bonusNumber: number,
    stats: LotteryStatistics,
    config: any
  ) {
    // Contar números calientes usados
    const hotNumbersUsed = numbers.filter(n => stats.hot_numbers.includes(n)).length;
    
    // Contar números fríos usados
    const coldNumbersUsed = numbers.filter(n => stats.cold_numbers.includes(n)).length;
    
    // Contar parejas conocidas
    let pairsMatched = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const pair = stats.top_pairs.find(
          p => (p.numbers[0] === numbers[i] && p.numbers[1] === numbers[j]) ||
               (p.numbers[0] === numbers[j] && p.numbers[1] === numbers[i])
        );
        if (pair) pairsMatched++;
      }
    }
    
    // Balance par/impar
    const oddCount = numbers.filter(n => n % 2 !== 0).length;
    const evenCount = numbers.length - oddCount;
    const oddEvenBalance = `${oddCount}/${evenCount}`;
    
    // Balance de rangos
    const maxNum = config.mainNumbers.max;
    const lowThreshold = Math.floor(maxNum / 3);
    const highThreshold = Math.floor((maxNum * 2) / 3);
    
    const low = numbers.filter(n => n <= lowThreshold).length;
    const mid = numbers.filter(n => n > lowThreshold && n <= highThreshold).length;
    const high = numbers.filter(n => n > highThreshold).length;
    const rangeBalance = `${low}/${mid}/${high}`;
    
    // Suma total
    const sumValue = numbers.reduce((acc, n) => acc + n, 0);
    
    // Tiene consecutivos
    const hasConsecutive = numbers.some((n, i) => 
      i < numbers.length - 1 && numbers[i + 1] === n + 1
    );
    
    return {
      hot_numbers_used: hotNumbersUsed,
      cold_numbers_used: coldNumbersUsed,
      pairs_matched: pairsMatched,
      odd_even_balance: oddEvenBalance,
      range_balance: rangeBalance,
      sum_value: sumValue,
      has_consecutive: hasConsecutive
    };
  }
  
  /**
   * Calcula score de calidad (0-100)
   * ESTRATEGIAS BASADAS EN ANÁLISIS DE GANADORES HISTÓRICOS
   */
  private static calculateScore(analysis: any, weights: any): number {
    let score = 50; // Base
    
    // ESTRATEGIA: Suma en rango óptimo (104-176) - 70% de ganadores
    const sumValue = analysis.sum_value;
    if (sumValue >= 104 && sumValue <= 176) {
      score += 15; // Bonus fuerte por suma óptima
    } else if (sumValue >= 95 && sumValue < 104) {
      score += 5; // Cerca del rango bajo
    } else if (sumValue > 176 && sumValue <= 185) {
      score += 5; // Cerca del rango alto
    } else {
      score -= 10; // Penalización por estar fuera del rango
    }
    
    // Bonus por números calientes (máx +15)
    score += analysis.hot_numbers_used * 3;
    
    // Bonus por parejas conocidas (máx +10)
    score += analysis.pairs_matched * 5;
    
    // ESTRATEGIA: Balance par/impar cercano a distribución histórica
    const [odd, even] = analysis.odd_even_balance.split('/').map(Number);
    const balance = Math.abs(odd - even);
    if (balance <= 1) score += 10; // Muy balanceado
    else if (balance <= 2) score += 5;
    else if (balance >= 4) score -= 5; // Muy desbalanceado
    
    // ESTRATEGIA: Balance de rangos (bajo/medio/alto)
    const [low, mid, high] = analysis.range_balance.split('/').map(Number);
    if (low >= 1 && mid >= 1 && high >= 1) {
      score += 12; // Distribución en todos los rangos
    } else if (low === 0 || high === 0) {
      score -= 8; // Penalización por no tener distribución
    }
    
    // Penalización por demasiados números fríos
    if (analysis.cold_numbers_used > 3) score -= 8;
    
    // Bonus si tiene consecutivos (aparece en ~45% de sorteos)
    if (analysis.has_consecutive) score += 5;
    
    // Normalizar a 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  /**
   * Genera estadísticas de un lote de predicciones
   */
  static getBatchStatistics(predictions: GeneratedPrediction[]) {
    const scores = predictions.map(p => p.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    const allNumbers = predictions.flatMap(p => p.numbers);
    const numberFreq: Map<number, number> = new Map();
    allNumbers.forEach(n => numberFreq.set(n, (numberFreq.get(n) || 0) + 1));
    
    const mostUsed = Array.from(numberFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([num, count]) => ({ number: num, count }));
    
    return {
      total: predictions.length,
      average_score: avgScore,
      min_score: Math.min(...scores),
      max_score: Math.max(...scores),
      most_used_numbers: mostUsed
    };
  }
}

