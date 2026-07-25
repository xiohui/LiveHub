const DB_NAME = 'LiveHubDB';
const DB_VERSION = 1;

const STORES = {
  todos: { keyPath: 'id', autoIncrement: true },
  vlogs: { keyPath: 'id', autoIncrement: true },
  workouts: { keyPath: 'id', autoIncrement: true },
  readings: { keyPath: 'id', autoIncrement: true },
  materials: { keyPath: 'id', autoIncrement: true },
  exerciseTypes: { keyPath: 'id', autoIncrement: true },
};

let dbPromise = null;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        Object.keys(STORES).forEach(name => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, STORES[name]);
          }
        });
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = e => reject(e.target.error);
    });
  }
  return dbPromise;
}

async function withStore(storeName, mode, cb) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = cb(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = e => reject(e.target.error);
  });
}

export const DB = {
  async getAll(storeName) {
    return withStore(storeName, 'readonly', store => {
      const req = store.getAll();
      return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => rej(req.error);
      });
    });
  },

  async get(storeName, id) {
    return withStore(storeName, 'readonly', store => {
      const req = store.get(id);
      return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    });
  },

  async add(storeName, data) {
    return withStore(storeName, 'readwrite', store => {
      const req = store.add(data);
      return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    });
  },

  async put(storeName, data) {
    return withStore(storeName, 'readwrite', store => {
      const req = store.put(data);
      return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    });
  },

  async delete(storeName, id) {
    return withStore(storeName, 'readwrite', store => {
      const req = store.delete(id);
      return new Promise((res, rej) => {
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
      });
    });
  },

  async getByIndex(storeName, indexName, value) {
    return withStore(storeName, 'readonly', store => {
      const req = store.index(indexName).getAll(value);
      return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => rej(req.error);
      });
    });
  },
};
