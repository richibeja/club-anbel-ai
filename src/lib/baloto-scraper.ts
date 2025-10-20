/**
 * Web Scraper para Baloto (Colombia)
 * Obtiene datos históricos de sorteos desde fuentes oficiales
 */

export interface BalotoDrawData {
  date: string;
  numbers: number[];
  bonus: number;
}

/**
 * Simula datos de Baloto para desarrollo
 * En producción, esto haría scraping real de la página oficial
 */
export class BalotoScraper {
  
  /**
   * Obtiene sorteos históricos de Baloto
   * @param count Número de sorteos a obtener
   */
  static async getHistoricalDraws(count: number = 200): Promise<BalotoDrawData[]> {
    try {
      // TODO: En producción, implementar scraping real
      // Por ahora, generamos datos realistas basados en estadísticas de Baloto
      
      const draws: BalotoDrawData[] = [];
      const today = new Date();
      
      // Baloto sortea miércoles y sábados
      const sortDays = [3, 6]; // Miércoles = 3, Sábado = 6
      
      let currentDate = new Date(today);
      let drawsGenerated = 0;
      
      while (drawsGenerated < count) {
        // Retroceder día por día
        currentDate.setDate(currentDate.getDate() - 1);
        
        // Verificar si es día de sorteo
        if (sortDays.includes(currentDate.getDay())) {
          const draw = this.generateRealisticDraw(currentDate);
          draws.push(draw);
          drawsGenerated++;
        }
      }
      
      return draws.reverse(); // Ordenar cronológicamente
      
    } catch (error) {
      console.error('Error al obtener sorteos de Baloto:', error);
      throw new Error('No se pudieron obtener los sorteos de Baloto');
    }
  }
  
  /**
   * Genera un sorteo realista basado en estadísticas de Baloto
   */
  private static generateRealisticDraw(date: Date): BalotoDrawData {
    // Baloto: 5 números del 1 al 43 + 1 bonus (Superbalota) del 1 al 16
    
    // Números calientes históricos de Baloto (datos reales aproximados)
    const hotNumbers = [2, 5, 8, 11, 15, 18, 23, 27, 31, 35, 38, 41];
    
    // Rangos de Baloto
    const LOW_RANGE = 14; // 1-14
    const MID_RANGE = 29; // 15-29
    const HIGH_RANGE = 43; // 30-43
    
    const numbers = new Set<number>();
    
    // Estrategia: Mezclar números calientes con aleatorios
    while (numbers.size < 5) {
      let num: number;
      
      if (numbers.size < 2 && Math.random() < 0.6) {
        // 60% probabilidad de usar número caliente en primeros 2
        num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      } else {
        // Generar con distribución realista
        const range = Math.random();
        if (range < 0.35) {
          // 35% números bajos (1-14)
          num = Math.floor(Math.random() * LOW_RANGE) + 1;
        } else if (range < 0.70) {
          // 35% números medios (15-29)
          num = Math.floor(Math.random() * (MID_RANGE - LOW_RANGE)) + LOW_RANGE + 1;
        } else {
          // 30% números altos (30-43)
          num = Math.floor(Math.random() * (HIGH_RANGE - MID_RANGE)) + MID_RANGE + 1;
        }
      }
      
      numbers.add(num);
    }
    
    // Bonus (Superbalota): 1-16
    const bonus = Math.floor(Math.random() * 16) + 1;
    
    // Validar suma en rango típico de Baloto (50-130 aprox)
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    const sum = sortedNumbers.reduce((a, b) => a + b, 0);
    
    // Si la suma está fuera de rango común, ajustar
    if (sum < 50 || sum > 130) {
      return this.generateRealisticDraw(date); // Reintentar
    }
    
    return {
      date: date.toISOString().split('T')[0],
      numbers: sortedNumbers,
      bonus: bonus
    };
  }
  
  /**
   * Convierte datos de Baloto a formato CSV
   */
  static convertToCSV(draws: BalotoDrawData[]): string {
    const header = 'fecha,n1,n2,n3,n4,n5,bonus\n';
    const rows = draws.map(draw => 
      `${draw.date},${draw.numbers.join(',')},${draw.bonus}`
    ).join('\n');
    
    return header + rows;
  }
  
  /**
   * Guarda datos en localStorage
   */
  static saveToLocalStorage(draws: BalotoDrawData[]): void {
    const data = {
      lottery: 'baloto',
      lastUpdated: new Date().toISOString(),
      count: draws.length,
      draws: draws
    };
    
    localStorage.setItem('baloto_historical_data', JSON.stringify(data));
  }
  
  /**
   * Carga datos desde localStorage
   */
  static loadFromLocalStorage(): BalotoDrawData[] | null {
    const stored = localStorage.getItem('baloto_historical_data');
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      return data.draws;
    } catch {
      return null;
    }
  }
}

/**
 * URLs oficiales de Baloto (para referencia futura)
 */
export const BALOTO_SOURCES = {
  official: 'https://www.gana.com.co/baloto',
  results: 'https://www.gana.com.co/baloto/resultados',
  statistics: 'https://www.gana.com.co/baloto/estadisticas'
};

/**
 * Información sobre Baloto
 */
export const BALOTO_INFO = {
  name: 'Baloto',
  country: 'Colombia',
  mainNumbers: {
    min: 1,
    max: 43,
    count: 5
  },
  bonus: {
    name: 'Superbalota',
    min: 1,
    max: 16,
    count: 1
  },
  drawDays: ['Miércoles', 'Sábado'],
  price: '6,300 COP',
  jackpotStart: '5,000,000,000 COP'
};





