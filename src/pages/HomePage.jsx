import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { useProducts } from 'hooks/useProducts'; // Tu hook de productos
import { AppConfig } from 'config/AppConfig'; // Para la ruta de imágenes

// Componentes
import FeaturedBrands from 'components/home/ComercialAllies/FeaturedBrands';
import CategoryGrid from 'components/home/FeaturedCategories/CategoryGrid';
import BannerSlider from 'components/home/HeroSlider/BannerSlider';
import PromoNescafe from 'components/home/PromoNescafe/PromoNescafe';
import HeroSlider from 'components/home/HeroSlider/HeroSlider';
import NewsletterSignup from 'components/home/InfoSection/NewsLetterSignup';
import InfoSection from 'components/home/InfoSection/InfoSection';
import PromoLayout from 'components/home/PromoLayout/PromoLayout';
import ProductCarousel from 'components/Carousel/ProductCarousel';

const HomePage = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { data: allProducts, isLoading } = useProducts();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Disdel, S.A.",
    "url": "https://www.disdelsa.com/",
    "logo": "https://www.disdelsa.com/logo.png", // Pon la URL real de tu logo
    "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+502-2422-6100",
    "contactType": "customer service"
  }
};

  // --- LÓGICA DE FILTRADO Y ALEATORIZACIÓN ---
  const carruseles = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) {
      return { higiene: [], coffee: [], cotizados: [] };
    }

    // Función auxiliar para desordenar array y tomar N elementos
    const shuffleAndSlice = (array, count) => {
      return [...array]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map(p => ({
          id: p.IdProducto,
          name: p.Descripcion,
          image: `${AppConfig.baseImageUrl}productos/${p.Imagen}`,
          disdelId: p.IdProducto,
          ...p // Mantenemos el resto por si el componente lo usa
        }));
    };

    // 1. Soluciones Higiene (IdSegmento: 1059) - 15 productos
    const higieneData = allProducts.filter(p => String(p.IdSegmento) === "1059");
    
    // 2. Coffee Break (IdCategoria: 2166) - 15 productos
    const coffeeData = allProducts.filter(p => String(p.IdCategoria) === "2166");
    
    // 3. Los más cotizados (Cualquiera del catálogo) - 10 productos
    const cotizadosData = [...allProducts];

    return {
      higiene: shuffleAndSlice(higieneData, 15),
      coffee: shuffleAndSlice(coffeeData, 15),
      cotizados: shuffleAndSlice(cotizadosData, 10)
    };
  }, [allProducts]);

  if (isLoading) {
    return <div style={{padding: '100px', textAlign: 'center'}}>Cargando ofertas...</div>;
  }

  return (
    <main>
      <Helmet>
        <title>Disdel, S.A. | Suministros de Limpieza y Mantenimiento</title>
        {/* 🔥 AGREGAR ESTA LÍNEA QUE FALTABA */}
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
      </Helmet>

      <HeroSlider />
      <CategoryGrid />
      <FeaturedBrands />
      <BannerSlider />

      {/* --- CARRUSEL DE COTIZADOS (RANDOM 10) --- */}
      {carruseles.cotizados.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Los más Cotizados"
            products={carruseles.cotizados}
            addToCart={addItem}
          />
        </div>
      )}

      {/* --- CARRUSEL DE HIGIENE (SEGMENTO 1059 - RANDOM 15) --- */}
      {carruseles.higiene.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Soluciones integrales de higiene"
            products={carruseles.higiene}
            addToCart={addItem} 
          />
        </div>
      )}

      <PromoNescafe />

      {/* --- CARRUSEL DE COFFEE BREAK (CATEGORIA 2166 - RANDOM 15) --- */}
      {carruseles.coffee.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Todo para el Coffee Break"
            products={carruseles.coffee}
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