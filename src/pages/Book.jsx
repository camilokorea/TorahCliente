import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTorah } from '../data/TorahProvider';
import { getLastRead } from '../lib/preferences';
import PageHeader from '../components/PageHeader';
import NotFound from './NotFound';

const Book = () => {
    const { id } = useParams();
    const { bookById } = useTorah();
    const book = bookById.get(id);

    if (!book) return <NotFound />;
    if (book.chapterCount === 1) {
        return <Navigate to={`/libro/${book.id}/${book.chapters[0].capituloNumero}`} replace />;
    }

    const last = getLastRead();
    const lastChapter = last?.bookId === book.id ? last.chapter : null;

    return (
        <div className="pb-28">
            <PageHeader
                title={book.name}
                subtitle={`${book.testament} · ${book.chapterCount} capítulos`}
                backTo="/"
                backLabel="Volver a los libros"
            />
            <main className="mx-auto max-w-2xl px-4 pt-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Elige un capítulo</h2>
                <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                    {book.chapters.map(({ capituloNumero }) => {
                        const isLast = capituloNumero === lastChapter;
                        return (
                            <li key={capituloNumero}>
                                <Link
                                    to={`/libro/${book.id}/${capituloNumero}`}
                                    aria-label={`Capítulo ${capituloNumero}${isLast ? ' (última lectura)' : ''}`}
                                    className={`grid aspect-square place-items-center rounded-xl border font-serif text-lg font-semibold tabular-nums transition focus-visible:outline-2 focus-visible:outline-brand active:scale-95 ${
                                        isLast
                                            ? 'border-gold bg-gold-soft text-ink'
                                            : 'border-line bg-surface text-ink hover:border-brand/40 hover:bg-brand-soft'
                                    }`}
                                >
                                    {capituloNumero}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {lastChapter && (
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                        <span className="inline-block h-3 w-3 rounded border border-gold bg-gold-soft" aria-hidden="true" />
                        Último capítulo leído
                    </p>
                )}
            </main>
        </div>
    );
};

export default Book;
