import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Panel inferior modal (en pantallas grandes, centrado).
const Sheet = ({ open, onClose, title, children }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const previous = document.activeElement;
        panelRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <button type="button" aria-label="Cerrar" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/40" />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-page p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl outline-none sm:rounded-3xl"
            >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-serif text-lg font-semibold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Sheet;
