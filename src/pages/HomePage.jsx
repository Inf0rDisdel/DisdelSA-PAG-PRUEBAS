import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { toast } from 'react-hot-toast'; 
import { useProducts } from 'hooks/useProducts';
import { useBanners } from 'hooks/useBanners'; 
import { AppConfig } from 'config/AppConfig'; 
import { useCompanyData } from 'hooks/useCompanyData';
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
  <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '10px 0' }}>
    <div className="skeleton-animation" style={{ 
      maxWidth: 'var(--site-max-width)', 
      width: '95%', // 🚀 Previene desbordamiento en móviles
      height: '320px', 
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading-shimmer 1.5s infinite',
      borderRadius: '15px',
      margin: '0 auto'
    }}></div>
  </div>
);

const HomePage = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { data: allProducts, isLoading } = useProducts();
  const { data: bannerData} = useBanners();
  const { data: companyInfo } = useCompanyData();

  const homeSeo = useMemo(() => optimizedSeoData['home'] || null, []);
  const fullGraphSchema = useMemo(() => getMainGraphSchema(companyInfo), [companyInfo]);

  const cleanBaseUrl = useMemo(() => 
    AppConfig.baseImageUrl.endsWith('/') ? AppConfig.baseImageUrl : `${AppConfig.baseImageUrl}/`
  , []);

 // Título y Descripción dinámicos desde Base de Datos
  const seoTitle = useMemo(() => {

    const nombre = companyInfo?.nombreEmpresa || companyInfo?.NombreEmpresa;
  
    return homeSeo?.t || (nombre 
      ? `${nombre} | Líder en Suministros de Limpieza` 
      : "Disdel Guatemala | Líder en Suministros de Limpieza y mantenimiento"
    );
  }, [homeSeo, companyInfo]);

  const seoDesc = useMemo(() => {
    const descripcion = companyInfo?.descripcionCorta || companyInfo?.DescripcionCorta;
    return homeSeo?.d || descripcion || "Disdel, S.A. líder en Guatemala en suministros...";
  }, [homeSeo, companyInfo]);

  const firstHeroImage = useMemo(() => {
  const firstSlide = bannerData?.sliderPrincipal?.[0];
  if (!firstSlide) return '';
  
  const isMobile = window.innerWidth <= 480;
  
  // En móvil pre-cargamos la de móvil (y si no hay, la de PC)
  // En escritorio pre-cargamos la de PC (y si no hay, la de móvil)
  const imgPath = isMobile 
    ? (firstSlide.BannerImagenMovil || firstSlide.Imagen) 
    : (firstSlide.Imagen || firstSlide.BannerImagenMovil);
    
  return imgPath ? `${cleanBaseUrl}${imgPath}` : '';
}, [bannerData, cleanBaseUrl]);

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
        <title> {seoTitle} </title>
        <meta
        name="description"
        content={seoDesc}
        />

        <meta name="keywords" content={homeSeo?.k || "limpieza, suministros, guatemala"} />
        <link rel="canonical" href="https://disdelsa.com/" />

        {firstHeroImage && (
          <link rel="preload" as="image" href={firstHeroImage} fetchpriority="high" />
        )}

        {/* --- OPEN GRAPH (Facebook, WhatsApp, LinkedIn) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc}/>
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

      <h1 style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        border: '0'
        }}>
        Disdel Guatemala | Suministros de Limpieza Profesional, Higiene y Mantenimiento Institucional para Empresas
      </h1>

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