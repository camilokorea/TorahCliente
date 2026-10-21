import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { applyPreferences, loadPreferences } from './lib/preferences';

// Aplicar tema y tamaño antes del primer render para evitar un destello de colores.
applyPreferences(loadPreferences());

import { captureInstallPrompt } from './lib/install';

// Escuchar desde el inicio el aviso de instalación del navegador (llega una sola vez y muy temprano).
captureInstallPrompt();

// Service worker: permite instalar la app y abrirla sin conexión. Solo en el sitio publicado.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
