import { useCallback, useEffect, useState } from 'react';

const PREFS_KEY = 'biblia.preferencias';
const LAST_READ_KEY = 'biblia.ultimaLectura';

export const DEFAULT_PREFS = {
    theme: 'system', // system | light | sepia | dark
    size: 'm',       // s | m | l | xl
    font: 'serif',   // serif | sans
    layout: 'verses', // verses | paragraph
};

const THEME_COLORS = { light: '#1d4f91', sepia: '#1d4f91', dark: '#0d1320' };

const readJson = (key, fallback) => {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
};

const writeJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Sin almacenamiento (navegación privada): las preferencias duran solo esta sesión.
    }
};

const resolveTheme = (theme) =>
    theme === 'system'
        ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

export const applyPreferences = (prefs) => {
    const root = document.documentElement;
    const theme = resolveTheme(prefs.theme);
    root.dataset.theme = theme;
    root.dataset.size = prefs.size;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
};

export const loadPreferences = () => ({ ...DEFAULT_PREFS, ...readJson(PREFS_KEY, {}) });

export const usePreferences = () => {
    const [prefs, setPrefs] = useState(loadPreferences);

    useEffect(() => {
        applyPreferences(prefs);
        writeJson(PREFS_KEY, prefs);

        if (prefs.theme !== 'system' || !window.matchMedia) return undefined;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => applyPreferences(prefs);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, [prefs]);

    const update = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), []);
    return [prefs, update];
};

export const getLastRead = () => readJson(LAST_READ_KEY, null);

export const saveLastRead = (bookId, chapter) =>
    writeJson(LAST_READ_KEY, { bookId, chapter, at: Date.now() });
