import React, { Suspense, lazy, Component } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomeSkeleton from 'components/ui/Skeleton/HomeSkeleton';
import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProductDetailPage = lazy(() => import('pages/ProductDetailPage'));
const SearchResultsPage = lazy(() => import('pages/SearchResults/SearchResultsPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const BrandPage = lazy(() => import('../pages/BrandPage/BrandPage'));

const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const MyBusinessPage = lazy(() => import('../pages/my-business/MyBusinessPage'));
const CartPage = lazy(() => import('pages/cart/CartPages')); 

const AboutUs = lazy(() => import('pages/info/AboutUs'));
const Ayuda = lazy(() => import('pages/info/Ayuda'));
const Locations = lazy(() => import('pages/info/Locations'));

const PrivacyPolicy = lazy(() => import('pages/info/PrivacyPolicy'));
//import ReviewStats from 'components/reviews/ReviewStats';
//const ReviewsSection = lazy(() => import('components/reviews/ReviewsSection'));

class ChunkErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    if (this.state.hasError) {
      console.warn("Fallo de carga de archivo JS de REACT. Forzando recarga de página.");
      
      // 🚀 PRÁCTICA SENIOR: Registramos el error y el rastreo exacto antes de limpiar la pantalla con el reload
      console.error("Detalles del fallo de Chunk:", error, errorInfo); 
      
      window.location.reload(true);
    }
  }

  render() {
    return this.props.children;
  }
}

const AppRouter = () => {
  return (
    <ChunkErrorBoundary >
        <Routes>

        {/* SUSPENSE INDEPENDIENTES: Cada página carga su esqueleto exacto al descargar el JS */}
        <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><HomePage /></Suspense>} />

        <Route path="/producto/:id/:slug?" element={<Suspense fallback={<ProductCardSkeleton />}><ProductDetailPage /></Suspense>} />
        <Route path="/categoria/:slug/:cat?/:subcat?" element={<Suspense fallback={<CatalogSkeleton />}><CategoryPage/></Suspense>} />
        <Route path="/marca/:slug/:subcat?" element={<Suspense fallback={<CatalogSkeleton />}><BrandPage /></Suspense>} />
          
        <Route path="/buscar" element={<Suspense fallback={<CatalogSkeleton />}><SearchResultsPage /></Suspense>} />

        {/* 3. REDIRECCIONES DE CATEGORÍAS (SEO) */}
        {['botiquin', 'papeleria', 'ferreteria', 'pisos-y-superficies'].map(cat => (
          <Route key={cat} path={`/${cat}`} element={<Navigate to={`/categoria/${cat}`} replace />} />
        ))}

        <Route 
            path="/lgrepsa.com/subcategoria/cepillos" 
            element={<Navigate to="/categoria/herramientas-para-limpieza/cepillos-y-palos-multiusos" replace />} 
          />
          <Route 
            path="/lgrepsa.com/subcategoria/guantes-multiusos" 
            element={<Navigate to="/categoria/epp" replace />} 
          />
          <Route 
            path="/lgrepsa.com/subcategoria/limpiadores-liquidos-o-espuma" 
            element={<Navigate to="/categoria/quimicos-para-limpieza" replace />} 
          />
          <Route 
            path="/lgrepsa.com/subcategoria/desinfectantes" 
            element={<Navigate to="/categoria/quimicos-para-limpieza" replace />} 
          />
          
          {/* Rescate dinámico por si existen más enlaces rotos de lgrepsa en el futuro */}
        <Route path="/lgrepsa.com/subcategoria/:slug" element={<LgrepsaLegacyRedirect />} />

        {/* --- 🚀 RESCATE DE GOOGLE (Legacy Redirects) --- */}
        <Route path="/subcategoria/mopas-y-accesorios" element={<Navigate to="/categoria/herramientas-para-limpieza/mopa-y-mecha" replace />} />
        <Route path="/subcategoria/detergente-para-ropa" element={<Navigate to="/categoria/quimicos-para-limpieza" replace />} />
        <Route path="/subcategoria/plataformas-y-accesorios" element={<Navigate to="/categoria/papeleria" replace />} />
        
        {/* Redirecciones de contacto/info (Case insensitive fallback) */}
        <Route path="/contactanos" element={<Navigate to="/ayuda" replace />} />
        <Route path="/contacto" element={<Navigate to="/ayuda" replace />} />
        <Route path="/conocenos" element={<Navigate to="/quienes-somos" replace />} />
        <Route path="/politicas" element={<Navigate to="/politicas-de-privacidad" replace />} />
        <Route path="/limpieza" element={<Navigate to="/categoria/herramientas-para-limpieza" replace />} />
        
        {/* Rescate genérico para cualquier otra subcategoría vieja */}
        <Route path="/subcategoria/:slug" element={<LegacyRedirect />} />
        
        {/* 🚀 Envolvemos con un Suspense y un fallback mínimo (un div vacío)*/}
        <Route path="/carrito" element={<Suspense fallback={<div />}><CartPage /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<div />}><LoginPage /></Suspense>} />
        <Route path="/my-business" element={<Suspense fallback={<div />}><MyBusinessPage /></Suspense>} />
        <Route path="/politicas-de-privacidad" element={<Suspense fallback={<div />}><PrivacyPolicy /></Suspense>} />
        <Route path="/quienes-somos" element={<Suspense fallback={<div />}><AboutUs /></Suspense>} />
        <Route path="/ayuda" element={<Suspense fallback={<div />}><Ayuda /></Suspense>} />
        <Route path="/ubicaciones" element={<Suspense fallback={<div />}><Locations /></Suspense>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChunkErrorBoundary>
  );
};

// Componente para manejar subcategorías que ya no existen mandándolas al buscador
const LegacyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/buscar?q=${slug.replace(/-/g, ' ')}`} replace />;
};

const LgrepsaLegacyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/buscar?q=${slug ? slug.replace(/-/g, ' ') : ''}`} replace />;
};

export default AppRouter;