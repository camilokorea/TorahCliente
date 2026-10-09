import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Barra superior fija de las páginas internas.
const PageHeader = ({ title, subtitle, backTo, backLabel = 'Volver', actions }) => (
    <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur pt-safe">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-1 px-2">
            {backTo ? (
                <Link
                    to={backTo}
                    aria-label={backLabel}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand"
                >
                    <ChevronLeft size={24} aria-hidden="true" />
                </Link>
            ) : (
                <span className="w-3" />
            )}
            <div className="min-w-0 flex-1">
                <h1 className="truncate font-serif text-lg font-semibold leading-tight">{title}</h1>
                {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
            </div>
            {actions}
        </div>
    </header>
);

export default PageHeader;
