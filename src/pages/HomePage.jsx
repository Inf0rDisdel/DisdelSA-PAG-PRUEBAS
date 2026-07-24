import React, { useCallback, useMemo, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { toast } from 'react-hot-toast'; 
import { useProducts } from 'hooks/useProducts';
import { useBanners } from 'hooks/useBanners'; 
import { AppConfig } from 'config/AppConfig'; 
import { useCompanyData } from 'hooks/useCompanyData';
import { getMainGraphSchema } from 'utils/schemas/mainSchemas';
import HomeSkeleton from 'components/ui/Skeleton/HomeSkeleton';
import { optimizedSeoData } from 'utils/SEO/optimizedSeo';
import { normalizeCompanyInfo } from 'utils/companyMapper';

//CARGA INMEDIATA: Lo que el usuario ve sin hacer scroll (Arriba)
const BannerSlider = lazy(() => import('components/home/HeroSlider/BannerSlider'));
const PromoNescafe = lazy(() => import('components/home/PromoNescafe/PromoNescafe'));
const HeroSlider = lazy(() => import('components/home/HeroSlider/HeroSlider'));

//CARGA PEREZOSA : Componentes pesados que están más abajo
const ProductCarousel = lazy(() => import('components/Carousel/ProductCarousel'));
const CategoryGrid = lazy(() => import('components/home/FeaturedCategories/CategoryGrid'));
const FeaturedBrands = lazy(() => import('components/home/ComercialAllies/FeaturedBrands'));
const PromoLayout = lazy(() => import('components/home/PromoLayout/PromoLayout'));
const InfoSection = lazy(() => import('components/home/InfoSection/InfoSection'));
const NewsletterSignup = lazy(() => import('components/home/InfoSection/NewsLetterSignup'));

const HomePage = () => {
  
  const addItem = useCartStore((state) => state.addItem);
  const { data: allProducts, isLoading } = useProducts();
  const { data: bannerData} = useBanners();
  const { data: companyInfo } = useCompanyData();

  const activeCompanyInfo = useMemo(() => {
    if (!Array.isArray(companyInfo) || companyInfo.length === 0) {
      return {};
    }
    
    const rawInfo = companyInfo[0];
    const mappedInfo = normalizeCompanyInfo(rawInfo);

    // 🚀 FUSIÓN DE SEGURIDAD: Mezclamos el mapeador con el objeto bruto de la base de datos
    // Esto asegura que tengamos acceso directo a los backing fields ("<MetaTitle>k__BackingField")
    // incluso si 'normalizeCompanyInfo' no los mapeó explícitamente en el archivo de utilidades.
    return {
      ...rawInfo,
      ...mappedInfo
    };
  }, [companyInfo]);
  
  const homeSeo = useMemo(() => optimizedSeoData['home'] || null, []);
  const fullGraphSchema = useMemo(() => getMainGraphSchema(activeCompanyInfo), [activeCompanyInfo]);

  const schemaJson = useMemo(
    () => JSON.stringify(fullGraphSchema),
    [fullGraphSchema]
  );

  const cleanBaseUrl = useMemo(() => 
    AppConfig.baseImageUrl.endsWith('/') ? AppConfig.baseImageUrl : `${AppConfig.baseImageUrl}/`
  , []);

  // Título y Descripción dinámicos desde Base de Datos
  const seoTitle = useMemo(() => {
  return (
    activeCompanyInfo.metaTitle ||
    homeSeo?.t ||
    "Disdel Guatemala | Líder en Suministros de Limpieza"
    );
  }, [activeCompanyInfo, homeSeo]);

  const seoDesc = useMemo(() => {
  return (
    activeCompanyInfo.metaDescription ||
    homeSeo?.d ||
    activeCompanyInfo.descripcionCorta ||
    "Disdel, S.A. líder en Guatemala en suministros..."
    );
  }, [activeCompanyInfo, homeSeo]);

  // 🚀 NUEVA UNIFICACIÓN DE KEYWORDS Y TAGS DINÁMICOS DEL HOME (Invisibles para humanos)
  const seoKeywords = useMemo(() => {
  const base = homeSeo?.k || "limpieza, suministros, guatemala";

  const extra = [
    activeCompanyInfo.metaKeyword,
    activeCompanyInfo.metaTags,
  ]
    .filter(Boolean)
    .join(", ");

  return extra ? `${base}, ${extra}` : base;
  }, [activeCompanyInfo, homeSeo]);

  const firstHeroImage = useMemo(() => {
  const firstSlide = bannerData?.sliderPrincipal?.[0];
  if (!firstSlide) return '';
  
  //Compatibilidad con SSR/ PRE-RENDER: Evita caídas si 'window' es undefined
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 480 : false;
  
  // En móvil pre-cargamos la de móvil (y si no hay, la de PC)
  // En escritorio pre-cargamos la de PC (y si no hay, la de móvil)
  const imgPath = isMobile 
    ? (firstSlide.BannerImagenMovil || firstSlide.Imagen) 
    : (firstSlide.Imagen || firstSlide.BannerImagenMovil);
    
  return imgPath ? `${cleanBaseUrl}${imgPath}` : '';
  }, [bannerData, cleanBaseUrl]);

  const ogImage = useMemo(() => (
    firstHeroImage ||
    "https://disdelsa.com/og-image.jpg"
  ), [firstHeroImage]);

  //OPTIMIZADO DE MEMORIA Y RE-RENDERS
  const handleAddToCart = useCallback((product) => {
    addItem({
      ...product,
      presentationSelected: product.Unidad || 'Unidad',
      unitType: product.Unidad ? 'Y' : 'N'
    });
    toast.success(`${product.Descripcion.substring(0, 20)}... añadido`, {
      position: 'bottom-right',
    });
  }, [addItem]);    

  const carruseles = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) {
        return { higiene: [], coffee: [], cotizados: [] };
    }

    const formatProduct = (p) => ({
      ...p,
      id: p.IdProducto,
      name: p.Descripcion,
      image: `${AppConfig.baseImageUrl}productos/${p.Imagen}`
    });

    const seenHigiene = new Set(); const seenCoffee = new Set(); const seenCotizados = new Set();
    const higiene = []; const coffee = []; const cotizados = [];

    allProducts.forEach((p) => {
    const pid = String(p.IdProducto);

    if (
        String(p.IdSegmento) === AppConfig.HOME_SEGMENTS.HIGIENE &&
        !seenHigiene.has(pid)
    ) {
        if (higiene.length < 15) {
            higiene.push(formatProduct(p));
            seenHigiene.add(pid);
        }
    }

    if (
        String(p.IdCategoria) === AppConfig.HOME_SEGMENTS.COFFEE_BREAK &&
        !seenCoffee.has(pid)
    ) {
        if (coffee.length < 15) {
            coffee.push(formatProduct(p));
            seenCoffee.add(pid);
        }
    }

    if (cotizados.length < 12 && !seenCotizados.has(pid)) {
        cotizados.push(formatProduct(p));
        seenCotizados.add(pid);
    }
    });

    return { cotizados, higiene, coffee };
  }, [allProducts]);

  const hasProducts =
    Array.isArray(allProducts) &&
    allProducts.length > 0;

  const showSkeleton =
      isLoading && !hasProducts;

  if (showSkeleton) return <HomeSkeleton />;

  return (
    <main>
      <Helmet>
        {/* --- 🚀 SEO TÉCNICO B2B --- */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />

        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
        <meta name="author" content="Disdel, S.A."/>
        <meta name="generator" content="React" />
        <link rel="canonical" href="https://disdelsa.com/" />


        {/* PERFORMANCE */}
        <link rel="preconnect" href="https://www.disdelsagt.com"/>
        <link rel="dns-prefetch" href="//www.disdelsagt.com"/>

        {firstHeroImage && (
          <link
            rel="preload"
            as="image"
            href={firstHeroImage}
            fetchPriority="high"
          />
        )}

        {/* --- OPEN GRAPH (Facebook, WhatsApp, LinkedIn) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc}/>
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://disdelsa.com/" />

        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Disdel, S.A." />

        {/* --- TWITTER CARD --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc}/>
        <meta name="twitter:image" content={ogImage}/>

        {/* --- SCHEMAS --- */}
        <script type="application/ld+json">
          {schemaJson}
        </script>
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

      <Suspense fallback={null}>
        <CategoryGrid /> 
        <FeaturedBrands />

        <BannerSlider />
      </Suspense>

    {/* 3. BLOQUE DE CAROUSELES (Como usan el mismo componente ProductCarousel, se envuelven juntos) */}
    <Suspense fallback={null}>
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
            viewAllUrl="/categoria/banos-e-higiene/dispensadores-y-accesorios"
          />
        </div>
      )}
    </Suspense>

    <Suspense fallback={null}>
      <PromoNescafe />
    </Suspense>

    {/* 4. ÚLTIMO BLOQUE DE LA PÁGINA (Componentes del pie de página) */}
    <Suspense fallback={null}>
      {(isLoading || carruseles.coffee.length > 0) && (
        <div className="carousel-wrapper">
          <ProductCarousel
            title="Todo para el Coffee Break"
            products={carruseles.coffee}
            addToCart={handleAddToCart} 
            variant="carousel-coffe"
            isLoading={isLoading}
            viewAllUrl="/categoria/cafeteria/cafe-y-complementos" 
          />
        </div>
      )}

      <PromoLayout />
      <NewsletterSignup />
      <InfoSection />
    </Suspense>
    </main>
  );
};

export default React.memo(HomePage);