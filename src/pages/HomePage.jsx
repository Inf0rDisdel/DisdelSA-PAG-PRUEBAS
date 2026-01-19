import React from 'react';
import { Helmet } from 'react-helmet-async'; 
import useCartStore from 'store/useCartStore'; // 1. Importamos el store

// Importaciones de componentes
import FeaturedBrands from 'components/home/ComercialAllies/FeaturedBrands';
import CategoryGrid from 'components/home/FeaturedCategories/CategoryGrid';
import BannerSlider from 'components/home/HeroSlider/BannerSlider';
import PromoNescafe from 'components/home/PromoNescafe/PromoNescafe';
import HeroSlider from 'components/home/HeroSlider/HeroSlider';
import NewsletterSignup from 'components/home/InfoSection/NewsLetterSignup';
import InfoSection from 'components/home/InfoSection/InfoSection';
import PromoLayout from 'components/home/PromoLayout/PromoLayout';
import ProductCarousel from 'components/Carousel/ProductCarousel';
import { destacados, liquidacion, paratulimpieza } from '../data/ProductsData'; 

const HomePage = () => { 
  // 2. Traemos la función addItem de Zustand
  const addItem = useCartStore((state) => state.addItem);

  return (
    <main>
      <Helmet>
        <title>Disdel, S.A. | Suministros de Limpieza y Mantenimiento</title>
      </Helmet>

      <HeroSlider />
      <CategoryGrid />
      <FeaturedBrands />
      <BannerSlider />

      {/* --- CARRUSEL DE DESTACADOS --- */}
      {destacados?.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Los más Cotizados"
            products={destacados}
            addToCart={addItem} // Usamos la función de Zustand
          />
        </div>
      )}

      {/* --- CARRUSEL DE LIMPIEZA --- */}
      {paratulimpieza?.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Soluciónes integrales de higiene"
            products={paratulimpieza}
            addToCart={addItem} 
          />
        </div>
      )}

      <PromoNescafe />

      {/* --- CARRUSEL DE LIQUIDACIÓN --- */}
      {liquidacion?.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Todo para el Coffe Break"
            products={liquidacion}
            addToCart={addItem} 
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