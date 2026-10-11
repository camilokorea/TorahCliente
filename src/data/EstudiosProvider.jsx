import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { deleteImagen, listImagenIds, readEstudios, readImagen, saveEstudios, saveImagen } from './db';
import { fetchEstudios, fetchImagen, imagenRemotaUrl } from './api';

const EstudiosContext = createContext(null);
export const useEstudios = () => useContext(EstudiosContext);

const imagenesDe = (estudios) => {
    const ids = new Set();
    for (const e of estudios) {
        if (e.portadaImagenId) ids.add(e.portadaImagenId);
        for (const s of e.secciones) for (const b of s.bloques) if (b.imagenId) ids.add(b.imagenId);
    }
    return ids;
};

/*
  Estudios publicados guardados en el dispositivo (IndexedDB), con sus imágenes,
  para leerlos sin conexión. Al abrir la app con internet se sincronizan en segundo plano.
*/
export const EstudiosProvider = ({ children }) => {
    const [estudios, setEstudios] = useState(null);
    const [urls, setUrls] = useState({});
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);
    const urlsRef = useRef({});
    const busy = useRef(false);
    const lastSync = useRef(0);

    // URL local (objectURL) para cada imagen guardada; las que falten se piden al servidor.
    const loadUrls = useCallback(async (lista) => {
        const next = {};
        for (const id of imagenesDe(lista)) {
            if (urlsRef.current[id]) {
                next[id] = urlsRef.current[id];
                continue;
            }
            const blob = await readImagen(id).catch(() => null);
            if (blob) next[id] = URL.createObjectURL(blob);
        }
        Object.entries(urlsRef.current).forEach(([id, url]) => !next[id] && URL.revokeObjectURL(url));
        urlsRef.current = next;
        setUrls(next);
    }, []);

    const sync = useCallback(async () => {
        if (busy.current || !navigator.onLine) return;
        busy.current = true;
        lastSync.current = Date.now();
        setSyncing(true);
        try {
            const remotos = await fetchEstudios();
            await saveEstudios(remotos);
            setEstudios(remotos);
            setError(null);

            const necesarias = imagenesDe(remotos);
            const guardadas = new Set(await listImagenIds());
            for (const id of necesarias) {
                if (guardadas.has(id)) continue;
                try {
                    await saveImagen(id, await fetchImagen(id));
                } catch {
                    // Se intentará en la próxima sincronización; mientras, se ve desde el servidor.
                }
            }
            for (const id of guardadas) if (!necesarias.has(id)) await deleteImagen(id);
            await loadUrls(remotos);
        } catch (e) {
            setError(e.message);
            setEstudios((actual) => actual ?? []);
        } finally {
            busy.current = false;
            setSyncing(false);
        }
    }, [loadUrls]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const local = await readEstudios();
                if (!cancelled && local) {
                    setEstudios(local);
                    await loadUrls(local);
                }
            } catch {
                // Sin IndexedDB: solo en línea.
            }
            if (!cancelled) {
                if (navigator.onLine) sync();
                else setEstudios((e) => e ?? []);
            }
        })();
        const onOnline = () => sync();
        window.addEventListener('online', onOnline);
        // Al volver a la app (otra pestaña o en segundo plano en el teléfono) se buscan cambios.
        const onVisible = () => document.visibilityState === 'visible' && Date.now() - lastSync.current > 60_000 && sync();
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            cancelled = true;
            window.removeEventListener('online', onOnline);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [sync, loadUrls]);

    // Sincroniza si pasó más de un minuto desde la última vez (al volver a la app o abrir un estudio).
    const refresh = useCallback(() => {
        if (Date.now() - lastSync.current > 60_000) sync();
    }, [sync]);

    useEffect(() => () => Object.values(urlsRef.current).forEach((u) => URL.revokeObjectURL(u)), []);

    const imagenUrl = useCallback((id) => (id ? urls[id] ?? (navigator.onLine ? imagenRemotaUrl(id) : null) : null), [urls]);

    const value = useMemo(
        () => ({
            estudios,
            loading: estudios === null,
            syncing,
            error,
            sync,
            refresh,
            imagenUrl,
            byId: new Map((estudios ?? []).map((e) => [e.id, e])),
        }),
        [estudios, syncing, error, sync, refresh, imagenUrl]
    );

    return <EstudiosContext.Provider value={value}>{children}</EstudiosContext.Provider>;
};
