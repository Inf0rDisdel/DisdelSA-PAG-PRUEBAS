// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login/LoginPage';
import MyBusinessPage from '../pages/my-business/MyBusinessPage';
import StoreBradge from 'components/layouts/Header/StoreBadge'; // Tienda Disdel
import CartPage from 'pages/cart/CartPages'; 
import ProductDetailPage from 'pages/ProductDetailPage';
import CategoryDetail from '../pages/CategoryDetail/CategoryDetail';

import CategoryPage from '../pages/CategoryPage'; 
import DepartmentPage from '../pages/DepartmentPage';
import BrandPage from '../pages/BrandPage/BrandPage';

import AboutUs from 'pages/info/AboutUs';
import Ayuda from 'pages/info/Ayuda';
import Locations from 'pages/info/Locations';

import NewsletterSignup from 'components/home/InfoSection/NewsLetterSignup';
import PrivacyPolicy from 'pages/info/PrivacyPolicy';
import ReviewStats from 'components/reviews/ReviewStats';
import ReviewsSection from 'components/reviews/ReviewsSection';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      
      {/* Estas son las que se encargan de las secciones de "Categorías Destacadas" */}
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/departamento/:slug" element={<DepartmentPage />} />
      <Route path="/seccion/:categorySlug" element={<CategoryDetail />} />
      <Route path="/marca/:slug" element={<BrandPage />} />

      <Route path="/carrito" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="/sede-central" element={<StoreBradge/>} />

      <Route path="politicas-de-privacidad" element={<PrivacyPolicy /> } />
      <Route path="opiniones" element={<ReviewsSection/>} />


      <Route path="/quienes-somos" element={<AboutUs/>} />
      <Route path="/ayuda" element={<Ayuda/>} />
      <Route path="/ubicaciones" element={<Locations/>} />

      <Route path="*" element={<h1>Página no encontrada (404)</h1>} />
    </Routes>
  );
};

export default AppRouter;