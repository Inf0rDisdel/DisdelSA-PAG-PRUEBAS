// src/routes/AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Tus páginas
import HomePage from '../pages/HomePage';
import EresEmpresaPage from '../pages/EresEmpresa/EresEmpresa';
import LoginPage from '../pages/login/LoginPage';
import MyBusinessPage from '../pages/my-business/MyBusinessPage';
import RecogeEnTiendaPage from '../pages/tienda/RecogeEnTienda';
import CartPage from 'pages/cart/CartPages'; 
import CategoryPage from '../pages/CategoryPage'; 
import DepartmentPage from '../pages/DepartmentPage';
import BrandPage from '../pages/BrandPage'
import OpinionesPage from 'pages/Opiniones';
import ProductDetailPage from 'pages/ProductDetailPage'; // <--- Tu import está aquí, excelente.

const AppRouter = ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage addToCart={addToCart} />} />
      
      {/* 
          1. AQUÍ AGREGAMOS LA NUEVA RUTA 
          Le pasamos 'addToCart' para que el botón de "Agregar" dentro del detalle funcione.
      */}
      <Route 
        path="/producto/:id" 
        element={<ProductDetailPage addToCart={addToCart} />} 
      />

      {/* Ruta del Carrito */}
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
      <Route path="/eres-empresa" element={<EresEmpresaPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-business" element={<MyBusinessPage />} />
      <Route path="/recoge-en-tienda" element={<RecogeEnTiendaPage />} />
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/departamento/:slug" element={<DepartmentPage />} />
      <Route path="/marca/:slug" element={<BrandPage />} />
      <Route path="/opiniones" element={<OpinionesPage />} />
      
      <Route path="*" element={<h1>Página no encontrada (404)</h1>} />
    </Routes>
  );
};

export default AppRouter;