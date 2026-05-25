import React, { Suspense, lazy, Component } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

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
      console.warn("Fallo de carga de archivo JS de React. Forzando recarga de página.");
      window.location.reload(true);
    }
  }

  render() {
    return this.props.children;
  }
}

const HomeSkeleton = () => (
  <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '10px 0' }}>
    {/* 🚀 SKELETON INTEGRADO: Mismo alto y ancho en Router y HomePage */}
    <div style={{ 
      maxWidth: '1300px', 
      width: '95%', 
      height: '320px', 
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading-shimmer 1.5s infinite',
      borderRadius: '15px',
      margin: '0 auto'
    }}></div>
  </div>
);

const AppRouter = () => {
  return (
    <ChunkErrorBoundary >
      <Suspense fallback={<HomeSkeleton />}>
        <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/producto/:id/:slug?" element={<ProductDetailPage />} />
        <Route path="/categoria/:slug/:cat?/:subcat?" element={<CategoryPage />} />
        <Route path="/marca/:slug/:subcat?" element={<BrandPage />} />
          
        <Route path="/buscar" element={<SearchResultsPage />} />

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
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-business" element={<MyBusinessPage />} />
          <Route path="/politicas-de-privacidad" element={<PrivacyPolicy /> } />
          <Route path="/quienes-somos" element={<AboutUs/>} />
          <Route path="/ayuda" element={<Ayuda/>} />
          <Route path="/ubicaciones" element={<Locations/>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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