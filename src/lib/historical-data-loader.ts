// Cargador de datos históricos de sorteos
// Importa desde CSV y guarda en Firebase

import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { LotteryType, HistoricalDraw } from './lottery-types';

export class HistoricalDataLoader {
  
  /**
   * Importa sorteos desde CSV
   * Formato esperado: fecha,n1,n2,n3,n4,n5,bonus
   * Ejemplo: 2025-01-15,5,12,23,45,67,15
   */
  static async importFromCSV(
    csvData: string,
    lotteryType: LotteryType
  ): Promise<{ success: boolean; imported: number; errors: string[] }> {
    const errors: string[] = [];
    const draws: Omit<HistoricalDraw, 'id' | 'created_at'>[] = [];
    
    const lines = csvData.trim().split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Saltar líneas vacías o headers
      if (!line || line.toLowerCase().includes('date') || line.toLowerCase().includes('fecha')) {
        continue;
      }
      
      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length < 7) {
        errors.push(`Línea ${i + 1}: Formato inválido (se esperan 7 columnas: fecha,n1,n2,n3,n4,n5,bonus)`);
        continue;
      }
      
      const drawDate = parts[0];
      const numbers = parts.slice(1, 6).map(n => parseInt(n));
      const bonusNumber = parseInt(parts[6]);
      
      // Validaciones
      if (numbers.some(isNaN) || isNaN(bonusNumber)) {
        errors.push(`Línea ${i + 1}: Números inválidos`);
        continue;
      }
      
      if (numbers.length !== 5) {
        errors.push(`Línea ${i + 1}: Deben ser exactamente 5 números principales`);
        continue;
      }
      
      // Verificar duplicados en los números principales
      const uniqueNumbers = new Set(numbers);
      if (uniqueNumbers.size !== 5) {
        errors.push(`Línea ${i + 1}: Números principales duplicados`);
        continue;
      }
      
      draws.push({
        lottery_type: lotteryType,
        draw_date: drawDate,
        numbers,
        bonus_number: bonusNumber
      });
    }
    
    // Guardar en Firebase
    let imported = 0;
    
    for (const draw of draws) {
      try {
        await addDoc(collection(db, 'historical_draws'), {
          ...draw,
          created_at: Timestamp.now()
        });
        imported++;
      } catch (error) {
        errors.push(`Error al guardar sorteo del ${draw.draw_date}: ${error}`);
      }
    }
    
    return {
      success: imported > 0,
      imported,
      errors
    };
  }
  
  /**
   * Obtiene todos los sorteos históricos de una lotería
   */
  static async getHistoricalDraws(lotteryType: LotteryType): Promise<HistoricalDraw[]> {
    try {
      const q = query(
        collection(db, 'historical_draws'),
        where('lottery_type', '==', lotteryType),
        orderBy('draw_date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as HistoricalDraw[];
    } catch (error) {
      console.error('Error al obtener sorteos históricos:', error);
      return [];
    }
  }
  
  /**
   * Cuenta cuántos sorteos históricos hay para una lotería
   */
  static async countHistoricalDraws(lotteryType: LotteryType): Promise<number> {
    try {
      const q = query(
        collection(db, 'historical_draws'),
        where('lottery_type', '==', lotteryType)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error al contar sorteos:', error);
      return 0;
    }
  }
  
  /**
   * Genera CSV de ejemplo para descargar
   */
  static generateSampleCSV(lotteryType: LotteryType): string {
    const lines = [
      'fecha,n1,n2,n3,n4,n5,bonus'
    ];
    
    // Ejemplos según el tipo de lotería
    if (lotteryType === 'Powerball') {
      lines.push('2025-01-15,5,12,23,45,67,15');
      lines.push('2025-01-12,8,19,27,34,53,22');
      lines.push('2025-01-10,3,16,28,41,65,9');
    } else if (lotteryType === 'MegaMillions') {
      lines.push('2025-01-14,7,14,28,42,63,18');
      lines.push('2025-01-11,11,23,35,48,69,21');
      lines.push('2025-01-09,4,17,31,44,58,12');
    } else if (lotteryType === 'Baloto') {
      lines.push('2025-01-13,5,12,23,31,42,8');
      lines.push('2025-01-10,8,15,22,35,41,14');
      lines.push('2025-01-07,3,11,19,28,39,6');
    }
    
    return lines.join('\n');
  }
}




