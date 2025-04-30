import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import {
  initDB,
  addOfflineTransaction,
  getUnsyncedTransactions,
  markTransactionAsSynced,
  clearSyncedTransactions,
} from '../lib/local-db';

class OfflineManager {
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private syncInterval: number | null = null;

  constructor() {
    this.setupNetworkListeners();
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      await initDB();
      await logger.info('Local database initialized');
    } catch (error) {
      await logger.error('Failed to initialize local database', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWithServer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Start periodic sync
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline) {
        this.syncWithServer();
      }
    }, 5 * 60 * 1000); // Sync every 5 minutes
  }

  async cacheData(key: string, data: any): Promise<void> {
    try {
      await addOfflineTransaction('cache', { key, data });
      await logger.info('Data cached successfully', { key });
    } catch (error) {
      await logger.error('Failed to cache data', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async syncWithServer(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;

    try {
      const unsyncedTransactions = await getUnsyncedTransactions();
      
      for (const transaction of unsyncedTransactions) {
        try {
          if (transaction.type === 'cache') {
            // Handle cache data sync
            const { key, data } = transaction.data;
            const { error } = await supabase
              .from('system_settings')
              .upsert({
                key,
                value: data,
                updated_at: new Date().toISOString(),
              });

            if (error) throw error;
          }

          await markTransactionAsSynced(transaction.id);
          await logger.info('Transaction synced successfully', {
            id: transaction.id,
            type: transaction.type,
          });
        } catch (error) {
          await logger.error('Failed to sync transaction', {
            id: transaction.id,
            type: transaction.type,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Clean up old synced transactions
      await clearSyncedTransactions();
    } finally {
      this.syncInProgress = false;
    }
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('online', this.setupNetworkListeners);
    window.removeEventListener('offline', this.setupNetworkListeners);
  }
}

export const offlineManager = new OfflineManager();