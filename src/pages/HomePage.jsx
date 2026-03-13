import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import useCartStore from 'store/useCartStore';
import { toast } from 'react-hot-toast'; 
import { useProducts } from 'hooks/useProducts'; 
import { AppConfig } from 'config/AppConfig'; 

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

  const fullGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://disdelsa.com/#organization",
        "name": "Disdel, S.A.",
        "alternateName": "Disdelsa",
        "url": "https://disdelsa.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://disdelsa.com/logo.png"
        },
        "image": "https://disdelsa.com/og-image.jpg",
        "description": "Distribuidor mayorista líder en Guatemala de suministros de limpieza, higiene, cafetería y equipo de protección personal para empresas e instituciones.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "15 Calle 16-30, Zona 1",
          "addressLocality": "Ciudad de Guatemala",
          "postalCode": "01001",
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
          "https://www.facebook.com/disdelsagt",
          "https://www.instagram.com/disdelsagt",
          "https://www.linkedin.com/company/disdelsa"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://disdelsa.com/#website",
        "url": "https://disdelsa.com/",
        "name": "Disdel Suministros Institucionales",
        "publisher": { "@id": "https://disdelsa.com/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://disdelsa.com/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  const handleAddToCart = (product) => {
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
    const result = { higiene: [], coffee: [], cotizados: [] };
    
    if (!allProducts || !Array.isArray(allProducts)) return result;

  const higieneTemp = allProducts.filter(p => String(p.IdSegmento) === "1059").slice(0, 30);
  const coffeeTemp = allProducts.filter(p => String(p.IdCategoria) === "2166").slice(0, 30);

    // Recorremos los 4,000 productos UNA SOLA VEZ
    for (let i = 0; i < allProducts.length; i++) {
        const p = allProducts[i];
        if (String(p.IdSegmento) === "1059") higieneTemp.push(p);
        if (String(p.IdCategoria) === "2166") coffeeTemp.push(p);
    }

    // Función rápida de mapeo
    const format = (p) => ({
        id: p.IdProducto,
        name: p.Descripcion,
        image: `${AppConfig.baseImageUrl}productos/${p.Imagen}`,
        disdelId: p.IdProducto,
        ...p 
    });

    // Mezclamos y cortamos solo los necesarios
    result.higiene = higieneTemp.sort(() => 0.5 - Math.random()).slice(0, 15).map(format);
    result.coffee = coffeeTemp.sort(() => 0.5 - Math.random()).slice(0, 15).map(format);
    result.cotizados = allProducts.slice(0, 10).map(format);

    return result;
  }, [allProducts]);

  return (
    <main>
      <Helmet>
        {/* --- 🚀 SEO TÉCNICO B2B --- */}
        <title>Disdel | Suministros de Limpieza, Higiene , Protección corporal, cafetería Mayorista en Guatemala</title>
        <meta name="description" content="Distribuidor institucional líder en Guatemala. Proveemos suministros de limpieza profesional, equipo de protección personal (EPP) y cafetería para hoteles, hospitales y empresas." />
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