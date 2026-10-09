import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';
import { normalize } from '../lib/torahIndex';
import PageHeader from '../components/PageHeader';

// Formato del glosario: una introducción y luego entradas "-Término: definición".
const parseGlosario = (text) => {
    const intro = [];
    const entries = [];

    for (const raw of text.split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith('-')) {
            const body = line.replace(/^-+\s*/, '');
            const colon = body.indexOf(':');
            const dot = body.indexOf('. ');
            const cut = colon > 0 && colon < 80 ? colon : dot > 0 && dot < 80 ? dot : -1;
            const term = cut > 0 ? body.slice(0, cut).trim() : body;
            const definition = cut > 0 ? body.slice(cut + 1).trim() : '';
            entries.push({ term, definition, search: normalize(`${term} ${definition}`) });
        } else if (entries.length) {
            const last = entries[entries.length - 1];
            last.definition = `${last.definition} ${line}`.trim();
            last.search = normalize(`${last.term} ${last.definition}`);
        } else {
            intro.push(line);
        }
    }

    return { intro, entries };
};

const initial = (term) => normalize(term).charAt(0).toUpperCase() || '#';

const Glosario = () => {
    const { glosario } = useTorah();
    const [query, setQuery] = useState('');
    const { intro, entries } = useMemo(() => parseGlosario(glosario), [glosario]);

    const groups = useMemo(() => {
        const q = normalize(query);
        const filtered = q ? entries.filter((e) => e.search.includes(q)) : entries;
        const map = new Map();
        for (const entry of filtered) {
            const letter = initial(entry.term);
            if (!map.has(letter)) map.set(letter, []);
            map.get(letter).push(entry);
        }
        return [...map.entries()];
    }, [entries, query]);

    // Si el contenido no sigue el formato de entradas, se muestra como texto.
    if (entries.length < 3) {
        return (
            <div className="pb-28">
                <PageHeader title="Glosario" />
                <main className="reading mx-auto max-w-[40rem] space-y-4 px-5 pt-8 font-serif">
                    {glosario.split('\n').filter((l) => l.trim()).map((l, i) => <p key={i}>{l}</p>)}
                </main>
            </div>
        );
    }

    const total = groups.reduce((n, [, list]) => n + list.length, 0);

    return (
        <div className="pb-28">
            <PageHeader title="Glosario" subtitle={`${entries.length} términos`} />
            <main className="mx-auto max-w-2xl px-4">
                {intro.length > 0 && (
                    <p className="pt-5 text-center font-serif text-sm text-muted">{intro.join(' ')}</p>
                )}

                <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 -mx-4 bg-page/95 px-4 py-3 backdrop-blur">
                    <label className="relative block">
                        <span className="sr-only">Buscar en el glosario</span>
                        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar término…"
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
                </div>

                <div aria-live="polite">
                    {total === 0 && (
                        <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
                            No hay términos que coincidan con “{query}”.
                        </p>
                    )}
                    {groups.map(([letter, list]) => (
                        <section key={letter} className="mt-3">
                            <h2 className="mb-2 font-serif text-xl font-semibold text-gold">{letter}</h2>
                            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                                {list.map((e, i) => (
                                    <div key={`${e.term}-${i}`} className="px-4 py-3.5">
                                        <dt className="font-serif text-[1.05rem] font-semibold text-ink">{e.term}</dt>
                                        {e.definition && <dd className="mt-1 text-[0.95rem] leading-relaxed text-muted">{e.definition}</dd>}
                                    </div>
                                ))}
                            </dl>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Glosario;
