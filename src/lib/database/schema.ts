import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineTransaction {
  id: string;
  type: string;
  data: any;
  sync_status: boolean;
  created_at: Date;
}

interface PaySurityDB extends DBSchema {
  offline_transactions: {
    key: string;
    value: OfflineTransaction;
    indexes: {
      'by-type': string;
      'by-sync-status': boolean;
    };
  };
}

export type PaySurityDatabase = IDBPDatabase<PaySurityDB>;

export async function initDB(): Promise<PaySurityDatabase> {
  return openDB<PaySurityDB>('paysurity-local', 1, {
    upgrade(db) {
      const store = db.createObjectStore('offline_transactions', {
        keyPath: 'id',
      });
      store.createIndex('by-type', 'type');
      store.createIndex('by-sync-status', 'sync_status');
    },
  });
}