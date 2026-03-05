// src/routes/AppRouter.jsxapprouter
import React from 'react';
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login/LoginPage';
import MyBusinessPage from '../pages/my-business/MyBusinessPage';
import CartPage from 'pages/cart/CartPages'; 
import ProductDetailPage from 'pages/ProductDetailPage';
import SearchResultsPage from 'pages/SearchResults/SearchResultsPage';

import CategoryPage from '../pages/CategoryPage'; 
import BrandPage from '../pages/BrandPage/BrandPage';

import AboutUs from 'pages/info/AboutUs';
import Ayuda from 'pages/info/Ayuda';
import Locations from 'pages/info/Locations';

import PrivacyPolicy from 'pages/info/PrivacyPolicy';
//import ReviewStats from 'components/reviews/ReviewStats';
import ReviewsSection from 'components/reviews/ReviewsSection';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/index.html" element={<Navigate to="/" replace />} />

      <Route path="/" element={<HomePage />} />

      {/* 2. RUTAS DINÁMICAS PRINCIPALES */}
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/marca/:slug" element={<BrandPage />} />
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

      {/* --- RUTAS ESTÁTICAS ACTUALES --- */}
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="/politicas-de-privacidad" element={<PrivacyPolicy /> } />
      <Route path="/opiniones" element={<ReviewsSection/>} />
      <Route path="/quienes-somos" element={<AboutUs/>} />
      <Route path="/ayuda" element={<Ayuda/>} />
      <Route path="/ubicaciones" element={<Locations/>} />

    </Routes>
  );
};

// Componente para manejar subcategorías que ya no existen mandándolas al buscador
const LegacyRedirect = () => {
    const { slug } = useParams();
    return <Navigate to={`/buscar?q=${slug.replace(/-/g, ' ')}`} replace />;
};

export default AppRouter;