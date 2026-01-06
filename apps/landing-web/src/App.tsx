import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Privacy } from './pages/legal/Privacy';
import { Terms } from './pages/legal/Terms';
import { NotFound } from './pages/NotFound';

const Home = lazy(() => import('./pages/Home'));

function App() {
    return (
        <HelmetProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-white" />}>
                                <Home />
                            </Suspense>
                        }
                    />
                    <Route path="/legal/privacy" element={<Privacy />} />
                    <Route path="/legal/terms" element={<Terms />} />

                    {/* Auth Redirects - SEO Friendly */}
                    <Route path="/auth/login" element={<AuthRedirect />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

const AuthRedirect = () => {
    window.location.href = 'https://app.activamusicoterapia.com';
    return null;
};

export default App;
