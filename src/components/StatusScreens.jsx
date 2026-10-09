import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';

const Logo = () => (
    <img
        src="/favicon/web-app-manifest-192x192.png"
        alt=""
        width={88}
        height={88}
        className="rounded-full shadow-lg shadow-brand-strong/20"
    />
);

export const LoadingScreen = () => {
    const { status, progress } = useTorah();
    const downloading = status === 'downloading';
    const percent = Math.round(progress * 100);

    return (
        <main className="grid min-h-dvh place-items-center px-6">
            <div className="flex w-full max-w-xs flex-col items-center text-center">
                <Logo />
                <h1 className="mt-6 font-serif text-2xl font-semibold text-brand-strong dark:text-ink">Biblia Menorah</h1>
                {downloading ? (
                    <>
                        <p className="mt-2 text-sm text-muted">
                            Descargando las Escrituras para leerlas sin conexión. Solo ocurre la primera vez.
                        </p>
                        <div
                            className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
                            role="progressbar"
                            aria-label="Progreso de la descarga"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={percent}
                        >
                            <div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${Math.max(percent, 4)}%` }} />
                        </div>
                        <p className="mt-2 text-xs tabular-nums text-muted">{percent}%</p>
                    </>
                ) : (
                    <p className="mt-2 text-sm text-muted" role="status">Abriendo…</p>
                )}
            </div>
        </main>
    );
};

export const ErrorScreen = () => {
    const { error, retry, isOnline, checking } = useTorah();

    return (
        <main className="grid min-h-dvh place-items-center px-6">
            <div className="flex max-w-sm flex-col items-center text-center">
                <Logo />
                <h1 className="mt-6 font-serif text-2xl font-semibold">No se pudo cargar el texto</h1>
                <p className="mt-2 text-sm text-muted">
                    {!isOnline
                        ? 'Para la primera descarga se necesita conexión a internet. Después podrás leer sin conexión.'
                        : 'Hubo un problema al descargar las Escrituras. Intenta de nuevo en unos momentos.'}
                </p>
                {!isOnline && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
                        <WifiOff size={14} aria-hidden="true" /> Sin conexión
                    </p>
                )}
                <button
                    type="button"
                    onClick={retry}
                    disabled={checking}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand shadow-sm hover:bg-brand-strong disabled:opacity-60 dark:hover:bg-brand"
                >
                    <RefreshCw size={16} className={checking ? 'animate-spin' : ''} aria-hidden="true" />
                    Intentar de nuevo
                </button>
                {error && <p className="mt-4 text-xs text-muted">Detalle: {error}</p>}
            </div>
        </main>
    );
};
