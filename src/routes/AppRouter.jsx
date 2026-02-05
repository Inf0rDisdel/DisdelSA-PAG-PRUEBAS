// src/routes/AppRouter.jsxapprouter
import React from 'react';
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login/LoginPage';
import MyBusinessPage from '../pages/my-business/MyBusinessPage';
import StoreBradge from 'components/layouts/Header/StoreBadge'; // Tienda Disdel
import CartPage from 'pages/cart/CartPages'; 
import ProductDetailPage from 'pages/ProductDetailPage';
import CategoryDetail from '../pages/CategoryDetail/CategoryDetail';
import SearchResultsPage from 'pages/SearchResults/SearchResultsPage';

import CategoryPage from '../pages/CategoryPage'; 
import DepartmentPage from '../pages/DepartmentPage';
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
      {/* --- RUTAS PRINCIPALES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/buscar" element={<SearchResultsPage />} />

      {/* --- 🚀 RESCATE DE ENLACES VIEJOS DE GOOGLE --- */}
      {/* Corregido: se agregó la barra "/" inicial */}
      <Route path="/subcategoria/:slug" element={<LegacyRedirect />} />
      <Route path="/limpieza" element={<LegacyRedirect isLimpieza={true} />} />
      
      {/* Redirecciones directas para páginas informativas */}
      <Route path="/Contactanos" element={<Navigate to="/ubicaciones" replace />} />
      <Route path="/Conocenos" element={<Navigate to="/quienes-somos" replace />} />

      {/* --- CATEGORÍAS Y SECCIONES --- */}
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/departamento/:slug" element={<DepartmentPage />} />
      <Route path="/seccion/:categorySlug" element={<CategoryDetail />} />
      <Route path="/marca/:slug" element={<BrandPage />} />

      {/* --- CUENTA Y CARRITO --- */}
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="/sede-central" element={<StoreBradge/>} />

      {/* --- LEGAL Y OTROS --- */}
      <Route path="/politicas-de-privacidad" element={<PrivacyPolicy /> } />
      <Route path="/opiniones" element={<ReviewsSection/>} />
      <Route path="/quienes-somos" element={<AboutUs/>} />
      <Route path="/ayuda" element={<Ayuda/>} />
      <Route path="/ubicaciones" element={<Locations/>} />

      {/* --- 404 RESCATE --- */}
      <Route path="*" element={
        <div style={{textAlign: 'center', padding: '100px 20px'}}>
            <h1>Página no encontrada (404)</h1>
            <p>Lo sentimos, el enlace que seguiste podría estar roto.</p>
            <Link to="/" style={{color: '#135eab', fontWeight: 'bold'}}>Volver al inicio</Link>
        </div>
      } />
    </Routes>
  );
};

const LegacyRedirect = ({ isLimpieza = false }) => {
    const { slug } = useParams();
    
    // 1. Si el enlace es disdelsa.com/limpieza
    if (isLimpieza) {
        return <Navigate to="/categoria/herramientas-para-limpieza" replace />;
    }

    // 2. Si el enlace es disdelsa.com/subcategoria/mopas-y-accesorios
    if (slug === 'mopas-y-accesorios') {
        return <Navigate to="/categoria/mopa-y-mecha" replace />;
    }

    // 3. Para cualquier otra subcategoría que Google tenga guardada, 
    // lo mandamos al buscador para que encuentre los productos actuales.
    return <Navigate to={`/buscar?q=${slug}`} replace />;
};

export default AppRouter;