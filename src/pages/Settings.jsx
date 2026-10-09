import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';
import PageHeader from '../components/PageHeader';
import ReadingSettings from '../components/ReadingSettings';

const Settings = () => {
    const { version, isOnline, checking, checkForUpdates, status } = useTorah();

    return (
        <div className="pb-28">
            <PageHeader title="Ajustes" />
            <main className="mx-auto max-w-2xl space-y-8 px-4 pt-6">
                <section>
                    <h2 className="mb-4 font-serif text-xl font-semibold">Lectura</h2>
                    <ReadingSettings showPreview />
                </section>

                <section>
                    <h2 className="mb-4 font-serif text-xl font-semibold">Texto descargado</h2>
                    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-muted">Versión del texto</span>
                            <span className="font-semibold tabular-nums">{version ?? '—'}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-muted">Conexión</span>
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                                {isOnline ? (
                                    <><Wifi size={16} className="text-brand" aria-hidden="true" /> En línea</>
                                ) : (
                                    <><WifiOff size={16} className="text-muted" aria-hidden="true" /> Sin conexión</>
                                )}
                            </span>
                        </div>
                        <div className="px-4 py-3.5">
                            <p className="text-sm text-muted">
                                {status === 'ready'
                                    ? 'Las Escrituras están guardadas en este dispositivo y se pueden leer sin conexión. Las correcciones se descargan solas al abrir la app.'
                                    : 'El texto todavía no está guardado en este dispositivo.'}
                            </p>
                            <button
                                type="button"
                                onClick={checkForUpdates}
                                disabled={!isOnline || checking}
                                className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={checking ? 'animate-spin' : ''} aria-hidden="true" />
                                {checking ? 'Buscando…' : 'Buscar actualizaciones'}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Settings;
