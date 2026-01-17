import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Privacy } from './pages/legal/Privacy';
import { Terms } from './pages/legal/Terms';
import { NotFound } from './pages/NotFound';

const Home = lazy(() => import('./pages/Home'));
const BenefitsPost = lazy(() => import('./pages/blog/BenefitsPost').then(module => ({ default: module.BenefitsPost })));

function App() {
    return (
        <HelmetProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<div className="min-h-screen" />}>
                                <Home />
                            </Suspense>
                        }
                    />
                    <Route path="/legal/privacy" element={<Privacy />} />
                    <Route path="/legal/terms" element={<Terms />} />

                    {/* Blog Routes */}
                    <Route
                        path="/blog/beneficios-musicoterapia"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
                                <BenefitsPost />
                            </Suspense>
                        }
                    />

                    {/* Auth Redirects - SEO Friendly */}
                    <Route path="/auth/login" element={<AuthRedirect />} />
                    <Route path="/dashboard" element={<DashboardRedirect />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

const AuthRedirect = () => {
    window.location.href = 'https://app.activamusicoterapia.com/auth/login';
    return null;
};

const DashboardRedirect = () => {
    window.location.href = 'https://app.activamusicoterapia.com/dashboard';
    return null;
};

export default App;
