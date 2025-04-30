import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initDB, PaySurityDatabase } from '../lib/database/schema';
import { SyncManager } from '../lib/database/sync';

interface DatabaseContextType {
  db: PaySurityDatabase | null;
  syncManager: SyncManager | null;
  ready: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDB] = useState<PaySurityDatabase | null>(null);
  const [syncManager, setSyncManager] = useState<SyncManager | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const database = await initDB();
        const sync = new SyncManager(database);
        
        setDB(database);
        setSyncManager(sync);
        
        await sync.start();
        setReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }

    initialize();

    return () => {
      syncManager?.stop();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, syncManager, ready }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}