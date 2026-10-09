import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <main className="grid min-h-[70dvh] place-items-center px-6 text-center">
        <div>
            <p className="font-serif text-5xl font-semibold text-gold">404</p>
            <h1 className="mt-3 font-serif text-2xl font-semibold">No encontramos esa página</h1>
            <p className="mt-2 text-sm text-muted">Puede que el enlace esté incompleto o que el libro haya cambiado.</p>
            <Link
                to="/"
                className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:bg-brand-strong dark:hover:bg-brand"
            >
                Ir a los libros
            </Link>
        </div>
    </main>
);

export default NotFound;
