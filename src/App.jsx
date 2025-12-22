// src/App.js
import React, { useState, useEffect } from 'react'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './App.css';

import AppRouter from './routes/AppRouter';
import Header from './components/layouts/Header/Header';
import Footer from './components/layouts/Footer/Footer';
import FloatingWidgets from "./components/ui/FloatingWidgets";

function App() {
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al leer del localStorage:", error);
      return [];
    }
  });

  // Guardamos en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones del carrito ---

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, amount) => {
    setCartItems(currentItems => 
      currentItems.map(item => {
        if (item.id === productId) {
          const newQuantity = (item.quantity || 1) + amount;
          return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
        }
        return item;
      })
    );
  };

  // 1. NUEVA FUNCIÓN: ELIMINAR TODO
  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculo del total
  const totalItemsInCart = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
      <div className="App">
        <Header cartItemCount={totalItemsInCart} /> 
        
        <main>
          <AppRouter 
            cartItems={cartItems} 
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            // 2. Pasamos la nueva función aquí
            clearCart={clearCart} 
          />
        </main>
        
        <FloatingWidgets />
        <Footer />
      </div>
  );
}

export default App;