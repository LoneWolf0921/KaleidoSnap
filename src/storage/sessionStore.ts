import type { SessionRecord, StorageMode } from '../types/booth';

export const DEFAULT_SESSION_TTL_MS = 1_800_000; // 30 minutes
const DB_NAME = 'kaleidosnap-db';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';
const CURRENT_KEY = 'current';

let memorySession: SessionRecord | null = null;
let fallbackReason: string | null = null;

export interface SessionLoadResult {
  status: 'none' | 'recoverable';
  session?: SessionRecord;
  storageMode: StorageMode;
  notice?: string;
}

export interface SessionSaveResult {
  storageMode: StorageMode;
  notice?: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB.'));
    request.onblocked = () => reject(new Error('IndexedDB open request was blocked.'));
  });
}

function runTransaction<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = op(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB transaction failed.'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted.'));
  });
}

function isExpired(record: SessionRecord, now = Date.now()): boolean {
  return now > record.expiresAt;
}

export async function loadCurrentSession(): Promise<SessionLoadResult> {
  const now = Date.now();
  let db: IDBDatabase | null = null;

  try {
    db = await openDatabase();
    const record = await runTransaction<SessionRecord | undefined>(db, 'readonly', (store) =>
      store.get(CURRENT_KEY)
    );

    if (!record) {
      return { status: 'none', storageMode: 'indexeddb' };
    }

    if (isExpired(record, now)) {
      await runTransaction<undefined>(db, 'readwrite', (store) => store.delete(CURRENT_KEY));
      return { status: 'none', storageMode: 'indexeddb' };
    }

    return { status: 'recoverable', session: record, storageMode: 'indexeddb' };
  } catch (err: unknown) {
    fallbackReason =
      err instanceof Error ? err.message : 'IndexedDB is unavailable or blocked.';
    if (memorySession && !isExpired(memorySession, now)) {
      return {
        status: 'recoverable',
        session: memorySession,
        storageMode: 'memory-fallback',
        notice: `Reload recovery is unavailable (${fallbackReason}). Keeping session in memory for this tab.`,
      };
    }
    memorySession = null;
    return {
      status: 'none',
      storageMode: 'memory-fallback',
      notice: `Reload recovery is unavailable (${fallbackReason}). Continuing in memory for this tab.`,
    };
  } finally {
    db?.close();
  }
}

export async function saveCurrentSession(
  session: SessionRecord,
  ttlMs: number = DEFAULT_SESSION_TTL_MS
): Promise<SessionSaveResult> {
  const now = Date.now();
  const stamped: SessionRecord = {
    ...session,
    id: 'current',
    updatedAt: now,
    expiresAt: now + ttlMs,
  };

  memorySession = stamped;
  let db: IDBDatabase | null = null;

  try {
    db = await openDatabase();
    await runTransaction(db, 'readwrite', (store) => store.put(stamped));
    fallbackReason = null;
    return { storageMode: 'indexeddb' };
  } catch (err: unknown) {
    fallbackReason =
      err instanceof Error ? err.message : 'IndexedDB write failed.';
    return {
      storageMode: 'memory-fallback',
      notice: `Reload recovery is unavailable (${fallbackReason}). Keeping session in memory for this tab.`,
    };
  } finally {
    db?.close();
  }
}

export async function clearCurrentSession(): Promise<void> {
  memorySession = null;
  let db: IDBDatabase | null = null;

  try {
    db = await openDatabase();
    await runTransaction(db, 'readwrite', (store) => store.delete(CURRENT_KEY));
  } catch {
    // In-memory fallback already cleared above.
  } finally {
    db?.close();
  }
}
