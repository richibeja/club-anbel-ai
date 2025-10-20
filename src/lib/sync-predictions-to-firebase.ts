/**
 * Sincroniza predicciones del localStorage a Firebase
 * Para que el Bot de Telegram pueda acceder a ellas
 */

import { db } from './database';
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import type { GeneratedPrediction } from './lottery-types';

export interface SyncResult {
  success: boolean;
  synced: number;
  assigned: number;
  errors: string[];
}

/**
 * Sincroniza predicciones guardadas en localStorage a Firebase
 */
export async function syncPredictionsToFirebase(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    assigned: 0,
    errors: []
  };

  try {
    // Obtener predicciones del localStorage
    const savedData = localStorage.getItem('saved_predictions');
    if (!savedData) {
      result.errors.push('No hay predicciones guardadas en localStorage');
      return result;
    }

    const allSavedPredictions = JSON.parse(savedData);
    
    // Obtener la última sesión de predicciones
    if (allSavedPredictions.length === 0) {
      result.errors.push('No hay sesiones de predicciones');
      return result;
    }

    const latestSession = allSavedPredictions[allSavedPredictions.length - 1];
    const predictions = latestSession.predictions as GeneratedPrediction[];

    // Subir predicciones a Firebase
    for (const prediction of predictions) {
      try {
        await addDoc(collection(db, 'predictions'), {
          numbers: prediction.numbers,
          bonus: prediction.bonus,
          draw_date: prediction.draw_date,
          lottery_type: prediction.lottery_type,
          score: prediction.score,
          analysis: prediction.analysis,
          status: 'available', // Disponible para asignar
          assigned_to: null,
          created_at: new Date().toISOString(),
          synced_from_generator: true
        });
        
        result.synced++;
      } catch (err: any) {
        result.errors.push(`Error al subir predicción: ${err.message}`);
      }
    }

    result.success = result.synced > 0;
    return result;

  } catch (err: any) {
    result.errors.push(`Error general: ${err.message}`);
    return result;
  }
}

/**
 * Asigna predicciones disponibles a miembros activos
 */
export async function assignPredictionsToMembers(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    assigned: 0,
    errors: []
  };

  try {
    // Obtener predicciones disponibles
    const predictionsRef = collection(db, 'predictions');
    const availableQuery = query(
      predictionsRef,
      where('status', '==', 'available')
    );
    const predictionsSnapshot = await getDocs(availableQuery);

    // Obtener miembros activos sin predicción asignada
    const membersRef = collection(db, 'members');
    const membersQuery = query(
      membersRef,
      where('status', '==', 'active')
    );
    const membersSnapshot = await getDocs(membersQuery);

    const availableMembers = [];
    
    // Filtrar miembros que no tienen predicción asignada
    for (const memberDoc of membersSnapshot.docs) {
      const memberId = memberDoc.id;
      
      // Verificar si ya tiene una predicción asignada
      const assignedQuery = query(
        predictionsRef,
        where('assigned_to', '==', memberId),
        where('status', '==', 'assigned')
      );
      const assignedSnapshot = await getDocs(assignedQuery);
      
      if (assignedSnapshot.empty) {
        availableMembers.push({
          id: memberId,
          data: memberDoc.data()
        });
      }
    }

    // Asignar predicciones a miembros
    const predictionsToAssign = predictionsSnapshot.docs.slice(0, availableMembers.length);
    
    for (let i = 0; i < predictionsToAssign.length; i++) {
      const predictionDoc = predictionsToAssign[i];
      const member = availableMembers[i];

      try {
        await updateDoc(doc(db, 'predictions', predictionDoc.id), {
          status: 'assigned',
          assigned_to: member.id,
          assigned_at: new Date().toISOString()
        });

        result.assigned++;
      } catch (err: any) {
        result.errors.push(`Error al asignar a ${member.data.name}: ${err.message}`);
      }
    }

    result.success = result.assigned > 0;
    return result;

  } catch (err: any) {
    result.errors.push(`Error en asignación: ${err.message}`);
    return result;
  }
}

/**
 * Sincroniza y asigna en un solo paso
 */
export async function syncAndAssign(): Promise<{
  sync: SyncResult;
  assign: SyncResult;
}> {
  const syncResult = await syncPredictionsToFirebase();
  const assignResult = await assignPredictionsToMembers();

  return {
    sync: syncResult,
    assign: assignResult
  };
}




