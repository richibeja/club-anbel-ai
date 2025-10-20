import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Member, Prediction, Ticket, Payment, DrawResult, PredictionBatch } from '@/types';

const COLLECTIONS = {
  MEMBERS: 'members',
  PREDICTIONS: 'predictions',
  TICKETS: 'tickets',
  PAYMENTS: 'payments',
  DRAW_RESULTS: 'draw_results',
  PREDICTION_BATCHES: 'prediction_batches',
};

export class Database {
  static async createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const now = new Date().toISOString();
    
    const newMember = {
      ...member,
      created_at: now,
      updated_at: now,
    };
    
    const docRef = await addDoc(membersRef, newMember);
    return docRef.id;
  }

  static async getMemberByTelegramId(telegram_id: string): Promise<Member | null> {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const q = query(membersRef, where('telegram_id', '==', telegram_id), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Member;
  }

  static async getAllMembers(): Promise<Member[]> {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const q = query(membersRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
  }

  static async getActiveMembers(): Promise<Member[]> {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const q = query(
      membersRef,
      where('membership_status', '==', 'active'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
  }

  static async updateMember(id: string, data: Partial<Member>): Promise<void> {
    const memberRef = doc(db, COLLECTIONS.MEMBERS, id);
    await updateDoc(memberRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });
  }

  static async createPredictionBatch(
    predictions: Omit<Prediction, 'id' | 'created_at'>[],
    lottery_type: string,
    draw_date: string
  ): Promise<string> {
    const predictionsRef = collection(db, COLLECTIONS.PREDICTIONS);
    const batchRef = collection(db, COLLECTIONS.PREDICTION_BATCHES);
    
    const predictionIds: string[] = [];
    
    for (const prediction of predictions) {
      const docRef = await addDoc(predictionsRef, {
        ...prediction,
        created_at: new Date().toISOString(),
      });
      predictionIds.push(docRef.id);
    }
    
    const batch: Omit<PredictionBatch, 'id'> = {
      lottery_type,
      draw_date,
      total_predictions: predictions.length,
      assigned_count: 0,
      available_count: predictions.length,
      created_at: new Date().toISOString(),
      created_by: 'admin',
    };
    
    const batchDocRef = await addDoc(batchRef, batch);
    return batchDocRef.id;
  }

  static async getAvailablePredictions(lottery_type?: string): Promise<Prediction[]> {
    const predictionsRef = collection(db, COLLECTIONS.PREDICTIONS);
    let q = query(
      predictionsRef,
      where('status', '==', 'available'),
      orderBy('created_at', 'desc')
    );
    
    if (lottery_type) {
      q = query(
        predictionsRef,
        where('status', '==', 'available'),
        where('lottery_type', '==', lottery_type),
        orderBy('created_at', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prediction));
  }

  static async assignPredictionToMember(predictionId: string, memberId: string, memberName: string): Promise<void> {
    const predictionRef = doc(db, COLLECTIONS.PREDICTIONS, predictionId);
    await updateDoc(predictionRef, {
      assigned_to: memberId,
      assigned_member_name: memberName,
      status: 'assigned',
    });
  }

  static async getMemberPrediction(memberId: string): Promise<Prediction | null> {
    const predictionsRef = collection(db, COLLECTIONS.PREDICTIONS);
    const q = query(
      predictionsRef,
      where('assigned_to', '==', memberId),
      where('status', '==', 'assigned'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Prediction;
  }

  static async createTicket(ticket: Omit<Ticket, 'id' | 'created_at'>): Promise<string> {
    const ticketsRef = collection(db, COLLECTIONS.TICKETS);
    const docRef = await addDoc(ticketsRef, {
      ...ticket,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  }

  static async getAllTickets(): Promise<Ticket[]> {
    const ticketsRef = collection(db, COLLECTIONS.TICKETS);
    const q = query(ticketsRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
  }

  static async getMemberTickets(memberId: string): Promise<Ticket[]> {
    const ticketsRef = collection(db, COLLECTIONS.TICKETS);
    const q = query(
      ticketsRef,
      where('member_id', '==', memberId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
  }

  static async createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<string> {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
    const docRef = await addDoc(paymentsRef, {
      ...payment,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  }

  static async getPendingPayments(): Promise<Payment[]> {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
    const q = query(
      paymentsRef,
      where('status', '==', 'pending'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  }

  static async verifyPayment(paymentId: string, verifiedBy: string): Promise<void> {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
    await updateDoc(paymentRef, {
      status: 'verified',
      verified_by: verifiedBy,
      verified_date: new Date().toISOString(),
    });
  }

  static async rejectPayment(paymentId: string, reason: string): Promise<void> {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
    await updateDoc(paymentRef, {
      status: 'rejected',
      notes: reason,
    });
  }
}

export default Database;

