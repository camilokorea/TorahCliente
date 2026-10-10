import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useEstudios } from '../data/EstudiosProvider';
import { useTorah } from '../data/TorahProvider';
import { usePrefs } from '../lib/prefsContext';
import { parseVerses } from '../lib/verses';
import { Markdown } from '../lib/markdown';
import PageHeader from '../components/PageHeader';
import NotFound from './NotFound';

const WHOLE_CHAPTER = 999;

// Cita de versículos tomada de la Biblia guardada en el dispositivo; lleva al lector en ese versículo.
const VersesQuote = ({ refItem }) => {
    const { bookById } = useTorah();
    const book = bookById.get(refItem.libroId);
    const chapter = book?.chapters.find((c) => c.capituloNumero === refItem.capitulo);
    const verses = useMemo(
        () => (chapter ? parseVerses(chapter.versiculos).filter((v) => v.n >= refItem.desde && v.n <= refItem.hasta) : []),
        [chapter, refItem.desde, refItem.hasta]
    );

    if (!book) return null;
    const whole = refItem.desde === 1 && refItem.hasta >= WHOLE_CHAPTER;
    const last = verses.length ? verses[verses.length - 1].n : refItem.hasta;
    const label = whole
        ? `${book.name} ${refItem.capitulo}`
        : `${book.name} ${refItem.capitulo}:${refItem.desde}${last > refItem.desde ? `–${last}` : ''}`;

    return (
        <figure className="rounded-2xl border-l-4 border-gold bg-gold-soft/40 px-4 py-3.5 dark:bg-gold-soft/60">
            <figcaption className="mb-1.5">
                <Link
                    to={`/libro/${book.id}/${refItem.capitulo}#v${refItem.desde}`}
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-wider text-gold hover:underline"
                >
                    {label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                    <span className="sr-only">(abrir en la Biblia)</span>
                </Link>
            </figcaption>
            {verses.length ? (
                <blockquote>
                    {verses.map((v) => (
                        <span key={v.n}>
                            <sup className="mr-1 select-none font-sans text-[0.62em] font-semibold text-gold">{v.n}</sup>
                            {v.text}{' '}
                        </span>
                    ))}
                </blockquote>
            ) : (
                <p className="text-sm text-muted">Este pasaje no está disponible en la Biblia descargada.</p>
            )}
        </figure>
    );
};

const Estudio = () => {
    const { id } = useParams();
    const { byId, loading, imagenUrl } = useEstudios();
    const { prefs } = usePrefs();
    const estudio = byId.get(id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="mx-auto mt-20 h-64 max-w-2xl animate-pulse rounded-2xl bg-surface-2" aria-busy="true" />;
    if (!estudio) return <NotFound />;

    const fontClass = prefs.font === 'serif' ? 'font-serif' : 'font-sans';
    const portada = imagenUrl(estudio.portadaImagenId);

    return (
        <div className="pb-28">
            <PageHeader title={estudio.titulo} subtitle="Estudio bíblico" backTo="/estudios" backLabel="Volver a los estudios" />
            <main className="mx-auto max-w-[42rem] px-5 pt-6 sm:px-8">
                {portada && <img src={portada} alt="" className="mb-6 aspect-[2/1] w-full rounded-2xl object-cover" />}
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Estudio bíblico</p>
                <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight">{estudio.titulo}</h1>
                {estudio.resumen && <p className="mt-2 text-muted">{estudio.resumen}</p>}

                {estudio.secciones.length > 1 && (
                    <nav aria-label="Contenido del estudio" className="mt-6 rounded-2xl border border-line bg-surface p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Contenido</p>
                        <ol className="space-y-1.5">
                            {estudio.secciones.map((s, i) => (
                                <li key={s.id}>
                                    <a
                                        href={`#s-${s.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(`s-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="flex gap-3 text-sm hover:text-brand"
                                    >
                                        <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-gold">{i + 1}</span>
                                        {s.titulo || `Sección ${i + 1}`}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {estudio.secciones.map((s, i) => (
                    <section key={s.id} id={`s-${s.id}`} className="mt-10 scroll-mt-20">
                        {estudio.secciones.length > 1 && (
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Sección {i + 1}</p>
                        )}
                        {s.titulo && <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight">{s.titulo}</h2>}
                        <div className={`reading mt-4 space-y-5 ${fontClass}`}>
                            {s.bloques.map((b) => {
                                if (b.tipo === 'texto') return b.texto ? <Markdown key={b.id} text={b.texto} /> : null;
                                if (b.tipo === 'imagen') {
                                    const src = imagenUrl(b.imagenId);
                                    return src ? (
                                        <figure key={b.id}>
                                            <img src={src} alt={b.leyenda || ''} loading="lazy" className="w-full rounded-2xl" />
                                            {b.leyenda && <figcaption className="mt-2 text-center font-sans text-sm text-muted">{b.leyenda}</figcaption>}
                                        </figure>
                                    ) : null;
                                }
                                return (
                                    <div key={b.id} className="space-y-3">
                                        {(b.referencias ?? []).map((r, j) => <VersesQuote key={j} refItem={r} />)}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default Estudio;
