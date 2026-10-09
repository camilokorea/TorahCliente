import { createContext, useContext } from 'react';

export const PrefsContext = createContext(null);

export const usePrefs = () => useContext(PrefsContext);
