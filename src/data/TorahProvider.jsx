import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readTorah, readVersion, saveTorah } from './db';
import { fetchTorah, fetchUltimaVersion } from './api';
import { buildIndex } from '../lib/torahIndex';

const TorahContext = createContext(null);

export const useTorah = () => useContext(TorahContext);

/*
  Estados:
  - 'loading'      leyendo la copia guardada en el dispositivo
  - 'downloading'  primera descarga (no hay copia local)
  - 'ready'        hay texto para leer (puede estar actualizándose en segundo plano)
  - 'error'        no hay copia local y no se pudo descargar
*/
export const TorahProvider = ({ children }) => {
    const [torah, setTorah] = useState(null);
    const [version, setVersion] = useState(null);
    const [status, setStatus] = useState('loading');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [updatedTo, setUpdatedTo] = useState(null);
    const [checking, setChecking] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const torahRef = useRef(null);
    const versionRef = useRef(null);
    const syncing = useRef(false);

    const sync = useCallback(async () => {
        if (syncing.current || !navigator.onLine) return;
        syncing.current = true;
        setChecking(true);

        const hadLocal = !!torahRef.current;
        try {
            const remote = await fetchUltimaVersion();
            const local = versionRef.current;
            if (hadLocal && local && remote.version <= local.version) return;

            if (!hadLocal) {
                setStatus('downloading');
                setProgress(0);
            }
            const fresh = await fetchTorah(hadLocal ? null : setProgress);
            await saveTorah(fresh, remote);

            torahRef.current = fresh;
            versionRef.current = remote;
            setTorah(fresh);
            setVersion(remote);
            setError(null);
            setStatus('ready');
            if (hadLocal) setUpdatedTo(remote.version);
        } catch (e) {
            // Con copia local se sigue leyendo sin molestar; sin ella se muestra el error.
            if (!hadLocal) {
                setError(e.message);
                setStatus('error');
            }
        } finally {
            syncing.current = false;
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [localTorah, localVersion] = await Promise.all([readTorah(), readVersion()]);
                if (cancelled) return;
                torahRef.current = localTorah;
                versionRef.current = localVersion;
                if (localTorah) {
                    setTorah(localTorah);
                    setVersion(localVersion);
                    setStatus('ready');
                }
            } catch {
                // IndexedDB no disponible (p. ej. navegación privada): se trabaja solo en línea.
            }

            if (cancelled) return;
            if (navigator.onLine) {
                sync();
            } else if (!torahRef.current) {
                setError('Se necesita conexión a internet para la primera descarga.');
                setStatus('error');
            }
        })();

        const goOnline = () => { setIsOnline(true); sync(); };
        const goOffline = () => setIsOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        return () => {
            cancelled = true;
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, [sync]);

    const retry = useCallback(() => {
        setError(null);
        if (!navigator.onLine) {
            setError('Sigues sin conexión. Conéctate a internet e intenta de nuevo.');
            return;
        }
        sync();
    }, [sync]);

    const dismissUpdate = useCallback(() => setUpdatedTo(null), []);

    const index = useMemo(() => (torah ? buildIndex(torah) : null), [torah]);

    const value = useMemo(() => ({
        status,
        progress,
        error,
        isOnline,
        checking,
        version: version?.version ?? null,
        updatedTo,
        dismissUpdate,
        retry,
        checkForUpdates: sync,
        ...index,
    }), [status, progress, error, isOnline, checking, version, updatedTo, dismissUpdate, retry, sync, index]);

    return <TorahContext.Provider value={value}>{children}</TorahContext.Provider>;
};
