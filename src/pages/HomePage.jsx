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
  "@type": "WholesaleStore", // Cambiamos de Organization a WholesaleStore (más específico para B2B)
  "name": "Disdel, S.A.",
  "alternateName": "Disdelsa",
  "url": "https://www.disdelsa.com/",
  "logo": "https://www.disdelsa.com/logo.png",
  "description": "Distribuidor líder en Guatemala de suministros de limpieza, higiene, cafetería y mantenimiento institucional para empresas.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "15 Calle 16-30, Zona 1, Ciudad de Guatemala",
    "addressLocality": "Ciudad de Guatemala",
    "addressCountry": "GT"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+502-2422-6120",
    "contactType": "ventas y servicio al cliente",
    "areaServed": "GT",
    "availableLanguage": "Spanish"
  },
  "sameAs": [
    "https://www.facebook.com/tupagina",
    "https://www.instagram.com/tupagina",
    "https://www.linkedin.com/company/tupagina"
  ]
};

  const handleAddToCart = (product) => {
    // Definimos la unidad por defecto al agregar desde el inicio
    const defaultPresentation = product.Unidad || 'Unidad';
    const defaultType = product.Unidad ? 'Y' : 'N';

    addItem({
      ...product,
      presentationSelected: defaultPresentation,
      unitType: defaultType
    });

    toast.success(`${product.Descripcion.substring(0, 20)}... añadido al carrito`, {
      position: 'bottom-right',
      style: { background: '#135eab', color: '#fff' }
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

  return (
    <main>
      <Helmet>
        <title>Disdel, S.A. | Suministros de Limpieza y Mantenimiento</title>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      <HeroSlider />

      <CategoryGrid isLoading={isLoading}/>
      <FeaturedBrands isLoading={isLoading}/>

      <BannerSlider />

      {/* Condición ajustada: Si está cargando O tiene productos, muestra el componente */}
      {(isLoading || carruseles.cotizados.length > 0) && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Los más Cotizados"
            products={carruseles.cotizados}
            addToCart={handleAddToCart} 
            variant="carousel-cotizados"
            isLoading={isLoading} 
          />
        </div>
      )}


      {(isLoading || carruseles.higiene.length > 0) && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Soluciones integrales de higiene"
            products={carruseles.higiene}
            addToCart={handleAddToCart} 
            variant="carousel-higiene"
            isLoading={isLoading}
          />
        </div>
      )}

      <PromoNescafe />

      {(isLoading || carruseles.coffee.length > 0) && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Todo para el Coffee Break"
            products={carruseles.coffee}
            addToCart={handleAddToCart} 
            variant="carousel-coffe"
            isLoading={isLoading}
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