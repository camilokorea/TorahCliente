import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, House, Type } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';
import { usePrefs } from '../lib/prefsContext';
import { saveLastRead } from '../lib/preferences';
import { parseVerses } from '../lib/verses';
import Sheet from '../components/Sheet';
import ReadingSettings from '../components/ReadingSettings';
import NotFound from './NotFound';

const SWIPE_MIN_X = 70;

// Deslizar horizontalmente cambia de capítulo (solo gestos claramente horizontales).
const useSwipe = (onLeft, onRight) => {
    const start = useRef(null);
    return {
        onTouchStart: (e) => {
            const t = e.touches[0];
            start.current = { x: t.clientX, y: t.clientY };
        },
        onTouchEnd: (e) => {
            if (!start.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.current.x;
            const dy = t.clientY - start.current.y;
            start.current = null;
            if (Math.abs(dx) < SWIPE_MIN_X || Math.abs(dx) < Math.abs(dy) * 2) return;
            if (dx < 0) onLeft();
            else onRight();
        },
    };
};

const chapterPath = (target) => target && `/libro/${target.book.id}/${target.chapter}`;

const Reader = () => {
    const { id, capitulo } = useParams();
    const chapterNumber = Number(capitulo);
    const navigate = useNavigate();
    const { bookById, nextChapter, prevChapter } = useTorah();
    const { prefs } = usePrefs();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { hash } = useLocation();
    const [highlight, setHighlight] = useState(null);
    const closeSettings = useCallback(() => setSettingsOpen(false), []);

    const book = bookById.get(id);
    const chapter = book?.chapters.find((c) => c.capituloNumero === chapterNumber);
    const verses = useMemo(() => (chapter ? parseVerses(chapter.versiculos) : []), [chapter]);

    const prev = book && chapter ? prevChapter(book.id, chapterNumber) : null;
    const next = book && chapter ? nextChapter(book.id, chapterNumber) : null;

    useEffect(() => {
        if (!book || !chapter) return;
        // "#v3" (p. ej. desde un estudio): ir a ese versículo y resaltarlo un momento.
        const target = Number(hash.match(/^#v(\d+)$/)?.[1]);
        const el = target && document.getElementById(`v${target}`);
        if (el) {
            el.scrollIntoView({ block: 'center' });
            setHighlight(target);
        } else {
            window.scrollTo(0, 0);
        }
        saveLastRead(book.id, chapterNumber);
        const baseTitle = document.title;
        document.title = `${book.name} ${chapterNumber} · ${baseTitle}`;
        return () => {
            document.title = baseTitle;
        };
    }, [book, chapter, chapterNumber, hash]);

    useEffect(() => {
        if (!highlight) return undefined;
        const timer = setTimeout(() => setHighlight(null), 2500);
        return () => clearTimeout(timer);
    }, [highlight]);

    const go = (target) => target && navigate(chapterPath(target));
    const swipe = useSwipe(() => go(next), () => go(prev));

    if (!book || !chapter) return <NotFound />;

    const backTo = book.chapterCount === 1 ? '/' : `/libro/${book.id}`;
    const fontClass = prefs.font === 'serif' ? 'font-serif' : 'font-sans';
    const position = book.chapters.findIndex((c) => c.capituloNumero === chapterNumber) + 1;

    return (
        <div className="min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom))]" {...swipe}>
            <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur pt-safe">
                <div className="mx-auto flex h-14 max-w-2xl items-center gap-1 px-2">
                    <Link
                        to={backTo}
                        aria-label={book.chapterCount === 1 ? 'Volver a los libros' : `Capítulos de ${book.name}`}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand"
                    >
                        <ChevronLeft size={24} aria-hidden="true" />
                    </Link>
                    {book.chapterCount > 1 && (
                        <Link
                            to="/"
                            aria-label="Inicio"
                            title="Inicio"
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand"
                        >
                            <House size={20} aria-hidden="true" />
                        </Link>
                    )}
                    <Link
                        to={backTo}
                        className="min-w-0 flex-1 truncate rounded-lg px-1 text-center font-serif text-base font-semibold hover:text-brand"
                    >
                        {book.name} {chapterNumber}
                    </Link>
                    {/* Mantiene el título centrado cuando a la izquierda hay dos botones. */}
                    {book.chapterCount > 1 && <span className="w-11 shrink-0" aria-hidden="true" />}
                    <button
                        type="button"
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Ajustes de lectura"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand"
                    >
                        <Type size={20} aria-hidden="true" />
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[40rem] px-5 pt-8 sm:px-8">
                <div className="mb-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                        {book.chapterCount === 1 ? book.testament : book.name}
                    </p>
                    <h1 className={`mt-1 text-4xl font-semibold text-ink ${fontClass}`}>
                        {book.chapterCount === 1 ? book.name : `Capítulo ${chapterNumber}`}
                    </h1>
                </div>

                <article className={`reading text-ink ${fontClass}`} lang="es">
                    {prefs.layout === 'paragraph' ? (
                        <p>
                            {verses.map((v) => (
                                <span key={v.n} id={`v${v.n}`} className={`transition-colors duration-700 ${highlight === v.n ? 'rounded bg-gold-soft' : ''}`}>
                                    <sup className="mx-0.5 select-none font-sans text-[0.62em] font-semibold text-gold">{v.n}</sup>
                                    {v.text}{' '}
                                </span>
                            ))}
                        </p>
                    ) : (
                        verses.map((v) => (
                            <p
                                key={v.n}
                                id={`v${v.n}`}
                                className={`-mx-2 mb-3.5 rounded-lg px-2 transition-colors duration-700 ${highlight === v.n ? 'bg-gold-soft' : ''}`}
                            >
                                <sup className="mr-1.5 select-none font-sans text-[0.62em] font-semibold text-gold">{v.n}</sup>
                                {v.text}
                            </p>
                        ))
                    )}
                </article>

                {next && (
                    <Link
                        to={chapterPath(next)}
                        className="mt-10 flex items-center justify-between rounded-2xl border border-line bg-surface px-5 py-4 transition hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
                    >
                        <span>
                            <span className="block text-xs font-medium uppercase tracking-wider text-muted">Siguiente</span>
                            <span className="font-serif text-lg font-semibold">{next.book.name} {next.chapter}</span>
                        </span>
                        <ChevronRight size={22} className="text-brand" aria-hidden="true" />
                    </Link>
                )}
            </main>

            <nav
                aria-label="Navegación de capítulos"
                className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur pb-safe"
            >
                <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-3">
                    <button
                        type="button"
                        onClick={() => go(prev)}
                        disabled={!prev}
                        aria-label={prev ? `Anterior: ${prev.book.name} ${prev.chapter}` : 'No hay capítulo anterior'}
                        className="flex h-11 min-w-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-30"
                    >
                        <ChevronLeft size={20} aria-hidden="true" />
                        <span className="hidden sm:inline">Anterior</span>
                    </button>
                    <Link
                        to={backTo}
                        className="rounded-full px-4 py-2 text-sm tabular-nums text-muted hover:bg-surface-2 hover:text-ink"
                    >
                        {book.chapterCount === 1 ? book.abbreviation : `${position} de ${book.chapterCount}`}
                    </Link>
                    <button
                        type="button"
                        onClick={() => go(next)}
                        disabled={!next}
                        aria-label={next ? `Siguiente: ${next.book.name} ${next.chapter}` : 'No hay capítulo siguiente'}
                        className="flex h-11 min-w-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-30"
                    >
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>
                </div>
            </nav>

            <Sheet open={settingsOpen} onClose={closeSettings} title="Ajustes de lectura">
                <ReadingSettings />
            </Sheet>
        </div>
    );
};

export default Reader;
