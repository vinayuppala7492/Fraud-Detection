import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserBatches } from '../lib/batchService';

export interface BatchTransaction {
  transactionId: string;
  time: number;
  amount: number;
  reconstructionError: number;
  structuralConfidence: number;
  threshold: number;
  isFraud: boolean;
  prediction: 'Fraudulent' | 'Genuine';
}

export interface BatchResult {
  success: boolean;
  totalTransactions: number;
  fraudulentCount: number;
  genuineCount: number;
  results: BatchTransaction[];
  uploadDate?: Date;
  fileName?: string;
}

interface BatchContextType {
  batchData: BatchResult | null;
  setBatchData: (data: BatchResult) => void;
  clearBatchData: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadUserBatches: () => Promise<void>;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batchData, setBatchDataState] = useState<BatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const setBatchData = (data: BatchResult) => {
    console.log('BatchContext: Setting batch data:', data);
    console.log('BatchContext: Results array length:', data.results?.length);
    setBatchDataState({
      ...data,
      uploadDate: new Date(),
    });
  };

  const clearBatchData = () => {
    setBatchDataState(null);
  };

  const loadUserBatches = async () => {
    if (!user?.uid) {
      console.log('No user logged in, skipping batch load');
      setBatchDataState(null);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading batches for user:', user.uid);
      
      const batches = await getUserBatches(user.uid);
      
      if (batches.length === 0) {
        console.log('No batches found for user');
        setBatchDataState(null);
        setIsLoading(false);
        return;
      }

      // Aggregate all transactions from all batches
      const allTransactions: BatchTransaction[] = [];
      let totalFraudulent = 0;
      let totalGenuine = 0;

      batches.forEach(batch => {
        if (batch.results && Array.isArray(batch.results)) {
          allTransactions.push(...batch.results);
          totalFraudulent += batch.fraudulentCount || 0;
          totalGenuine += batch.genuineCount || 0;
        }
      });

      if (allTransactions.length > 0) {
        const aggregatedData: BatchResult = {
          success: true,
          totalTransactions: allTransactions.length,
          fraudulentCount: totalFraudulent,
          genuineCount: totalGenuine,
          results: allTransactions,
          fileName: batches.length === 1 
            ? batches[0].fileName 
            : `${batches.length} batches combined`,
          uploadDate: batches[0].timestamp?.toDate ? batches[0].timestamp.toDate() : new Date(),
        };

        console.log('BatchContext: Aggregated data structure:', aggregatedData);
        console.log('BatchContext: First transaction in aggregated:', allTransactions[0]);
        setBatchDataState(aggregatedData);
        console.log('Loaded and aggregated', allTransactions.length, 'transactions from', batches.length, 'batches');
      }
    } catch (error) {
      console.error('Error loading user batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load batches when user logs in
  useEffect(() => {
    if (user) {
      loadUserBatches();
    } else {
      // Clear data when user logs out
      clearBatchData();
    }
  }, [user?.uid]);

  return (
    <BatchContext.Provider
      value={{
        batchData,
        setBatchData,
        clearBatchData,
        isLoading,
        setIsLoading,
        loadUserBatches,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
