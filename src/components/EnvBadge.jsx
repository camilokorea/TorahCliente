import React from 'react';

// Marca de ambientes que no son producción (VITE_ENV_LABEL, p. ej. "Pruebas"):
// franja dorada fija arriba, prefijo en el título y etiqueta en el inicio.
export const envLabel = import.meta.env.VITE_ENV_LABEL;

if (envLabel) {
    document.title = `[${envLabel}] ${document.title}`;
}

export const EnvChip = () =>
    envLabel ? (
        <span className="ml-2 inline-block rounded-full bg-gold px-2 py-0.5 align-middle font-sans text-[0.6rem] font-bold uppercase tracking-wider text-white dark:text-page">
            {envLabel}
        </span>
    ) : null;

const EnvBadge = () =>
    envLabel ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-gold" />
    ) : null;

export default EnvBadge;
