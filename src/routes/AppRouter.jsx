import React, {lazy, Component, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomeSkeleton from 'components/ui/Skeleton/HomeSkeleton';
import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import ProductDetailSkeleton from 'components/ui/Skeleton/ProductDetailSkeleton';
import { withSuspense } from './routeHelpers';

const HomePage = lazy(() =>
    import(
        /* webpackChunkName: "home" */
        '../pages/HomePage'
    )
);

const ProductDetailPage = lazy(() =>
    import(
        /* webpackChunkName: "product" */
        'pages/ProductDetailPage'
    )
);

const SearchResultsPage = lazy(() =>
    import(
        /* webpackPrefetch: true */
        'pages/SearchResults/SearchResultsPage'
    )
);

const CategoryPage = lazy(() =>
    import(
        /* webpackChunkName: "category" */
        '../pages/CategoryPage'
    )
);

const BrandPage = lazy(() => 
  import(
    /* webpackChunkName: "brand" */
    '../pages/BrandPage/BrandPage'
  )
);

const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const MyBusinessPage = lazy(() => import('../pages/my-business/MyBusinessPage'));
const CartPage = lazy(() => import('pages/cart/CartPages')); 

const AboutUs = lazy(() => import('pages/info/AboutUs'));
const Ayuda = lazy(() => import('pages/info/Ayuda'));
const Locations = lazy(() => import('pages/info/Locations'));
const PrivacyPolicy = lazy(() => import('pages/info/PrivacyPolicy'));

const ProductLegacyRedirect = lazy(() => import('pages/Legacy/ProductLegacyRedirect'));
const CategoryLegacyRedirect = lazy(() => import('pages/Legacy/CategoryLegacyRedirect'));
const BrandLegacyRedirect = lazy(() => import('pages/Legacy/BrandLegacyRedirect'));
const NotFoundLegacyRedirect = lazy(() => import('pages/Legacy/NotFoundLegacyRedirect'));
//import ReviewStats from 'components/reviews/ReviewStats';
//const ReviewsSection = lazy(() => import('components/reviews/ReviewsSection'));

class ChunkErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk');

    return {
      hasError: isChunkError,
    };
  }

  componentDidCatch(error, errorInfo) {
    if (this.state.hasError) {
      console.warn(
        'Fallo de carga del chunk de React. Recargando aplicación.'
      );

      console.error(error, errorInfo);

      window.location.reload(window.location.href);
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

        <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><HomePage /></Suspense>} />

        <Route path="/producto/:id" element={withSuspense(ProductLegacyRedirect, <ProductDetailSkeleton />)} />
        {/* Ruta Canónica Oficial */}
        <Route caseSensitive={false} path="/producto/:id/:slug" element={withSuspense(ProductDetailPage, <ProductDetailSkeleton />)} />

        {/* 🚀 2. REDIRECCIONES LEGACY DE CATEGORÍAS (Atrapa enlaces viejos tipo /category/ o /c/) */}
        <Route path="/category/:slug" element={withSuspense(CategoryLegacyRedirect, <CatalogSkeleton />)} />
        <Route path="/c/:slug" element={withSuspense(CategoryLegacyRedirect, <CatalogSkeleton />)} />
        {/* Ruta Canónica Oficial de Categorías */}
        <Route path="/categoria/:slug/:cat?/:subcat?" element={withSuspense(CategoryPage, <CatalogSkeleton />)} />

        {/* 🚀 3. REDIRECCIONES LEGACY DE MARCAS (Atrapa enlaces viejos tipo /marcas/ o /m/) */}
        <Route path="/marcas/:slug" element={withSuspense(BrandLegacyRedirect, <CatalogSkeleton />)} />
        <Route path="/m/:slug" element={withSuspense(BrandLegacyRedirect, <CatalogSkeleton />)} />
        {/* Ruta Canónica Oficial de Marcas */}
        <Route path="/marca/:slug/:subcat?" element={withSuspense(BrandPage, <CatalogSkeleton />)} />
          
        <Route path="/buscar" element={withSuspense(SearchResultsPage, <CatalogSkeleton />)}/>
        
        {/* LOGIN */}
        <Route path="/login"element={withSuspense(LoginPage)}/>

        {/* CARRITO */}
        <Route path="/carrito"element={withSuspense(CartPage)}/>

        {/* MY BUSINESS */}
        <Route path="/my-business"element={withSuspense(MyBusinessPage)}/>

        {/* QUIÉNES SOMOS */}
        <Route  path="/quienes-somos"element={withSuspense(AboutUs)}/>

        {/* AYUDA */}
        <Route path="/ayuda"element={withSuspense(Ayuda)}/>

        {/* UBICACIONES */}
        <Route path="/ubicaciones"element={withSuspense(Locations)}/>

        {/* PRIVACIDAD */}
        <Route path="/politicas-de-privacidad"element={withSuspense(PrivacyPolicy)}/>

        {/* Redirecciones de contacto/info (Case insensitive fallback) */}
        <Route path="/contactanos" element={<Navigate to="/ayuda" replace />} />
        <Route path="/contacto" element={<Navigate to="/ayuda" replace />} />
        <Route path="/conocenos" element={<Navigate to="/quienes-somos" replace />} />
        <Route path="/politicas" element={<Navigate to="/politicas-de-privacidad" replace />} />
        <Route path="/limpieza" element={<Navigate to="/categoria/herramientas-para-limpieza" replace />} />

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
        
        {/* Rescate genérico para cualquier otra subcategoría vieja */}
        <Route path="/subcategoria/:slug" element={<LegacyRedirect />} />

        <Route path="*" element={withSuspense(NotFoundLegacyRedirect)} />
      </Routes>
    </ChunkErrorBoundary>
  );
};

// Componente para manejar subcategorías que ya no existen mandándolas al buscador
const LegacyRedirect = () => {

    const { slug } = useParams();

    if (!slug) {
        return <Navigate to="/" replace />;
    }

    return (
        <Navigate
            to={`/buscar?q=${slug.replace(/-/g, ' ')}`}
            replace
        />
    );
};

const LgrepsaLegacyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/buscar?q=${slug ? slug.replace(/-/g, ' ') : ''}`} replace />;
};

export default React.memo(AppRouter);