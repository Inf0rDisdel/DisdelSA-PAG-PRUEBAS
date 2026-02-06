import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { toast } from 'react-hot-toast'; // Importación necesaria
import { useProducts } from 'hooks/useProducts'; 
import { AppConfig } from 'config/AppConfig'; 

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
    "logo": "https://www.disdelsa.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+502-2422-6100",
      "contactType": "customer service"
    }
  };

  // 🔥 FUNCIÓN PARA AGREGAR CON NOTIFICACIÓN (Imagen 2)
  const handleAddToCart = (product) => {
    // Definimos la unidad por defecto al agregar desde el inicio
    const defaultPresentation = product.Unidad || 'Unidad';
    const defaultType = product.Unidad ? 'Y' : 'N';

    addItem({
      ...product,
      presentationSelected: defaultPresentation,
      unitType: defaultType
    });

    // Notificación centrada arriba como pediste
    toast.success(`Agregado: ${defaultPresentation}`, {
      position: 'top-center',
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#333',
        border: '1px solid #e0e0e0',
        fontWeight: '500'
      },
    });
  };

  const carruseles = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) {
      return { higiene: [], coffee: [], cotizados: [] };
    }
    const shuffleAndSlice = (array, count) => {
      return [...array]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map(p => ({
          id: p.IdProducto,
          name: p.Descripcion,
          image: `${AppConfig.baseImageUrl}productos/${p.Imagen}`,
          disdelId: p.IdProducto,
          ...p 
        }));
    };
    const higieneData = allProducts.filter(p => String(p.IdSegmento) === "1059");
    const coffeeData = allProducts.filter(p => String(p.IdCategoria) === "2166");
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
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      <HeroSlider />
      <CategoryGrid />
      <FeaturedBrands />
      <BannerSlider />

      {/* --- NOTA: Se cambió addItem por handleAddToCart --- */}
      {carruseles.cotizados.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Los más Cotizados"
            products={carruseles.cotizados}
            addToCart={handleAddToCart} 
          />
        </div>
      )}

      {carruseles.higiene.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Soluciones integrales de higiene"
            products={carruseles.higiene}
            addToCart={handleAddToCart} 
          />
        </div>
      )}

      <PromoNescafe />

      {carruseles.coffee.length > 0 && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Todo para el Coffee Break"
            products={carruseles.coffee}
            addToCart={handleAddToCart} 
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