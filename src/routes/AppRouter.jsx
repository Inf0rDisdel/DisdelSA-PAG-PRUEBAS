import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProductDetailPage = lazy(() => import('pages/ProductDetailPage'));
const SearchResultsPage = lazy(() => import('pages/SearchResults/SearchResultsPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const BrandPage = lazy(() => import('../pages/BrandPage/BrandPage'));

const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const MyBusinessPage = lazy(() => import('../pages/my-business/MyBusinessPage'));
const CartPage = lazy(() => import('pages/cart/CartPages')); 

const AboutUs = lazy(() => import('pages/info/AboutUs'));
const Ayuda = lazy(() => import('pages/info/Ayuda'));
const Locations = lazy(() => import('pages/info/Locations'));

const PrivacyPolicy = lazy(() => import('pages/info/PrivacyPolicy'));
//import ReviewStats from 'components/reviews/ReviewStats';
//const ReviewsSection = lazy(() => import('components/reviews/ReviewsSection'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="loading-screen">Cargando...</div>}>
      <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/producto/:id/:slug?" element={<ProductDetailPage />} />
      <Route path="/categoria/:slug/:cat?/:subcat?" element={<CategoryPage />} />
      <Route path="/marca/:slug/:subcat?" element={<BrandPage />} />
        
      <Route path="/buscar" element={<SearchResultsPage />} />

      {/* 3. REDIRECCIONES DE CATEGORÍAS (SEO) */}
      {['botiquin', 'papeleria', 'ferreteria', 'pisos-y-superficies'].map(cat => (
            <Route key={cat} path={`/${cat}`} element={<Navigate to={`/categoria/${cat}`} replace />} />
        ))}

      {/* --- 🚀 RESCATE DE GOOGLE (Legacy Redirects) --- */}
      <Route path="/subcategoria/mopas-y-accesorios" element={<Navigate to="/categoria/herramientas-para-limpieza/mopa-y-mecha" replace />} />
      <Route path="/subcategoria/detergente-para-ropa" element={<Navigate to="/categoria/quimicos-para-limpieza" replace />} />
      <Route path="/subcategoria/plataformas-y-accesorios" element={<Navigate to="/categoria/papeleria" replace />} />
      
      {/* Redirecciones de contacto/info (Case insensitive fallback) */}
      <Route path="/contactanos" element={<Navigate to="/ayuda" replace />} />
      <Route path="/contacto" element={<Navigate to="/ayuda" replace />} />
      <Route path="/conocenos" element={<Navigate to="/quienes-somos" replace />} />
      <Route path="/politicas" element={<Navigate to="/politicas-de-privacidad" replace />} />
      <Route path="/limpieza" element={<Navigate to="/categoria/herramientas-para-limpieza" replace />} />
      
      {/* Rescate genérico para cualquier otra subcategoría vieja */}
       <Route path="/subcategoria/:slug" element={<LegacyRedirect />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-business" element={<MyBusinessPage />} />
        <Route path="/politicas-de-privacidad" element={<PrivacyPolicy /> } />
        <Route path="/quienes-somos" element={<AboutUs/>} />
        <Route path="/ayuda" element={<Ayuda/>} />
        <Route path="/ubicaciones" element={<Locations/>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

// Componente para manejar subcategorías que ya no existen mandándolas al buscador
const LegacyRedirect = () => {
    const { slug } = useParams();
    return <Navigate to={`/buscar?q=${slug.replace(/-/g, ' ')}`} replace />;
};

export default AppRouter;