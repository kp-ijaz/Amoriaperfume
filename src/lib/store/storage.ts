import type { WebStorage } from 'redux-persist/es/types';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

function createNoopStorage(): WebStorage {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, _value) {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

const storage: WebStorage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export default storage;
