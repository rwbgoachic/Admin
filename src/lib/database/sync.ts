import { PaySurityDatabase } from './schema';
import { supabase } from '../supabase';

export class SyncManager {
  private db: PaySurityDatabase;
  private syncInterval: number = 5000; // 5 seconds
  private intervalId?: number;

  constructor(db: PaySurityDatabase) {
    this.db = db;
  }

  async start() {
    // Initial sync
    await this.syncTransactions();

    // Set up periodic sync
    this.intervalId = window.setInterval(() => {
      this.syncTransactions();
    }, this.syncInterval);
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private async syncTransactions() {
    try {
      // Get unsynchronized transactions
      const tx = this.db.transaction('offline_transactions', 'readwrite');
      const store = tx.objectStore('offline_transactions');
      
      // Use cursor instead of getAll for more reliable filtering
      const index = store.index('by-sync-status');
      const unsynced: any[] = [];
      
      await new Promise((resolve, reject) => {
        const request = index.openCursor();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest).result;
          if (cursor) {
            if (cursor.value.sync_status === false) {
              unsynced.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(undefined);
          }
        };
      });

      if (unsynced.length === 0) return;

      // Sync with Supabase
      const { error } = await supabase
        .from('transactions')
        .insert(unsynced.map(t => ({
          id: t.id,
          type: t.type,
          data: t.data,
          created_at: t.created_at
        })));

      if (error) throw error;

      // Mark as synced
      await Promise.all(
        unsynced.map(transaction =>
          store.put({
            ...transaction,
            sync_status: true
          })
        )
      );

      await tx.done;
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async addTransaction(type: string, data: any) {
    const transaction = {
      id: crypto.randomUUID(),
      type,
      data,
      sync_status: false,
      created_at: new Date()
    };

    await this.db.add('offline_transactions', transaction);
    await this.syncTransactions();
  }
}