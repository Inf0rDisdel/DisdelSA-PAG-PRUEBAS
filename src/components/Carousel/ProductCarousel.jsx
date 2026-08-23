import React,{useMemo, useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import './ProductCarousel.css';
import { useBanners } from 'hooks/useBanners';
import ProductCard from 'components/ui/ProductCard/ProductCard';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import Skeleton from 'components/ui/Skeleton/Skeleton';
import { getDisdelImageUrl, getOptimizedImageUrl } from 'utils/imageUrl';

const ProductCarousel = ({ title, products = [], isLoading, variant = '' , viewAllUrl}) => {
  const{data: bannerData} = useBanners();
  const scrollerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 480px)').matches
  );
  const [isTablet, setIsTablet] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 480px)');
    const tabletQuery = window.matchMedia('(max-width: 1024px)');
    const handleMobileChange = (event) => setIsMobile(event.matches);
    const handleTabletChange = (event) => setIsTablet(event.matches);

    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    mobileQuery.addEventListener('change', handleMobileChange);
    tabletQuery.addEventListener('change', handleTabletChange);

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      tabletQuery.removeEventListener('change', handleTabletChange);
    };
  }, []);

  const images = useMemo(() => {
    const fondoImagen = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "FondoCarousel")?.Imagen;
    const originalBackground = getDisdelImageUrl(fondoImagen);
    return {
      fondoImagen: getOptimizedImageUrl(originalBackground, 1400, 76)
    };
  }, [bannerData]);

  // 🚀 SKELETON RESPONSIVO: Dibuja únicamente las tarjetas visibles según el dispositivo
  if (isLoading) {
    const skeletonCount = isMobile ? 2 : (isTablet ? 3 : 5);

    return (
      <div className="product-carousel-container">
        <div style={{ padding: isMobile ? '0 10px' : '0 20px' }}>
          <Skeleton width="220px" height="36px" style={{ borderRadius: '18px', marginBottom: '22px' }} />
        </div>
        <div className="carousel-skeleton-grid">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`pdp-sk-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null; 
  }

  const scrollProducts = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.8, 240),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  return (
    <section 
      className={`product-carousel-container ${variant}`}
      // 🚀 PROGRAMACIÓN DEFENSIVA: Solo aplicamos el fondo si la imagen ha sido cargada con éxito de la API
      style={images.fondoImagen ? { backgroundImage: `url(${images.fondoImagen})` } : undefined}
      aria-label={title}
    >
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {viewAllUrl && (
          <Link to={viewAllUrl} className='carousel-view-all-btn' aria-label={`Ver todos los productos de ${title}`}>
            Ver todo &rarr;
          </Link>
        )}
      </div>
      
      <div className="product-native-slider-shell">
        <button
          type="button"
          className="product-scroll-button product-scroll-button--previous"
          aria-label={`Ver productos anteriores de ${title}`}
          onClick={() => scrollProducts(-1)}
        >
          <span aria-hidden="true">&#8249;</span>
        </button>

        <div
          ref={scrollerRef}
          className="product-native-slider"
          role="list"
          aria-label={`Productos de ${title}`}
          tabIndex="0"
        >
          {products.map((product, index) => (
            <div key={product.IdProducto || index} className="carousel-item-padding" role="listitem">
              <ProductCard product={product} index={index} priority={false} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="product-scroll-button product-scroll-button--next"
          aria-label={`Ver más productos de ${title}`}
          onClick={() => scrollProducts(1)}
        >
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>
    </section>
  );
};

export default ProductCarousel;
