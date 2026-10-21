import React, { useCallback, useState } from 'react';
import { Download, Share, SquarePlus, X } from 'lucide-react';
import { useInstall } from '../lib/install';
import Sheet from './Sheet';

const HIDE_KEY = 'biblia.instalarOcultoHasta';
const HIDE_DAYS = 14;

const hiddenNow = () => {
    try {
        return Number(localStorage.getItem(HIDE_KEY) || 0) > Date.now();
    } catch {
        return false;
    }
};

const IOSSteps = () => (
    <ol className="space-y-4 text-[0.95rem]">
        <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold">1</span>
            <span>
                Toca el botón <strong>Compartir</strong>{' '}
                <Share size={18} className="mx-0.5 inline -translate-y-0.5 text-brand" aria-label="(ícono de compartir)" /> en la barra de Safari
                (abajo en el iPhone, arriba en el iPad).
            </span>
        </li>
        <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold">2</span>
            <span>
                Desliza y elige <strong>Agregar a pantalla de inicio</strong>{' '}
                <SquarePlus size={18} className="mx-0.5 inline -translate-y-0.5 text-brand" aria-hidden="true" />.
            </span>
        </li>
        <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold">3</span>
            <span>
                Toca <strong>Agregar</strong>. La Biblia aparecerá en tu pantalla de inicio y se abrirá como una app, también sin internet.
            </span>
        </li>
    </ol>
);

/*
  Atajo para instalar la Biblia como app.
  - variant "banner": tarjeta en el inicio; se puede ocultar por 14 días.
  - variant "row": fila en Ajustes; siempre visible mientras no esté instalada.
  No aparece cuando la app ya se abre como app instalada.
*/
const InstallApp = ({ variant = 'banner' }) => {
    const { mode, install } = useInstall();
    const [iosOpen, setIosOpen] = useState(false);
    const [hidden, setHidden] = useState(hiddenNow);
    const closeSheet = useCallback(() => setIosOpen(false), []);

    if (!mode || (variant === 'banner' && hidden)) return null;

    const onInstall = async () => {
        if (mode === 'ios') setIosOpen(true);
        else await install();
    };

    const hide = () => {
        try {
            localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DAYS * 86_400_000));
        } catch {
            // sin almacenamiento: se oculta solo en esta sesión
        }
        setHidden(true);
    };

    const sheet = (
        <Sheet open={iosOpen} onClose={closeSheet} title="Instalar en iPhone o iPad">
            <IOSSteps />
        </Sheet>
    );

    if (variant === 'row') {
        return (
            <>
                <div className="flex items-center gap-3 px-4 py-3.5">
                    <Download size={20} className="shrink-0 text-brand" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Instalar como app</p>
                        <p className="text-xs text-muted">Ábrela desde la pantalla de inicio, a pantalla completa y sin internet.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onInstall}
                        className="shrink-0 cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-strong dark:hover:bg-brand"
                    >
                        Instalar
                    </button>
                </div>
                {sheet}
            </>
        );
    }

    return (
        <>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 pl-4 ring-1 ring-white/15">
                <img src="/favicon/web-app-manifest-192x192.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Instala la Biblia en tu teléfono</p>
                    <p className="text-xs text-white/70">Ábrela como app, también sin internet.</p>
                </div>
                <button
                    type="button"
                    onClick={onInstall}
                    className="shrink-0 cursor-pointer rounded-full bg-gold-soft px-4 py-2 text-sm font-semibold text-brand-strong hover:brightness-95"
                >
                    Instalar
                </button>
                <button
                    type="button"
                    onClick={hide}
                    aria-label="Ocultar por ahora"
                    className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <X size={16} aria-hidden="true" />
                </button>
            </div>
            {sheet}
        </>
    );
};

export default InstallApp;
