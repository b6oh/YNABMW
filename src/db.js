import Dexie from 'dexie';

export const db = new Dexie('quiz');
db.version(14).stores({
    wishes: '++id, wish, time, mood, hour',
    budget: '++id, balance, savings',
    envelopes: '++id, icon, name, balance, description, transactions',
    memos: '++id, name'
});
