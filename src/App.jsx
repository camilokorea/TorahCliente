import React, { useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TorahProvider, useTorah } from './data/TorahProvider';
import { usePreferences } from './lib/preferences';
import { PrefsContext } from './lib/prefsContext';
import BottomNav from './components/BottomNav';
import { LoadingScreen, ErrorScreen } from './components/StatusScreens';
import UpdateBanner from './components/UpdateBanner';
import EnvBadge from './components/EnvBadge';
import Home from './pages/Home';
import Book from './pages/Book';
import Reader from './pages/Reader';
import Dedicatoria from './pages/Dedicatoria';
import Glosario from './pages/Glosario';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const Content = () => {
    const { status } = useTorah();
    const location = useLocation();
    const inReader = /^\/libro\/[^/]+\/\d+/.test(location.pathname);
    const needsText = location.pathname !== '/ajustes';

    if (needsText && (status === 'loading' || status === 'downloading')) return <LoadingScreen />;
    if (needsText && status === 'error') return <ErrorScreen />;

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/libro/:id" element={<Book />} />
                <Route path="/libro/:id/:capitulo" element={<Reader />} />
                <Route path="/dedicatoria" element={<Dedicatoria />} />
                <Route path="/glosario" element={<Glosario />} />
                <Route path="/ajustes" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <UpdateBanner />
            {!inReader && <BottomNav />}
        </>
    );
};

function App() {
    const [prefs, update] = usePreferences();
    const prefsValue = useMemo(() => ({ prefs, update }), [prefs, update]);

    return (
        <PrefsContext.Provider value={prefsValue}>
            <TorahProvider>
                <div className="min-h-dvh bg-page text-ink">
                    <Content />
                    <EnvBadge />
                </div>
            </TorahProvider>
        </PrefsContext.Provider>
    );
}

export default App;
