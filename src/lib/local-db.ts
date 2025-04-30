import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

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
      'by-sync-status': boolean;
      'by-type': string;
    };
  };
}

const DB_NAME = 'paysurity_local';
const DB_VERSION = 1;

let db: IDBPDatabase<PaySurityDB>;

export async function initDB() {
  if (db) return db;

  db = await openDB<PaySurityDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('offline_transactions', {
        keyPath: 'id',
      });
      store.createIndex('by-sync-status', 'sync_status');
      store.createIndex('by-type', 'type');
    },
  });

  return db;
}

export async function addOfflineTransaction(
  type: string,
  data: any,
  id = crypto.randomUUID()
): Promise<string> {
  const db = await initDB();
  
  const transaction: OfflineTransaction = {
    id,
    type,
    data,
    sync_status: false,
    created_at: new Date(),
  };

  await db.add('offline_transactions', transaction);
  return id;
}

export async function getUnsyncedTransactions(): Promise<OfflineTransaction[]> {
  const db = await initDB();
  return db.getAllFromIndex('offline_transactions', 'by-sync-status', false);
}

export async function markTransactionAsSynced(id: string): Promise<void> {
  const db = await initDB();
  const tx = await db.transaction('offline_transactions', 'readwrite');
  const store = tx.objectStore('offline_transactions');
  
  const transaction = await store.get(id);
  if (transaction) {
    transaction.sync_status = true;
    await store.put(transaction);
  }
  
  await tx.done;
}

export async function getTransactionsByType(type: string): Promise<OfflineTransaction[]> {
  const db = await initDB();
  return db.getAllFromIndex('offline_transactions', 'by-type', type);
}

export async function clearSyncedTransactions(): Promise<void> {
  const db = await initDB();
  const tx = await db.transaction('offline_transactions', 'readwrite');
  const store = tx.objectStore('offline_transactions');
  const syncedTransactions = await store.index('by-sync-status').getAllKeys(true);
  
  await Promise.all(syncedTransactions.map(id => store.delete(id)));
  await tx.done;
}