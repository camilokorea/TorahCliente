import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, Search, WifiOff, X } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';
import { getLastRead } from '../lib/preferences';
import { normalize } from '../lib/torahIndex';
import { EnvChip } from '../components/EnvBadge';

const TESTAMENT_KEY = 'biblia.testamento';

const readStoredTestament = () => {
    try {
        return localStorage.getItem(TESTAMENT_KEY);
    } catch {
        return null;
    }
};

const BookCard = ({ book }) => (
    <li>
        <Link
            to={book.chapterCount === 1 ? `/libro/${book.id}/${book.chapters[0].capituloNumero}` : `/libro/${book.id}`}
            className="flex h-full min-h-16 flex-col justify-center rounded-2xl border border-line bg-surface px-4 py-3 transition hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand active:scale-[0.98]"
        >
            <span className="font-serif text-[0.95rem] font-semibold leading-snug text-ink">{book.name}</span>
            <span className="mt-0.5 text-xs text-muted">
                {book.chapterCount === 1 ? '1 capítulo' : `${book.chapterCount} capítulos`}
            </span>
        </Link>
    </li>
);

const BookGrid = ({ books }) => (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {books.map((book) => (
            <BookCard key={book.id} book={book} />
        ))}
    </ul>
);

const ContinueReading = () => {
    const { bookById } = useTorah();
    const last = getLastRead();
    const book = last && bookById.get(last.bookId);
    if (!book || !book.chapters.some((c) => c.capituloNumero === last.chapter)) return null;

    return (
        <Link
            to={`/libro/${book.id}/${last.chapter}`}
            className="group mt-5 flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-gold-soft"
        >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-brand-strong dark:bg-gold dark:text-page">
                <BookOpenText size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium uppercase tracking-wider text-white/70">Continuar leyendo</span>
                <span className="block truncate font-serif text-lg font-semibold text-white">
                    {book.name} {last.chapter}
                </span>
            </span>
            <ArrowRight size={20} className="text-white/80 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
    );
};

const Home = () => {
    const { testaments, books, isOnline } = useTorah();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(() => {
        const stored = readStoredTestament();
        return testaments.some((t) => t.name === stored) ? stored : testaments[0]?.name;
    });

    const selectTestament = (name) => {
        setSelected(name);
        try {
            localStorage.setItem(TESTAMENT_KEY, name);
        } catch {
            // Sin almacenamiento: se recuerda solo durante la sesión.
        }
    };

    const results = useMemo(() => {
        const q = normalize(query);
        return q ? books.filter((b) => b.search.includes(q)) : null;
    }, [query, books]);

    const testament = testaments.find((t) => t.name === selected) ?? testaments[0];

    return (
        <div className="pb-28">
            <header className="bg-brand-strong pt-safe text-white dark:bg-surface">
                <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
                    <div className="flex items-center gap-3">
                        <img src="/favicon/web-app-manifest-192x192.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-white/20" />
                        <div className="min-w-0 flex-1">
                            <h1 className="font-serif text-2xl font-semibold leading-tight">Biblia Menorah<EnvChip /></h1>
                            <p className="truncate text-sm text-white/70 dark:text-muted">Ministerio Israelita Nazareno Menorah</p>
                        </div>
                        {!isOnline && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80" title="Leyendo la copia guardada en este dispositivo">
                                <WifiOff size={14} aria-hidden="true" /> Sin conexión
                            </span>
                        )}
                    </div>
                    <ContinueReading />
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-4">
                <div className="sticky top-0 z-10 -mx-4 bg-page/95 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur">
                    <label className="relative block">
                        <span className="sr-only">Buscar libro</span>
                        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar libro…"
                            className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-10 text-[0.95rem] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                aria-label="Borrar búsqueda"
                                className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        )}
                    </label>

                    {!results && (
                        <div role="tablist" aria-label="Testamento" className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
                            {testaments.map((t) => {
                                const active = t.name === testament?.name;
                                return (
                                    <button
                                        key={t.name}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => selectTestament(t.name)}
                                        className={`h-9 rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand ${active ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-ink'}`}
                                    >
                                        {t.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {results ? (
                    <section aria-live="polite" className="mt-2">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                            {results.length === 0 ? 'Sin resultados' : `${results.length} ${results.length === 1 ? 'libro' : 'libros'}`}
                        </h2>
                        {results.length > 0 ? (
                            <BookGrid books={results} />
                        ) : (
                            <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
                                No hay libros que coincidan con “{query}”.
                            </p>
                        )}
                    </section>
                ) : (
                    testament?.sections.map((section) => (
                        <section key={section.title ?? 'todos'} className="mt-4">
                            {section.title && (
                                <h2 className="mb-2.5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gold">
                                    {section.title}
                                    <span className="h-px flex-1 bg-line" aria-hidden="true" />
                                </h2>
                            )}
                            <BookGrid books={section.books} />
                        </section>
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;
