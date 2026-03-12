import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { BatchResult } from '../contexts/BatchContext';

export interface BatchDocument {
  userId: string;
  timestamp: Timestamp | ReturnType<typeof serverTimestamp>;
  fileName: string;
  totalTransactions: number;
  fraudulentCount: number;
  genuineCount: number;
  results: BatchResult['results'];
}

/**
 * Save batch analysis results to Firestore
 */
export async function saveBatchToFirestore(
  userId: string,
  batchData: BatchResult
): Promise<string> {
  try {
    const batchDoc: Omit<BatchDocument, 'id'> = {
      userId,
      timestamp: serverTimestamp(),
      fileName: batchData.fileName || 'unknown.csv',
      totalTransactions: batchData.totalTransactions,
      fraudulentCount: batchData.fraudulentCount,
      genuineCount: batchData.genuineCount,
      results: batchData.results,
    };

    const docRef = await addDoc(collection(db, 'batches'), batchDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error saving batch to Firestore:', error);
    throw new Error('Failed to save batch data to database');
  }
}

/**
 * Get all batches for a specific user
 */
export async function getUserBatches(userId: string): Promise<BatchDocument[]> {
  try {
    // Query without orderBy to avoid needing a composite index
    const q = query(
      collection(db, 'batches'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const batches = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BatchDocument[];

    // Sort by timestamp in JavaScript instead
    return batches.sort((a, b) => {
      const timeA = a.timestamp?.toMillis?.() || 0;
      const timeB = b.timestamp?.toMillis?.() || 0;
      return timeB - timeA; // Descending order (newest first)
    });
  } catch (error) {
    console.error('Error fetching user batches:', error);
    throw new Error('Failed to fetch batch history');
  }
}
