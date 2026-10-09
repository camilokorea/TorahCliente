import React, { useMemo } from 'react';
import { useTorah } from '../data/TorahProvider';
import { usePrefs } from '../lib/prefsContext';
import PageHeader from '../components/PageHeader';

// El contenido es texto plano; si la primera línea es corta se usa como título ("Presentación").
const splitContent = (text) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines[0].length <= 40) {
        return { title: lines[0], paragraphs: lines.slice(1) };
    }
    return { title: 'Dedicatoria', paragraphs: lines };
};

const Dedicatoria = () => {
    const { dedicatoria } = useTorah();
    const { prefs } = usePrefs();
    const { title, paragraphs } = useMemo(() => splitContent(dedicatoria), [dedicatoria]);

    return (
        <div className="pb-28">
            <PageHeader title="Dedicatoria" />
            <main className="mx-auto max-w-[40rem] px-5 pt-8 sm:px-8">
                <h1 className="mb-6 text-center font-serif text-3xl font-semibold">{title}</h1>
                <div className={`reading space-y-4 ${prefs.font === 'serif' ? 'font-serif' : 'font-sans'}`}>
                    {paragraphs.length ? (
                        paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))
                    ) : (
                        <p className="text-center text-muted">Todavía no hay contenido.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dedicatoria;
