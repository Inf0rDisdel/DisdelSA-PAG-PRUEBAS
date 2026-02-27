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
import ReviewStats from 'components/reviews/ReviewStats';
import ReviewsSection from 'components/reviews/ReviewsSection';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/buscar" element={<SearchResultsPage />} />

       {/* Agrupamos para que el código sea legible */}
      {['botiquin', 'papeleria', 'ferreteria', 'pisos-y-superficies'].map(cat => (
        <Route key={cat} path={`/${cat}`} element={<Navigate to={`/categoria/${cat}`} replace />} />
         ))}

      <Route path="/politicas" element={<Navigate to="/politicas-de-privacidad" replace />} />

      {/* --- 🚀 RESCATE DE GOOGLE (Legacy Redirects) --- */}
      
      {/* 1. Mopas y accesorios -> Categoria Herramientas */}
      <Route path="/subcategoria/mopas-y-accesorios" element={<Navigate to="/categoria/herramientas-para-limpieza/mopa-y-mecha" replace />} />
      
      {/* 2. Detergente para ropa -> Categoria Químicos */}
      <Route path="/subcategoria/detergente-para-ropa" element={<Navigate to="/categoria/quimicos-para-limpieza" replace />} />
      
      {/* 3. Plataformas y accesorios -> Papelería */}
      <Route path="/subcategoria/plataformas-y-accesorios" element={<Navigate to="/categoria/papeleria" replace />} />
      
      {/* 4. Contactos y Conocenos */}
      <Route path="/Contactanos" element={<Navigate to="/ayuda" replace />} />
      <Route path="/Conocenos" element={<Navigate to="/quienes-somos" replace />} />
      <Route path="/limpieza" element={<Navigate to="/categoria/herramientas-para-limpieza" replace />} />

      {/* Rescate genérico para cualquier otra subcategoría vieja */}
      <Route path="/subcategoria/:slug" element={<LegacyRedirect />} />

      {/* --- RUTAS ACTUALES --- */}
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/marca/:slug" element={<BrandPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="/politicas-de-privacidad" element={<PrivacyPolicy /> } />
      <Route path="/opiniones" element={<ReviewsSection/>} />
      <Route path="/quienes-somos" element={<AboutUs/>} />
      <Route path="/ayuda" element={<Ayuda/>} />
      <Route path="/ubicaciones" element={<Locations/>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Componente para manejar subcategorías que ya no existen mandándolas al buscador
const LegacyRedirect = () => {
    const { slug } = useParams();
    return <Navigate to={`/buscar?q=${slug.replace(/-/g, ' ')}`} replace />;
};

const NotFoundPage = () => (
    <div style={{textAlign: 'center', padding: '100px 20px'}}>
        <h1 style={{fontSize: '3rem', color: '#135eab'}}>404</h1>
        <h2>¡Uy! No encontramos lo que buscabas</h2>
        <p>El producto o categoría podría haber cambiado de nombre.</p>
        <Link to="/" style={{color: '#135eab', fontWeight: 'bold'}}>Ir a la página principal</Link>
    </div>
);

export default AppRouter;