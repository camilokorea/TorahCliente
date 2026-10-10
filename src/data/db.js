import { openDB } from 'idb';

// Mismos nombres y llaves que la versión anterior de la app, para que quien ya
// tiene la Biblia descargada no tenga que volver a bajarla.
const DB_NAME = 'torah-client-db';
const TORAH_STORE = 'torah';
const VERSION_STORE = 'version';
const TORAH_KEY = '5936a812bd0c404d8dfcd4f0fb488516';
// Versión 2: estudios bíblicos y sus imágenes (Blob por id) para leerlos sin conexión.
const ESTUDIOS_STORE = 'estudios';
const ESTUDIOS_KEY = 'publicados';
const IMAGENES_STORE = 'imagenes';

let dbPromise = null;

const getDb = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 2, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(TORAH_STORE)) {
                    db.createObjectStore(TORAH_STORE);
                }
                if (!db.objectStoreNames.contains(VERSION_STORE)) {
                    db.createObjectStore(VERSION_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(ESTUDIOS_STORE)) {
                    db.createObjectStore(ESTUDIOS_STORE);
                }
                if (!db.objectStoreNames.contains(IMAGENES_STORE)) {
                    db.createObjectStore(IMAGENES_STORE);
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

export const readEstudios = async () => {
    const db = await getDb();
    return (await db.get(ESTUDIOS_STORE, ESTUDIOS_KEY)) ?? null;
};

export const saveEstudios = async (estudios) => {
    const db = await getDb();
    await db.put(ESTUDIOS_STORE, estudios, ESTUDIOS_KEY);
};

export const readImagen = async (id) => {
    const db = await getDb();
    return db.get(IMAGENES_STORE, id);
};

export const saveImagen = async (id, blob) => {
    const db = await getDb();
    await db.put(IMAGENES_STORE, blob, id);
};

export const listImagenIds = async () => {
    const db = await getDb();
    return db.getAllKeys(IMAGENES_STORE);
};

export const deleteImagen = async (id) => {
    const db = await getDb();
    await db.delete(IMAGENES_STORE, id);
};
