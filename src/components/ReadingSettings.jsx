import React from 'react';
import { usePrefs } from '../lib/prefsContext';

const SIZES = [
    { value: 's', label: 'Pequeña', sample: 'text-sm' },
    { value: 'm', label: 'Normal', sample: 'text-base' },
    { value: 'l', label: 'Grande', sample: 'text-lg' },
    { value: 'xl', label: 'Muy grande', sample: 'text-xl' },
];

const THEMES = [
    { value: 'system', label: 'Automático', swatch: 'linear-gradient(135deg, #fbf8f2 50%, #0d1320 50%)' },
    { value: 'light', label: 'Claro', swatch: '#fbf8f2' },
    { value: 'sepia', label: 'Sepia', swatch: '#f4ecd8' },
    { value: 'dark', label: 'Oscuro', swatch: '#0d1320' },
];

const FONTS = [
    { value: 'serif', label: 'Clásica', className: 'font-serif' },
    { value: 'sans', label: 'Moderna', className: 'font-sans' },
];

const LAYOUTS = [
    { value: 'verses', label: 'Un versículo por línea' },
    { value: 'paragraph', label: 'Texto corrido' },
];

const Group = ({ legend, children }) => (
    <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{legend}</legend>
        {children}
    </fieldset>
);

const optionClass = (selected) =>
    [
        'flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2 text-sm transition-colors',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
        selected ? 'border-brand bg-brand-soft font-semibold text-brand' : 'border-line bg-surface text-ink hover:bg-surface-2',
    ].join(' ');

const Choice = ({ name, value, current, onChange, children, className = '' }) => (
    <label className={`${optionClass(current === value)} ${className}`}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={current === value}
            onChange={() => onChange(value)}
            className="sr-only"
        />
        {children}
    </label>
);

const ReadingSettings = ({ showPreview = false }) => {
    const { prefs, update } = usePrefs();

    return (
        <div className="space-y-6">
            {showPreview && (
                <div className="rounded-2xl border border-line bg-surface p-4">
                    <p className={`reading ${prefs.font === 'serif' ? 'font-serif' : 'font-sans'}`}>
                        <sup className="mr-1 font-sans text-[0.65em] font-semibold text-gold">1</sup>
                        En el principio creó Elohim los cielos y la tierra.
                    </p>
                </div>
            )}

            <Group legend="Tamaño de letra">
                <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((s) => (
                        <Choice key={s.value} name="size" value={s.value} current={prefs.size} onChange={(size) => update({ size })}>
                            <span className={`font-serif ${s.sample}`} aria-hidden="true">Aa</span>
                            <span className="sr-only">{s.label}</span>
                        </Choice>
                    ))}
                </div>
            </Group>

            <Group legend="Tema">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {THEMES.map((t) => (
                        <Choice key={t.value} name="theme" value={t.value} current={prefs.theme} onChange={(theme) => update({ theme })} className="justify-start">
                            <span className="h-5 w-5 shrink-0 rounded-full border border-line" style={{ background: t.swatch }} aria-hidden="true" />
                            {t.label}
                        </Choice>
                    ))}
                </div>
            </Group>

            <Group legend="Tipo de letra">
                <div className="grid grid-cols-2 gap-2">
                    {FONTS.map((f) => (
                        <Choice key={f.value} name="font" value={f.value} current={prefs.font} onChange={(font) => update({ font })}>
                            <span className={f.className}>{f.label}</span>
                        </Choice>
                    ))}
                </div>
            </Group>

            <Group legend="Diseño del texto">
                <div className="grid grid-cols-2 gap-2">
                    {LAYOUTS.map((l) => (
                        <Choice key={l.value} name="layout" value={l.value} current={prefs.layout} onChange={(layout) => update({ layout })}>
                            {l.label}
                        </Choice>
                    ))}
                </div>
            </Group>
        </div>
    );
};

export default ReadingSettings;
