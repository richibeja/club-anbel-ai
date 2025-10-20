/**
 * Obtiene datos REALES de loterías oficiales
 * Sin simulaciones - Solo datos históricos oficiales
 */

import { BalotoScraper } from './baloto-scraper';

export interface RealDrawData {
  fecha: string;
  numeros: number[];
  bonus?: number;
  jackpot?: number;
}

export class RealLotteryFetcher {
  
  /**
   * Obtiene datos REALES de Powerball (USA)
   * Fuente: NY Lottery API oficial
   */
  static async getRealPowerballData(): Promise<RealDrawData[]> {
    try {
      // API oficial de NY Lottery para Powerball
      const response = await fetch('https://data.ny.gov/resource/d6yy-54nr.json?$limit=200&$order=draw_date DESC');
      
      if (!response.ok) {
        throw new Error(`Error API Powerball: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((draw: any) => ({
        fecha: draw.draw_date,
        numeros: [
          parseInt(draw.winning_numbers.split(' ')[0]),
          parseInt(draw.winning_numbers.split(' ')[1]),
          parseInt(draw.winning_numbers.split(' ')[2]),
          parseInt(draw.winning_numbers.split(' ')[3]),
          parseInt(draw.winning_numbers.split(' ')[4])
        ],
        bonus: parseInt(draw.multiplier),
        jackpot: draw.jackpot ? parseInt(draw.jackpot.replace(/[$,]/g, '')) : undefined
      }));
      
    } catch (error) {
      console.error('Error obteniendo datos reales Powerball:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos REALES de Mega Millions (USA)
   * Fuente: NY Lottery API oficial
   */
  static async getRealMegaMillionsData(): Promise<RealDrawData[]> {
    try {
      // API oficial de NY Lottery para Mega Millions
      const response = await fetch('https://data.ny.gov/resource/5xaw-6ayf.json?$limit=200&$order=draw_date DESC');
      
      if (!response.ok) {
        throw new Error(`Error API Mega Millions: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((draw: any) => ({
        fecha: draw.draw_date,
        numeros: [
          parseInt(draw.winning_numbers.split(' ')[0]),
          parseInt(draw.winning_numbers.split(' ')[1]),
          parseInt(draw.winning_numbers.split(' ')[2]),
          parseInt(draw.winning_numbers.split(' ')[3]),
          parseInt(draw.winning_numbers.split(' ')[4])
        ],
        bonus: parseInt(draw.mega_ball),
        jackpot: draw.jackpot ? parseInt(draw.jackpot.replace(/[$,]/g, '')) : undefined
      }));
      
    } catch (error) {
      console.error('Error obteniendo datos reales Mega Millions:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos REALES de Baloto (Colombia)
   * Fuente: Web scraping de página oficial
   */
  static async getRealBalotoData(): Promise<RealDrawData[]> {
    try {
      // Obtener sorteos históricos usando el scraper
      const draws = await BalotoScraper.getHistoricalDraws(200);
      
      // Guardar en localStorage
      BalotoScraper.saveToLocalStorage(draws);
      
      return draws.map(draw => ({
        fecha: draw.date,
        numeros: draw.numbers,
        bonus: draw.bonus
      }));
      
    } catch (error) {
      console.error('Error obteniendo datos reales Baloto:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos REALES según el tipo de lotería
   */
  static async getRealData(lotteryType: 'powerball' | 'megamillions' | 'baloto'): Promise<RealDrawData[]> {
    switch (lotteryType) {
      case 'powerball':
        return this.getRealPowerballData();
      case 'megamillions':
        return this.getRealMegaMillionsData();
      case 'baloto':
        return this.getRealBalotoData();
      default:
        throw new Error(`Tipo de lotería no soportado: ${lotteryType}`);
    }
  }

  /**
   * Convierte datos reales a formato CSV
   */
  static convertToCSV(data: RealDrawData[]): string {
    const headers = 'fecha,n1,n2,n3,n4,n5,bonus';
    const rows = data.map(draw => 
      `${draw.fecha},${draw.numeros[0]},${draw.numeros[1]},${draw.numeros[2]},${draw.numeros[3]},${draw.numeros[4]},${draw.bonus || ''}`
    );
    
    return [headers, ...rows].join('\n');
  }

  /**
   * Guarda datos reales en localStorage para uso inmediato
   */
  static saveToLocalStorage(lotteryType: string, data: RealDrawData[]): void {
    const key = `real_lottery_data_${lotteryType}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Carga datos reales desde localStorage
   */
  static loadFromLocalStorage(lotteryType: string): RealDrawData[] | null {
    const key = `real_lottery_data_${lotteryType}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}
