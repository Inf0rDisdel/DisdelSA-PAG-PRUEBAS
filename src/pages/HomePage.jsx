// src/pages/tienda/HomePage.js
import React from 'react';
import { Helmet } from 'react-helmet-async'; // 1. Importación de Helmet

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
      {/* 2. Configuración de SEO para la Home */}
      <Helmet>
        <title>Disdel, S.A. | Suministros de Limpieza y Mantenimiento</title>
        <meta name="description" content="Descubre nuestra amplia variedad de productos destacados, artículos de limpieza y ofertas increíbles en nuestra sección de liquidación. ¡Compra ahora!" />
        <meta name="keywords" content="e-commerce, limpieza, ofertas, productos destacados, tienda online" />
        
        {/* Esto es para que cuando compartas el link en redes sociales se vea bien */}
        <meta property="og:title" content="Nombre de tu Tienda | Inicio" />
        <meta property="og:description" content="Encuentra todo lo que buscas en un solo lugar con envíos a domicilio." />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSlider />
      <CategoryGrid />
      <FeaturedBrands />
      <BannerSlider />

      {/* --- CARRUSEL DE DESTACADOS --- */}
      {destacados && destacados.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Los más Cotizados"
            products={destacados}
            addToCart={addToCart} 
          />
        </div>
      )}

      {/* --- CARRUSEL DE LIMPIEZA --- */}
      {paratulimpieza && paratulimpieza.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Soluciónes integrales de higiene"
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