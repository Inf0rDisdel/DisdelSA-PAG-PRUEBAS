import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { toast } from 'react-hot-toast'; 
import { useProducts } from 'hooks/useProducts'; 
import { AppConfig } from 'config/AppConfig'; 
import { getMainGraphSchema } from 'utils/schemas/mainSchemas';

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

  const fullGraphSchema = useMemo(() => getMainGraphSchema(), []);

  const cleanBaseUrl = useMemo(() => 
    AppConfig.baseImageUrl.endsWith('/') ? AppConfig.baseImageUrl : `${AppConfig.baseImageUrl}/`
  , []);

  const handleAddToCart = (product) => {
    addItem({
      ...product,
      presentationSelected: product.Unidad || 'Unidad',
      unitType: product.Unidad ? 'Y' : 'N'
    });
    toast.success(`${product.Descripcion.substring(0, 20)}... añadido`, {
      position: 'bottom-right',
      style: { background: '#135eab', color: '#fff' }
    });
  };

  const carruseles = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) {
        return { higiene: [], coffee: [], cotizados: [] };
    }

    const format = (p) => ({
        id: p.IdProducto,
        name: p.Descripcion,
        image: `${cleanBaseUrl}productos/${p.Imagen}`,
        disdelId: p.IdProducto,
        ...p 
    });

    // EFICIENCIA: Una sola iteración para clasificar
    const higieneTemp = [];
    const coffeeTemp = [];
    const cotizadosTemp = allProducts.slice(0, 12).map(format);

    allProducts.forEach(p => {
        if (String(p.IdSegmento) === "1059") higieneTemp.push(format(p));
        if (String(p.IdCategoria) === "2166") coffeeTemp.push(format(p));
    });

    return {
        cotizados: cotizadosTemp,
        higiene: higieneTemp.length > 0 ? higieneTemp.slice(0, 15) : allProducts.slice(10, 25).map(format),
        coffee: coffeeTemp.length > 0 ? coffeeTemp.slice(0, 15) : allProducts.slice(25, 40).map(format)
    };
  }, [allProducts, cleanBaseUrl]);

  return (
    <main>
      <Helmet>
        {/* --- 🚀 SEO TÉCNICO B2B --- */}
        <title>Disdel Guatemala | Lider en Suministros de Limpieza y Mantenimiento </title>
        <meta
        name="description"
        content="Disdel, S.A. líder en Guatemala en suministros de limpieza profesional, mantenimiento institucional, higiene, cafetería y productos para empresas."
        />
        <link rel="canonical" href="https://disdelsa.com/" />

        {/* --- OPEN GRAPH (Facebook, WhatsApp, LinkedIn) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Disdel | Soluciones Integrales para Empresas en Guatemala" />
        <meta property="og:description" content="Encuentra marcas líderes como Kimberly Clark, 3M y Wiese. Cotización inmediata para suministros institucionales." />
        <meta property="og:image" content="https://disdelsa.com/og-image.jpg" />
        <meta property="og:url" content="https://disdelsa.com/" />
        <meta property="og:site_name" content="Disdel, S.A." />

        {/* --- TWITTER CARD --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Disdel Guatemala - Suministros Mayoristas" />
        <meta name="twitter:description" content="Abastecimiento técnico para empresas de limpieza y mantenimiento." />

        {/* --- SCHEMAS --- */}
        <script type="application/ld+json">{JSON.stringify(fullGraphSchema)}</script>
      </Helmet>

      <HeroSlider />

      <CategoryGrid /> 
      <FeaturedBrands />

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