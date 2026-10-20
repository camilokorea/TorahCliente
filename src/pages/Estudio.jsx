import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Maximize2, X } from 'lucide-react';
import { useEstudios } from '../data/EstudiosProvider';
import { useTorah } from '../data/TorahProvider';
import { usePrefs } from '../lib/prefsContext';
import { parseVerses } from '../lib/verses';
import { Markdown } from '../lib/markdown';
import PageHeader from '../components/PageHeader';
import NotFound from './NotFound';
import ImageViewer from '../components/ImageViewer';

const WHOLE_CHAPTER = 999;

// Diálogo con el capítulo de la cita: los versículos citados resaltados y el resto como contexto.
// Encabezado y botón fijos; solo el texto se desplaza.
const PassageDialog = ({ book, chapter, refItem, label, onClose }) => {
    const { prefs } = usePrefs();
    const verses = useMemo(() => parseVerses(chapter.versiculos), [chapter]);
    const bodyRef = useRef(null);
    const firstRef = useRef(null);
    const closeRef = useRef(null);
    const whole = refItem.desde === 1 && refItem.hasta >= WHOLE_CHAPTER;

    useEffect(() => {
        const previous = document.activeElement;
        closeRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        // Ubicar el primer versículo citado un poco debajo del borde superior del texto.
        const body = bodyRef.current;
        const first = firstRef.current;
        if (body && first && !whole) body.scrollTop = Math.max(first.offsetTop - body.offsetTop - 24, 0);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, [onClose, whole]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <button type="button" aria-label="Cerrar" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/40" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={label}
                className="relative flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-page shadow-2xl sm:rounded-3xl"
            >
                <div className="flex items-start gap-3 border-b border-line px-5 pb-3 pt-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="font-serif text-xl font-semibold leading-tight">{label}</h2>
                        <p className="mt-0.5 font-sans text-xs text-muted">
                            {whole ? 'Capítulo completo' : `Capítulo ${refItem.capitulo} completo · lo citado está resaltado`}
                        </p>
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>
                <div ref={bodyRef} className={`reading flex-1 space-y-2 overflow-y-auto overscroll-contain px-5 py-4 ${prefs.font === 'serif' ? 'font-serif' : 'font-sans'}`}>
                    {verses.map((v) => {
                        const marked = !whole && v.n >= refItem.desde && v.n <= refItem.hasta;
                        return (
                            <p
                                key={v.n}
                                ref={v.n === refItem.desde ? firstRef : undefined}
                                className={`-mx-2 rounded-lg px-2 ${marked ? 'bg-gold-soft text-ink' : whole ? '' : 'text-muted'}`}
                            >
                                <sup className="mr-1 select-none font-sans text-[0.62em] font-semibold text-gold">{v.n}</sup>
                                {v.text}
                            </p>
                        );
                    })}
                </div>
                <div className="border-t border-line px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                    <Link
                        to={`/libro/${book.id}/${refItem.capitulo}#v${refItem.desde}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-on-brand hover:bg-brand-strong dark:hover:bg-brand"
                    >
                        <BookOpen size={16} aria-hidden="true" /> Abrir en la Biblia
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Cita de versículos tomada de la Biblia guardada en el dispositivo; al tocarla se abre en un diálogo.
const VersesQuote = ({ refItem }) => {
    const { bookById } = useTorah();
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
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
        <>
            <figure className="rounded-2xl border-l-4 border-gold bg-gold-soft/40 dark:bg-gold-soft/60">
                <button
                    type="button"
                    onClick={() => chapter && setOpen(true)}
                    disabled={!chapter}
                    aria-label={`Ver ${label} en contexto`}
                    className="block w-full cursor-pointer rounded-2xl px-4 py-3.5 text-left transition hover:bg-gold-soft/40 focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-default"
                >
                    <figcaption className="mb-1.5 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                        {label}
                        <Maximize2 size={12} aria-hidden="true" />
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
                </button>
            </figure>
            {open && <PassageDialog book={book} chapter={chapter} refItem={refItem} label={label} onClose={close} />}
        </>
    );
};

const Estudio = () => {
    const { id } = useParams();
    const { byId, loading, imagenUrl, refresh } = useEstudios();
    const { prefs } = usePrefs();
    const estudio = byId.get(id);
    const [viewing, setViewing] = useState(null); // { src, alt }

    useEffect(() => {
        window.scrollTo(0, 0);
        refresh();
    }, [id, refresh]);

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
                                            <button
                                                type="button"
                                                onClick={() => setViewing({ src, alt: b.leyenda || '' })}
                                                aria-label={`Ampliar imagen${b.leyenda ? `: ${b.leyenda}` : ''}`}
                                                className="block w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-brand"
                                            >
                                                <img src={src} alt={b.leyenda || ''} loading="lazy" className="w-full" />
                                            </button>
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
            {viewing && <ImageViewer src={viewing.src} alt={viewing.alt} onClose={() => setViewing(null)} />}
        </div>
    );
};

export default Estudio;
