import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login/LoginPage';
import MyBusinessPage from '../pages/my-business/MyBusinessPage';
import StoreBradge from 'components/layouts/Header/StoreBadge';
import CartPage from 'pages/cart/CartPages'; 
import CategoryPage from '../pages/CategoryPage'; 
import DepartmentPage from '../pages/DepartmentPage';
import BrandPage from '../pages/tienda/BrandPage'
import OpinionesPage from 'pages/opiniones/OpinionesPage';
import ProductDetailPage from 'pages/ProductDetailPage';
import AboutUs from 'pages/info/AboutUs'; 
import Locations from 'pages/info/Locations';
import Ayuda from 'pages/info/Ayuda';

const AppRouter = ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage addToCart={addToCart} />} />
      <Route 
        path="/producto/:id" 
        element={<ProductDetailPage addToCart={addToCart} />} 
      />

      <Route path="/departamento/:slug" element={<CategoryPage />} />

      <Route 
        path="/carrito" 
        element={
          <CartPage 
            cartItems={cartItems} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity}
            clearCart={clearCart} 
          />
        } 
      />

      {/* Resto de rutas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="sede-central" element={<StoreBradge/>} />
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/departamento/:slug" element={<DepartmentPage />} />
      <Route path="/marca/:slug" element={<BrandPage />} />
      <Route path="/opiniones" element={<OpinionesPage />} />
      
      <Route path="/quienes-somos" element={<AboutUs />} />
      <Route path="/ubicaciones" element={<Locations />} />
      <Route path="/ayuda" element={<Ayuda />} />
      

      <Route path="*" element={<h1>Página no encontrada (404)</h1>} />
    </Routes>
  );
};

export default AppRouter;