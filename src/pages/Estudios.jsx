import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap, RefreshCw, WifiOff } from 'lucide-react';
import { useEstudios } from '../data/EstudiosProvider';
import { useTorah } from '../data/TorahProvider';
import PageHeader from '../components/PageHeader';

const Estudios = () => {
    const { estudios, loading, error, sync, syncing, imagenUrl, refresh } = useEstudios();
    const { isOnline } = useTorah();

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <div className="pb-28">
            <PageHeader title="Estudios" subtitle={estudios?.length ? `${estudios.length} ${estudios.length === 1 ? 'estudio' : 'estudios'}` : undefined} />
            <main className="mx-auto max-w-2xl px-4 pt-5">
                {loading && (
                    <div className="space-y-3" aria-busy="true">
                        {[0, 1].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-surface-2" />)}
                    </div>
                )}

                {!loading && estudios.length === 0 && (
                    <div className="mt-6 flex flex-col items-center rounded-3xl border-2 border-dashed border-line px-6 py-14 text-center">
                        <GraduationCap size={36} className="text-gold" aria-hidden="true" />
                        <h1 className="mt-3 font-serif text-xl font-semibold">Pronto habrá estudios aquí</h1>
                        <p className="mt-1 max-w-xs text-sm text-muted">
                            {!isOnline
                                ? 'Conéctate a internet para descargar los estudios. Después podrás leerlos sin conexión.'
                                : error
                                  ? 'No se pudieron cargar los estudios. Intenta de nuevo en unos momentos.'
                                  : 'Los estudios bíblicos del ministerio aparecerán en esta sección.'}
                        </p>
                        {(error || !isOnline) && (
                            <button
                                type="button"
                                onClick={sync}
                                disabled={!isOnline || syncing}
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand disabled:opacity-50"
                            >
                                {isOnline ? <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} aria-hidden="true" /> : <WifiOff size={16} aria-hidden="true" />}
                                Intentar de nuevo
                            </button>
                        )}
                    </div>
                )}

                {!loading && estudios.length > 0 && (
                    <ul className="space-y-4">
                        {estudios.map((e) => {
                            const portada = imagenUrl(e.portadaImagenId);
                            return (
                                <li key={e.id}>
                                    <Link
                                        to={`/estudios/${e.id}`}
                                        className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-brand active:scale-[0.99]"
                                    >
                                        {portada ? (
                                            <img src={portada} alt="" className="aspect-[2/1] w-full object-cover" />
                                        ) : (
                                            <div className="grid aspect-[3/1] w-full place-items-center bg-brand-strong text-gold-soft dark:bg-surface-2 dark:text-gold">
                                                <GraduationCap size={40} aria-hidden="true" />
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3 p-4">
                                            <div className="min-w-0 flex-1">
                                                <h2 className="font-serif text-lg font-semibold leading-snug">{e.titulo}</h2>
                                                {e.resumen && <p className="mt-1 line-clamp-2 text-sm text-muted">{e.resumen}</p>}
                                                <p className="mt-2 text-xs text-muted">
                                                    {e.secciones.length} {e.secciones.length === 1 ? 'sección' : 'secciones'}
                                                </p>
                                            </div>
                                            <ChevronRight size={20} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default Estudios;
