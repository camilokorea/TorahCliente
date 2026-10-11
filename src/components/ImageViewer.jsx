import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

const ZOOMS = [1, 1.75, 2.5, 3.5];

/*
  Imagen en pantalla completa. En el celular, las imágenes anchas (líneas de tiempo, mapas)
  se pueden ampliar con los botones o con doble toque, y recorrer arrastrando.
*/
const ImageViewer = ({ src, alt, onClose }) => {
    const [zoom, setZoom] = useState(0);
    const closeRef = useRef(null);
    const scrollerRef = useRef(null);

    useEffect(() => {
        const previous = document.activeElement;
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 1, ZOOMS.length - 1));
            if (e.key === '-') setZoom((z) => Math.max(z - 1, 0));
        };
        document.addEventListener('keydown', onKey);
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, [onClose]);

    // Al ampliar, mantener centrada la vista.
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }, [zoom]);

    const scale = ZOOMS[zoom];

    return (
        <div role="dialog" aria-modal="true" aria-label={alt || 'Imagen'} className="fixed inset-0 z-50 flex flex-col bg-[#0b0f17]">
            <div className="flex items-center justify-between gap-2 px-3 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-2 text-white">
                <p className="line-clamp-2 flex-1 text-sm text-white/80">{alt}</p>
                <button type="button" onClick={() => setZoom((z) => Math.max(z - 1, 0))} disabled={zoom === 0} aria-label="Reducir" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30">
                    <Minus size={20} aria-hidden="true" />
                </button>
                <span className="w-12 text-center text-sm tabular-nums">{Math.round(scale * 100)}%</span>
                <button type="button" onClick={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))} disabled={zoom === ZOOMS.length - 1} aria-label="Ampliar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30">
                    <Plus size={20} aria-hidden="true" />
                </button>
                <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                    <X size={22} aria-hidden="true" />
                </button>
            </div>
            <div
                ref={scrollerRef}
                className="flex-1 overflow-auto overscroll-contain"
                onClick={(e) => e.target === e.currentTarget && zoom === 0 && onClose()}
            >
                <div className="flex min-h-full min-w-full items-center justify-center p-2" style={{ width: `${scale * 100}%` }}>
                    <img
                        src={src}
                        alt={alt}
                        onDoubleClick={() => setZoom((z) => (z + 1) % ZOOMS.length)}
                        className="h-auto w-full max-w-none select-none"
                        draggable={false}
                    />
                </div>
            </div>
            <p className="pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 text-center text-xs text-white/60">
                Usa + / − o doble toque para ampliar · arrastra para recorrer
            </p>
        </div>
    );
};

export default ImageViewer;
