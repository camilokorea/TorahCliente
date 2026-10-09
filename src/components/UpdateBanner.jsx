import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useTorah } from '../data/TorahProvider';

// Aviso discreto cuando el texto se actualizó en segundo plano.
const UpdateBanner = () => {
    const { updatedTo, dismissUpdate } = useTorah();

    useEffect(() => {
        if (!updatedTo) return undefined;
        const timer = setTimeout(dismissUpdate, 6000);
        return () => clearTimeout(timer);
    }, [updatedTo, dismissUpdate]);

    if (!updatedTo) return null;

    return (
        <div
            role="status"
            className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
        >
            <div className="flex items-center gap-3 rounded-full bg-brand-strong py-2 pl-4 pr-2 text-sm text-white shadow-lg dark:bg-surface-2 dark:text-ink">
                <CheckCircle2 size={18} className="text-gold-soft dark:text-gold" aria-hidden="true" />
                <span>Texto actualizado (versión {updatedTo})</span>
                <button
                    type="button"
                    onClick={dismissUpdate}
                    aria-label="Cerrar aviso"
                    className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                >
                    <X size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export default UpdateBanner;
