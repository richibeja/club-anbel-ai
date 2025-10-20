// Servicio para obtener datos históricos de APIs de loterías
// Auto-actualización de sorteos

import { LotteryType, HistoricalDraw } from './lottery-types';
import { HistoricalDataLoader } from './historical-data-loader';

export class LotteryAPIFetcher {
  
  /**
   * Obtiene sorteos históricos de Powerball
   */
  static async fetchPowerballDraws(limit: number = 100): Promise<HistoricalDraw[]> {
    try {
      // API pública de NY Lottery
      const response = await fetch(
        `https://data.ny.gov/resource/d6yy-54nr.json?$order=draw_date%20DESC&$limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de Powerball');
      }
      
      const data = await response.json();
      
      // Transformar datos al formato esperado
      const draws: HistoricalDraw[] = data.map((item: any) => ({
        id: `powerball-${item.draw_date}`,
        lottery_type: 'Powerball' as LotteryType,
        draw_date: item.draw_date.split('T')[0],
        numbers: [
          parseInt(item.winning_numbers.split(' ')[0]),
          parseInt(item.winning_numbers.split(' ')[1]),
          parseInt(item.winning_numbers.split(' ')[2]),
          parseInt(item.winning_numbers.split(' ')[3]),
          parseInt(item.winning_numbers.split(' ')[4])
        ].filter(n => !isNaN(n)),
        bonus_number: parseInt(item.winning_numbers.split(' ')[5]) || 1,
        created_at: new Date().toISOString()
      }));
      
      return draws.filter(d => d.numbers.length === 5);
    } catch (error) {
      console.error('Error fetching Powerball:', error);
      return [];
    }
  }
  
  /**
   * Obtiene sorteos históricos de Mega Millions
   */
  static async fetchMegaMillionsDraws(limit: number = 100): Promise<HistoricalDraw[]> {
    try {
      // API pública de NY Lottery para Mega Millions
      const response = await fetch(
        `https://data.ny.gov/resource/5xaw-6ayf.json?$order=draw_date%20DESC&$limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de Mega Millions');
      }
      
      const data = await response.json();
      
      const draws: HistoricalDraw[] = data.map((item: any) => ({
        id: `megamillions-${item.draw_date}`,
        lottery_type: 'MegaMillions' as LotteryType,
        draw_date: item.draw_date.split('T')[0],
        numbers: [
          parseInt(item.winning_numbers.split(' ')[0]),
          parseInt(item.winning_numbers.split(' ')[1]),
          parseInt(item.winning_numbers.split(' ')[2]),
          parseInt(item.winning_numbers.split(' ')[3]),
          parseInt(item.winning_numbers.split(' ')[4])
        ].filter(n => !isNaN(n)),
        bonus_number: parseInt(item.mega_ball) || parseInt(item.winning_numbers.split(' ')[5]) || 1,
        created_at: new Date().toISOString()
      }));
      
      return draws.filter(d => d.numbers.length === 5);
    } catch (error) {
      console.error('Error fetching Mega Millions:', error);
      return [];
    }
  }
  
  /**
   * Obtiene sorteos de Baloto (scraping del sitio oficial)
   */
  static async fetchBalotoDraws(limit: number = 50): Promise<HistoricalDraw[]> {
    try {
      // Baloto no tiene API pública, así que usaremos datos simulados por ahora
      // En producción, necesitarías un servidor backend que haga scraping
      console.warn('Baloto no tiene API pública. Importa datos manualmente por ahora.');
      return [];
    } catch (error) {
      console.error('Error fetching Baloto:', error);
      return [];
    }
  }
  
  /**
   * Sincroniza datos de una lotería específica
   */
  static async syncLottery(
    lotteryType: LotteryType,
    limit: number = 100
  ): Promise<{ success: boolean; imported: number; errors: string[] }> {
    try {
      let draws: HistoricalDraw[] = [];
      
      switch (lotteryType) {
        case 'Powerball':
          draws = await this.fetchPowerballDraws(limit);
          break;
        case 'MegaMillions':
          draws = await this.fetchMegaMillionsDraws(limit);
          break;
        case 'Baloto':
          draws = await this.fetchBalotoDraws(limit);
          break;
      }
      
      if (draws.length === 0) {
        return {
          success: false,
          imported: 0,
          errors: ['No se pudieron obtener datos de la API']
        };
      }
      
      // Convertir a CSV y usar el importador existente
      const csvLines = ['fecha,n1,n2,n3,n4,n5,bonus'];
      for (const draw of draws) {
        const line = `${draw.draw_date},${draw.numbers.join(',')},${draw.bonus_number}`;
        csvLines.push(line);
      }
      
      const csvData = csvLines.join('\n');
      
      // Importar usando el sistema existente
      return await HistoricalDataLoader.importFromCSV(csvData, lotteryType);
    } catch (error: any) {
      return {
        success: false,
        imported: 0,
        errors: [error.message || 'Error desconocido']
      };
    }
  }
  
  /**
   * Verifica si hay nuevos sorteos disponibles
   */
  static async checkForNewDraws(lotteryType: LotteryType): Promise<number> {
    try {
      let draws: HistoricalDraw[] = [];
      
      switch (lotteryType) {
        case 'Powerball':
          draws = await this.fetchPowerballDraws(5); // Solo últimos 5
          break;
        case 'MegaMillions':
          draws = await this.fetchMegaMillionsDraws(5);
          break;
        case 'Baloto':
          draws = await this.fetchBalotoDraws(5);
          break;
      }
      
      // Obtener la fecha del sorteo más reciente en nuestra base de datos
      const existingDraws = await HistoricalDataLoader.getHistoricalDraws(lotteryType);
      if (existingDraws.length === 0) {
        return draws.length;
      }
      
      const latestDate = existingDraws[0].draw_date;
      const newDraws = draws.filter(d => d.draw_date > latestDate);
      
      return newDraws.length;
    } catch (error) {
      console.error('Error checking for new draws:', error);
      return 0;
    }
  }
}




