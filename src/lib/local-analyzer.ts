/**
 * Analizador local que funciona SIN Firebase
 * Usa localStorage para almacenar y analizar datos
 */

export interface LocalDraw {
  fecha: string;
  numeros: number[];
  bonus?: number;
}

export interface LocalStatistics {
  totalDraws: number;
  hotNumbers: { number: number; frequency: number }[];
  coldNumbers: { number: number; frequency: number }[];
  overdueNumbers: { number: number; lastSeen: string }[];
  pairAnalysis: { pair: string; frequency: number }[];
  distribution: {
    evenOdd: { even: number; odd: number };
    ranges: { low: number; mid: number; high: number };
    consecutive: number;
    averageSum: number;
    optimalSumCount: number;
  };
}

export class LocalAnalyzer {
  
  /**
   * Obtiene datos desde localStorage
   */
  static getLocalData(lotteryType: string): LocalDraw[] {
    const key = `real_lottery_data_${lotteryType.toLowerCase()}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Analiza datos históricos localmente
   */
  static analyzeHistoricalData(lotteryType: string): LocalStatistics {
    const draws = this.getLocalData(lotteryType);
    
    if (draws.length === 0) {
      throw new Error('No hay datos históricos disponibles');
    }

    // Análisis de frecuencias
    const frequencyMap = new Map<number, number>();
    const lastSeenMap = new Map<number, string>();
    
    draws.forEach(draw => {
      draw.numeros.forEach(num => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
        lastSeenMap.set(num, draw.fecha);
      });
    });

    // Números calientes (top 10)
    const hotNumbers = Array.from(frequencyMap.entries())
      .map(([number, frequency]) => ({ number, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Números fríos (bottom 10)
    const coldNumbers = Array.from(frequencyMap.entries())
      .map(([number, frequency]) => ({ number, frequency }))
      .sort((a, b) => a.frequency - b.frequency)
      .slice(0, 10);

    // Números vencidos (más tiempo sin salir)
    const overdueNumbers = Array.from(lastSeenMap.entries())
      .map(([number, lastSeen]) => ({ number, lastSeen }))
      .sort((a, b) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime())
      .slice(0, 10);

    // Análisis de parejas
    const pairMap = new Map<string, number>();
    draws.forEach(draw => {
      const nums = draw.numeros.sort((a, b) => a - b);
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          const pair = `${nums[i]},${nums[j]}`;
          pairMap.set(pair, (pairMap.get(pair) || 0) + 1);
        }
      }
    });

    const pairAnalysis = Array.from(pairMap.entries())
      .map(([pair, frequency]) => ({ pair, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Análisis de distribución
    let evenCount = 0;
    let oddCount = 0;
    let lowCount = 0;
    let midCount = 0;
    let highCount = 0;
    let consecutiveCount = 0;
    let sumTotal = 0;
    let optimalSumCount = 0;

    const maxNumber = lotteryType.toLowerCase() === 'powerball' ? 69 : 
                     lotteryType.toLowerCase() === 'megamillions' ? 70 : 43;

    draws.forEach(draw => {
      draw.numeros.forEach(num => {
        // Par/Impar
        if (num % 2 === 0) evenCount++;
        else oddCount++;

        // Rangos
        if (num <= maxNumber / 3) lowCount++;
        else if (num <= (maxNumber * 2) / 3) midCount++;
        else highCount++;

        sumTotal += num;
      });

      // Consecutivos
      const sorted = [...draw.numeros].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) {
          consecutiveCount++;
          break;
        }
      }

      // Suma óptima (104-176)
      const sum = draw.numeros.reduce((a, b) => a + b, 0);
      if (sum >= 104 && sum <= 176) {
        optimalSumCount++;
      }
    });

    const totalNumbers = draws.length * 5;
    const averageSum = sumTotal / draws.length;

    return {
      totalDraws: draws.length,
      hotNumbers,
      coldNumbers,
      overdueNumbers,
      pairAnalysis,
      distribution: {
        evenOdd: {
          even: Math.round((evenCount / totalNumbers) * 100),
          odd: Math.round((oddCount / totalNumbers) * 100)
        },
        ranges: {
          low: Math.round((lowCount / totalNumbers) * 100),
          mid: Math.round((midCount / totalNumbers) * 100),
          high: Math.round((highCount / totalNumbers) * 100)
        },
        consecutive: Math.round((consecutiveCount / draws.length) * 100),
        averageSum: Math.round(averageSum),
        optimalSumCount: Math.round((optimalSumCount / draws.length) * 100)
      }
    };
  }

  /**
   * Genera predicciones basadas en análisis local
   */
  static generatePredictions(lotteryType: string, count: number): any[] {
    const stats = this.analyzeHistoricalData(lotteryType);
    const predictions = [];

    const maxNumber = lotteryType.toLowerCase() === 'powerball' ? 69 : 
                     lotteryType.toLowerCase() === 'megamillions' ? 70 : 43;

    for (let i = 0; i < count; i++) {
      const prediction = this.generateSinglePrediction(stats, maxNumber);
      predictions.push(prediction);
    }

    return predictions.sort((a, b) => b.score - a.score);
  }

  /**
   * Genera una predicción individual
   */
  private static generateSinglePrediction(stats: LocalStatistics, maxNumber: number): any {
    const numbers = new Set<number>();
    
    // Usar números calientes con mayor probabilidad
    const hotNumbers = stats.hotNumbers.map(h => h.number);
    const coldNumbers = stats.coldNumbers.map(c => c.number);
    
    // Seleccionar números balanceados
    while (numbers.size < 5) {
      const rand = Math.random();
      
      if (rand < 0.4 && hotNumbers.length > 0) {
        // 40% probabilidad de números calientes
        const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
        if (num <= maxNumber) numbers.add(num);
      } else if (rand < 0.2 && coldNumbers.length > 0) {
        // 20% probabilidad de números fríos
        const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
        if (num <= maxNumber) numbers.add(num);
      } else {
        // 40% probabilidad de números aleatorios
        const num = Math.floor(Math.random() * maxNumber) + 1;
        numbers.add(num);
      }
    }

    const predictionNumbers = Array.from(numbers).sort((a, b) => a - b);
    const sum = predictionNumbers.reduce((a, b) => a + b, 0);
    
    // Calcular score basado en estrategias
    let score = 50;
    
    // Bonus por suma óptima (104-176)
    if (sum >= 104 && sum <= 176) {
      score += 20;
    }
    
    // Bonus por balance par/impar
    const evenCount = predictionNumbers.filter(n => n % 2 === 0).length;
    const oddCount = predictionNumbers.length - evenCount;
    if (Math.abs(evenCount - oddCount) <= 1) {
      score += 10;
    }
    
    // Bonus por números calientes
    const hotCount = predictionNumbers.filter(n => 
      stats.hotNumbers.some(h => h.number === n)
    ).length;
    score += hotCount * 5;
    
    // Bonus por evitar solo números bajos
    const highCount = predictionNumbers.filter(n => n > 31).length;
    if (highCount >= 2) {
      score += 10;
    }

    return {
      numbers: predictionNumbers,
      sum,
      score: Math.min(score, 100)
    };
  }
}




