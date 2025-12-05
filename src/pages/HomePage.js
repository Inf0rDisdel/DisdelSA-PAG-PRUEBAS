// src/pages/tienda/HomePage.js
import React from 'react';

// Importación de componentes
import FeaturedBrands from 'components/home/ComercialAllies/FeaturedBrands';
import CategoryGrid from 'components/home/FeaturedCategories/CategoryGrid';
import BannerSlider from 'components/home/HeroSlider/BannerSlider';
import PromoNescafe from 'components/home/PromoNescafe/PromoNescafe';
import HeroSlider from 'components/home/HeroSlider/HeroSlider';
import NewsletterSignup from 'components/home/InfoSection/NewsLetterSignup';
import InfoSection from 'components/home/InfoSection/InfoSection'
import PromoLayout from 'components/home/PromoLayout/PromoLayout';

// Componente del carrusel
import ProductCarousel from 'components/Carousel/ProductCarousel';

// Datos de productos
import { destacados, liquidacion, paratulimpieza } from '../data/ProductsData'; 

const HomePage = ({ addToCart }) => { 
  return (
    <main>
      <HeroSlider />
      <CategoryGrid />
      <FeaturedBrands />
      <BannerSlider />

      {/* --- CARRUSEL DE DESTACADOS --- */}
      {destacados && destacados.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Destacados de temporada"
            products={destacados}
            addToCart={addToCart} 
          />
        </div>
      )}

      {/* --- CARRUSEL DE LIMPIEZA --- */}
      {paratulimpieza && paratulimpieza.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Para tu Limpieza y más"
            products={paratulimpieza}
            addToCart={addToCart} 
          />
        </div>
      )}

      <PromoNescafe />

      {/* --- CARRUSEL DE LIQUIDACIÓN --- */}
      {liquidacion && liquidacion.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Productos en Liquidación"
            products={liquidacion}
            addToCart={addToCart} 
          />
        </div>
      )}
      <PromoLayout />
      <NewsletterSignup />
      <InfoSection />
    </main>
  );
};

export default HomePage;