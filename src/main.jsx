import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { applyPreferences, loadPreferences } from './lib/preferences';

// Aplicar tema y tamaño antes del primer render para evitar un destello de colores.
applyPreferences(loadPreferences());

// Versiones anteriores registraron un service worker; se quita hasta que la PWA vuelva (fase 3).
navigator.serviceWorker?.getRegistrations?.().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
