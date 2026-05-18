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

import { optimizedSeoData } from 'utils/SEO/optimizedSeo';

const HomeSkeleton = () => (
  <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
    <div style={{ width: '100vh', height:'500px', background: '#eee', borderRadius:'15px'}}></div>
  </div>
);

const HomePage = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { data: allProducts, isLoading } = useProducts();

  const homeSeo = useMemo(() => optimizedSeoData['home'] || null, []);
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

    const format = (p) => ({ ...p, id: p.IdProducto, name: p.Descripcion, image: `${AppConfig.baseImageUrl}productos/${p.Imagen}` });

    const seenHigiene = new Set(); const seenCoffee = new Set(); const seenCotizados = new Set();
    const higiene = []; const coffee = []; const cotizados = [];

    allProducts.forEach(p => {
        const pid = String(p.IdProducto);
        if (String(p.IdSegmento) === AppConfig.HOME_SEGMENTS.HIGIENE && !seenHigiene.has(pid)) {
            if (higiene.length < 15) { higiene.push(format(p)); seenHigiene.add(pid); }
        }
        if (String(p.IdCategoria) === AppConfig.HOME_SEGMENTS.COFFEE_BREAK && !seenCoffee.has(pid)) {
            if (coffee.length < 15) { coffee.push(format(p)); seenCoffee.add(pid); }
        }
        if (cotizados.length < 12 && !seenCotizados.has(pid)) {
            cotizados.push(format(p)); seenCotizados.add(pid);
        }
    });

    return { cotizados, higiene, coffee };
  }, [allProducts]);

  const showSkeletons = isLoading && (!allProducts || allProducts.length === 0);

  if (showSkeletons) return <HomeSkeleton />;

  return (
    <main>
      <Helmet>
        {/* --- 🚀 SEO TÉCNICO B2B --- */}
        <title> {homeSeo?.t || "Disdel Guatemala | Lider en Suministros de Limpieza y Mantenimiento"} </title>
        <meta
        name="description"
        content={homeSeo?.d || "Disdel, S.A. líder en Guatemala en suministros de limpieza profesional, mantenimiento institucional, higiene, cafetería y productos para empresas."}
        />

        <meta name="keywords" content={homeSeo?.k || "limpieza, suministros, guatemala"} />
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