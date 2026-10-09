import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookA, BookOpen, ScrollText, Settings } from 'lucide-react';

const ITEMS = [
    { to: '/', label: 'Biblia', Icon: BookOpen, isActive: (p) => p === '/' || p.startsWith('/libro') },
    { to: '/dedicatoria', label: 'Dedicatoria', Icon: ScrollText },
    { to: '/glosario', label: 'Glosario', Icon: BookA },
    { to: '/ajustes', label: 'Ajustes', Icon: Settings },
];

const BottomNav = () => {
    const { pathname } = useLocation();

    return (
        <nav aria-label="Secciones" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur pb-safe">
            <ul className="mx-auto flex max-w-2xl">
                {ITEMS.map(({ to, label, Icon, isActive }) => {
                    const active = isActive ? isActive(pathname) : pathname === to;
                    return (
                        <li key={to} className="flex-1">
                            <Link
                                to={to}
                                aria-current={active ? 'page' : undefined}
                                className={`flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand ${active ? 'text-brand' : 'text-muted hover:text-ink'}`}
                            >
                                <span className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${active ? 'bg-brand-soft' : ''}`}>
                                    <Icon size={20} strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
                                </span>
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BottomNav;
