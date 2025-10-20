// Analizador temporal de patrones de lotería
// Identifica tendencias por mes, trimestre, año

import { HistoricalDraw, LotteryType, NumberFrequency } from './lottery-types';

export interface TemporalPattern {
  period: string; // 'Enero 2024', 'Q1 2024', '2024'
  period_type: 'month' | 'quarter' | 'year';
  number_frequencies: NumberFrequency[];
  hot_numbers: number[];
  cold_numbers: number[];
  most_common_pairs: Array<{ numbers: [number, number]; count: number }>;
  total_draws: number;
}

export interface SeasonalTrend {
  number: number;
  by_month: { [month: string]: number }; // 'Enero': 5, 'Febrero': 3, ...
  by_quarter: { [quarter: string]: number }; // 'Q1': 12, 'Q2': 8, ...
  by_year: { [year: string]: number }; // '2023': 15, '2024': 18, ...
}

export class TemporalAnalyzer {
  
  /**
   * Analiza patrones por período de tiempo
   */
  static analyzeByPeriod(
    draws: HistoricalDraw[],
    periodType: 'month' | 'quarter' | 'year',
    startDate?: string,
    endDate?: string
  ): TemporalPattern[] {
    // Filtrar por rango de fechas si se especifica
    let filteredDraws = draws;
    if (startDate) {
      filteredDraws = filteredDraws.filter(d => d.draw_date >= startDate);
    }
    if (endDate) {
      filteredDraws = filteredDraws.filter(d => d.draw_date <= endDate);
    }
    
    // Agrupar sorteos por período
    const grouped = this.groupByPeriod(filteredDraws, periodType);
    
    // Analizar cada grupo
    const patterns: TemporalPattern[] = [];
    
    for (const [period, periodDraws] of Object.entries(grouped)) {
      const frequencies = this.calculateFrequenciesForPeriod(periodDraws);
      const hotNumbers = frequencies
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(f => f.number);
      const coldNumbers = frequencies
        .sort((a, b) => a.count - b.count)
        .slice(0, 10)
        .map(f => f.number);
      const pairs = this.findPairsForPeriod(periodDraws);
      
      patterns.push({
        period,
        period_type: periodType,
        number_frequencies: frequencies,
        hot_numbers: hotNumbers,
        cold_numbers: coldNumbers,
        most_common_pairs: pairs.slice(0, 5),
        total_draws: periodDraws.length
      });
    }
    
    return patterns.sort((a, b) => b.period.localeCompare(a.period));
  }
  
  /**
   * Agrupa sorteos por mes, trimestre o año
   */
  private static groupByPeriod(
    draws: HistoricalDraw[],
    periodType: 'month' | 'quarter' | 'year'
  ): { [period: string]: HistoricalDraw[] } {
    const grouped: { [period: string]: HistoricalDraw[] } = {};
    
    for (const draw of draws) {
      const date = new Date(draw.draw_date);
      let periodKey: string;
      
      if (periodType === 'month') {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        periodKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      } else if (periodType === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        periodKey = `Q${quarter} ${date.getFullYear()}`;
      } else {
        periodKey = date.getFullYear().toString();
      }
      
      if (!grouped[periodKey]) {
        grouped[periodKey] = [];
      }
      grouped[periodKey].push(draw);
    }
    
    return grouped;
  }
  
  /**
   * Calcula frecuencias para un período específico
   */
  private static calculateFrequenciesForPeriod(draws: HistoricalDraw[]): NumberFrequency[] {
    const frequencies: Map<number, number> = new Map();
    
    // Inicializar todos los números posibles (1-69 para Powerball)
    for (let i = 1; i <= 69; i++) {
      frequencies.set(i, 0);
    }
    
    // Contar apariciones
    for (const draw of draws) {
      for (const num of draw.numbers) {
        frequencies.set(num, (frequencies.get(num) || 0) + 1);
      }
    }
    
    // Convertir a array
    return Array.from(frequencies.entries()).map(([number, count]) => ({
      number,
      count,
      percentage: (count / draws.length) * 100,
      lastSeen: 0 // Simplificado para análisis temporal
    }));
  }
  
  /**
   * Encuentra parejas comunes en un período
   */
  private static findPairsForPeriod(draws: HistoricalDraw[]): Array<{ numbers: [number, number]; count: number }> {
    const pairs: Map<string, number> = new Map();
    
    for (const draw of draws) {
      const sorted = [...draw.numbers].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length - 1; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]}-${sorted[j]}`;
          pairs.set(key, (pairs.get(key) || 0) + 1);
        }
      }
    }
    
    return Array.from(pairs.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => {
        const [n1, n2] = key.split('-').map(Number);
        return { numbers: [n1, n2] as [number, number], count };
      });
  }
  
  /**
   * Analiza tendencias estacionales de números específicos
   */
  static analyzeSeasonalTrends(draws: HistoricalDraw[]): SeasonalTrend[] {
    const trends: Map<number, SeasonalTrend> = new Map();
    
    // Inicializar todos los números
    for (let i = 1; i <= 69; i++) {
      trends.set(i, {
        number: i,
        by_month: {},
        by_quarter: {},
        by_year: {}
      });
    }
    
    // Contar apariciones por período
    for (const draw of draws) {
      const date = new Date(draw.draw_date);
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const month = monthNames[date.getMonth()];
      const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
      const year = date.getFullYear().toString();
      
      for (const num of draw.numbers) {
        const trend = trends.get(num)!;
        trend.by_month[month] = (trend.by_month[month] || 0) + 1;
        trend.by_quarter[quarter] = (trend.by_quarter[quarter] || 0) + 1;
        trend.by_year[year] = (trend.by_year[year] || 0) + 1;
      }
    }
    
    return Array.from(trends.values());
  }
  
  /**
   * Obtiene los números más calientes para un período específico
   */
  static getHotNumbersForPeriod(
    draws: HistoricalDraw[],
    periodType: 'recent' | 'last_month' | 'last_quarter' | 'last_year'
  ): number[] {
    const now = new Date();
    let startDate: Date;
    
    switch (periodType) {
      case 'recent':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // Últimos 30 días
        break;
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'last_quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
    }
    
    const filteredDraws = draws.filter(d => new Date(d.draw_date) >= startDate);
    const frequencies = this.calculateFrequenciesForPeriod(filteredDraws);
    
    return frequencies
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(f => f.number);
  }
  
  /**
   * Compara dos períodos para ver cambios en tendencias
   */
  static comparePeriods(
    draws: HistoricalDraw[],
    period1Start: string,
    period1End: string,
    period2Start: string,
    period2End: string
  ) {
    const period1Draws = draws.filter(d => 
      d.draw_date >= period1Start && d.draw_date <= period1End
    );
    const period2Draws = draws.filter(d => 
      d.draw_date >= period2Start && d.draw_date <= period2End
    );
    
    const freq1 = this.calculateFrequenciesForPeriod(period1Draws);
    const freq2 = this.calculateFrequenciesForPeriod(period2Draws);
    
    // Encontrar números que subieron o bajaron
    const changes = freq1.map((f1, i) => {
      const f2 = freq2[i];
      return {
        number: f1.number,
        period1_count: f1.count,
        period2_count: f2.count,
        change: f2.count - f1.count,
        change_percentage: f1.count > 0 ? ((f2.count - f1.count) / f1.count) * 100 : 0
      };
    });
    
    return {
      trending_up: changes.filter(c => c.change > 0).sort((a, b) => b.change - a.change).slice(0, 10),
      trending_down: changes.filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 10),
      stable: changes.filter(c => c.change === 0)
    };
  }
}




