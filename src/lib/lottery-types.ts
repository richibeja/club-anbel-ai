// Definiciones de tipos para el sistema de análisis de loterías

export type LotteryType = 'Powerball' | 'MegaMillions' | 'Baloto';

export interface LotteryConfig {
  name: string;
  mainNumbers: {
    min: number;
    max: number;
    count: number;
  };
  bonusNumber: {
    min: number;
    max: number;
    name: string;
  };
}

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  Powerball: {
    name: 'Powerball',
    mainNumbers: { min: 1, max: 69, count: 5 },
    bonusNumber: { min: 1, max: 26, name: 'Powerball' }
  },
  MegaMillions: {
    name: 'Mega Millions',
    mainNumbers: { min: 1, max: 70, count: 5 },
    bonusNumber: { min: 1, max: 25, name: 'Mega Ball' }
  },
  Baloto: {
    name: 'Baloto',
    mainNumbers: { min: 1, max: 43, count: 5 },
    bonusNumber: { min: 1, max: 16, name: 'Baloto' }
  }
};

export interface HistoricalDraw {
  id: string;
  lottery_type: LotteryType;
  draw_date: string;
  numbers: number[];
  bonus_number: number;
  created_at: string;
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
  lastSeen: number; // sorteos desde última aparición (gap)
}

export interface NumberPair {
  numbers: [number, number];
  count: number;
}

export interface NumberTriplet {
  numbers: [number, number, number];
  count: number;
}

export interface LotteryStatistics {
  lottery_type: LotteryType;
  total_draws: number;
  last_updated: string;
  
  // Frecuencias
  number_frequencies: NumberFrequency[];
  bonus_frequencies: NumberFrequency[];
  
  // Patrones
  hot_numbers: number[]; // Top 10 más frecuentes
  cold_numbers: number[]; // Top 10 menos frecuentes
  overdue_numbers: number[]; // Números con mayor gap
  
  // Parejas y tríos
  top_pairs: NumberPair[];
  top_triplets: NumberTriplet[];
  
  // Distribución
  odd_even_ratio: { odd: number; even: number };
  range_distribution: {
    low: number;    // 1-23 (Powerball) o proporcional
    mid: number;    // 24-46
    high: number;   // 47-69
  };
  
  // Sumas
  sum_stats: {
    min: number;
    max: number;
    average: number;
    median: number;
    most_common: number[];
  };
  
  // Consecutivos
  consecutive_frequency: number; // % de sorteos con números consecutivos
}

export interface GeneratedPrediction {
  numbers: number[];
  bonus_number: number;
  score: number; // 0-100 basado en análisis
  analysis: {
    hot_numbers_used: number;
    cold_numbers_used: number;
    pairs_matched: number;
    odd_even_balance: string;
    range_balance: string;
    sum_value: number;
    has_consecutive: boolean;
  };
}

export interface GenerationConfig {
  lottery_type: LotteryType;
  count: number; // cantidad de predicciones a generar
  draw_date: string;
  
  // Pesos para el scoring (0-1)
  weights?: {
    frequency: number;      // Importancia de números frecuentes
    pairs: number;          // Importancia de parejas conocidas
    gaps: number;           // Importancia de números con gap alto
    distribution: number;   // Importancia de distribución balanceada
  };
}





