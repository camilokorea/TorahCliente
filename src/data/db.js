import { openDB } from 'idb';

// Mismos nombres y llaves que la versión anterior de la app, para que quien ya
// tiene la Biblia descargada no tenga que volver a bajarla.
const DB_NAME = 'torah-client-db';
const TORAH_STORE = 'torah';
const VERSION_STORE = 'version';
const TORAH_KEY = '5936a812bd0c404d8dfcd4f0fb488516';

let dbPromise = null;

const getDb = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(TORAH_STORE)) {
                    db.createObjectStore(TORAH_STORE);
                }
                if (!db.objectStoreNames.contains(VERSION_STORE)) {
                    db.createObjectStore(VERSION_STORE, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

export const readTorah = async () => {
    const db = await getDb();
    const torah = await db.get(TORAH_STORE, TORAH_KEY);
    return torah?.libros?.length ? torah : null;
};

export const readVersion = async () => {
    const db = await getDb();
    const versions = await db.getAll(VERSION_STORE);
    return versions.reduce((latest, v) => (!latest || v.version > latest.version ? v : latest), null);
};

export const saveTorah = async (torah, version) => {
    const db = await getDb();
    const tx = db.transaction([TORAH_STORE, VERSION_STORE], 'readwrite');
    tx.objectStore(TORAH_STORE).put(torah, TORAH_KEY);
    if (version) {
        tx.objectStore(VERSION_STORE).put(version);
    }
    await tx.done;
};
