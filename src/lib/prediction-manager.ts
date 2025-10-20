import Database from './database';
import { Prediction, Member } from '@/types';

export class PredictionManager {
  static async assignPredictionsToActiveMembers(): Promise<{
    success: boolean;
    assigned: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let assignedCount = 0;

    try {
      const activeMembers = await Database.getActiveMembers();
      const availablePredictions = await Database.getAvailablePredictions();

      if (activeMembers.length === 0) {
        errors.push('No active members found');
        return { success: false, assigned: 0, errors };
      }

      if (availablePredictions.length === 0) {
        errors.push('No available predictions found');
        return { success: false, assigned: 0, errors };
      }

      const predictionsNeeded = Math.min(activeMembers.length, availablePredictions.length);

      for (let i = 0; i < predictionsNeeded; i++) {
        const member = activeMembers[i];
        const prediction = availablePredictions[i];

        const existingPrediction = await Database.getMemberPrediction(member.id);
        if (existingPrediction) {
          continue;
        }

        await Database.assignPredictionToMember(
          prediction.id,
          member.id,
          `${member.first_name} ${member.last_name || ''}`
        );
        assignedCount++;
      }

      return {
        success: true,
        assigned: assignedCount,
        errors,
      };
    } catch (error) {
      errors.push(`Error assigning predictions: ${error}`);
      return { success: false, assigned: assignedCount, errors };
    }
  }

  static async importPredictionsFromCSV(csvData: string, lottery_type: string, draw_date: string): Promise<{
    success: boolean;
    imported: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    const predictions: Omit<Prediction, 'id' | 'created_at'>[] = [];

    try {
      const lines = csvData.trim().split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',').map(p => p.trim());
        
        if (lottery_type === 'Powerball') {
          if (parts.length < 6) {
            errors.push(`Line ${i + 1}: Invalid format`);
            continue;
          }
          
          const numbers = parts.slice(0, 5).map(n => parseInt(n));
          const powerball = parseInt(parts[5]);
          
          if (numbers.some(isNaN) || isNaN(powerball)) {
            errors.push(`Line ${i + 1}: Invalid numbers`);
            continue;
          }
          
          predictions.push({
            lottery_type: 'Powerball',
            numbers,
            powerball,
            draw_date,
            status: 'available',
          });
        } else if (lottery_type === 'MegaMillions') {
          if (parts.length < 6) {
            errors.push(`Line ${i + 1}: Invalid format`);
            continue;
          }
          
          const numbers = parts.slice(0, 5).map(n => parseInt(n));
          const megaball = parseInt(parts[5]);
          
          if (numbers.some(isNaN) || isNaN(megaball)) {
            errors.push(`Line ${i + 1}: Invalid numbers`);
            continue;
          }
          
          predictions.push({
            lottery_type: 'MegaMillions',
            numbers,
            megaball,
            draw_date,
            status: 'available',
          });
        }
      }

      if (predictions.length > 0) {
        await Database.createPredictionBatch(predictions, lottery_type, draw_date);
      }

      return {
        success: predictions.length > 0,
        imported: predictions.length,
        errors,
      };
    } catch (error) {
      errors.push(`Import error: ${error}`);
      return { success: false, imported: 0, errors };
    }
  }

  static formatPredictionForDisplay(prediction: Prediction): string {
    const numbersStr = prediction.numbers.join(', ');
    
    if (prediction.lottery_type === 'Powerball') {
      return `🎱 Powerball: ${numbersStr} + PB: ${prediction.powerball}`;
    } else if (prediction.lottery_type === 'MegaMillions') {
      return `💰 Mega Millions: ${numbersStr} + MB: ${prediction.megaball}`;
    } else if (prediction.lottery_type === 'EuroMillions') {
      const starsStr = prediction.lucky_stars?.join(', ') || '';
      return `⭐ EuroMillions: ${numbersStr} + Stars: ${starsStr}`;
    }
    
    return `${prediction.lottery_type}: ${numbersStr}`;
  }
}

export default PredictionManager;

