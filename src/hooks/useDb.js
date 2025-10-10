import { useState } from 'react';
import { openDB } from 'idb';

const db = {
    dbInstance: null,
    DB_NAME: 'torah-client-db',
    stores:
    {
        torah:
        {
            name: 'torah'
        },
        version: {
            name: 'version'
        }
    }
};

export const useDb = () => {
    const [torah, setTorah] = useState([]);
    const [version, setVersion] = useState(false);
    const [loadingDb, setLoadingDb] = useState(false);
    const [loadingDbLibros, setLoadingDbLibros] = useState(false);
    const [loadingDbVersion, setLoadingDbVersion] = useState(false);
    const [loadingDbInsertVersion, setLoadingDbInsertVersion] = useState(false);
    const [loadingDbInsertarLibro, setLoadingDbInsertarLibro] = useState(false);
    const [errorDb, setErrorDb] = useState(null);

    const initIndexedDb = async () => {
        setErrorDb(null);
        setLoadingDb(true);

        try {
            setLoadingDb(false);

            return openDB(db.DB_NAME, 1, {
                upgrade(dbObject) {
                    if (!dbObject.objectStoreNames.contains(db.stores.torah.name)) {
                        dbObject.createObjectStore(db.stores.torah.name);
                    }

                    if (!dbObject.objectStoreNames.contains(db.stores.version.name)) {
                        dbObject.createObjectStore(db.stores.version.name, { keyPath: 'id' });
                    }
                },
            });
        }
        catch (e) {
            setErrorDb(e.message);
            setLoadingDb(false);
            return null;
        }
    };

    const initDB = async () => {
        if (!db.dbInstance) {
            db.dbInstance = await initIndexedDb();
        }
    };

    const queryTorah = async () => {
        setErrorDb(null);
        setLoadingDbLibros(true);

        try {
            await initDB();
            const tx = db.dbInstance.transaction(db.stores.torah.name, 'readonly');
            const store = tx.objectStore(db.stores.torah.name);
            let response = await store.getAll();
            setTorah(response);
            setLoadingDbLibros(false);
        }
        catch (e) {            
            setErrorDb(e.message);
            setLoadingDbLibros(false);
        }
    };

    const queryVersion = async () => {
        setErrorDb(null);
        setLoadingDbVersion(true);

        try {
            await initDB();
            const tx = db.dbInstance.transaction(db.stores.version.name, 'readonly');
            const store = tx.objectStore(db.stores.version.name);
            const dbResult = await store.getAll();
            setVersion(dbResult ? Object.values(dbResult)[Object.values(dbResult).length - 1] : null);
            setLoadingDbVersion(false);
        }
        catch (e) {
            setErrorDb(e.message);
            setLoadingDbVersion(false);
        }
    };

    const insertTorah = async (torah) => {
        setErrorDb(null);
        setLoadingDbInsertarLibro(true);

        try {
            await initDB();
            const tx = db.dbInstance.transaction(db.stores.torah.name, 'readwrite');
            const store = tx.objectStore(db.stores.torah.name);
            store.put(torah, '5936a812bd0c404d8dfcd4f0fb488516');
            await tx.done;
            setLoadingDbInsertarLibro(false);
        }
        catch (e) {
            console.log(e.message);
            setErrorDb(e.message);
            setLoadingDbInsertarLibro(false);
        }
    };

    const insertUltimaVersion = async (ultimaVersion) => {
        setErrorDb(null);
        setLoadingDbInsertVersion(true);

        try {
            await initDB();
            const tx = db.dbInstance.transaction(db.stores.version.name, 'readwrite');
            const store = tx.objectStore(db.stores.version.name);
            store.put(ultimaVersion);
            await tx.done;
            setLoadingDbInsertVersion(false);
        }
        catch (e) {
            setErrorDb(e.message);
            setLoadingDbInsertVersion(false);
        }
    };

    return {
        torah,
        setTorah,
        version,
        setVersion,
        loadingDb,
        loadingDbLibros,
        loadingDbVersion,
        loadingDbInsertVersion,
        loadingDbInsertarLibro,
        errorDb,
        queryTorah,
        queryVersion,
        insertTorah,
        insertUltimaVersion
    };
};
