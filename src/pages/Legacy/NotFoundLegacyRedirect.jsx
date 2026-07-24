import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundLegacyRedirect = () => {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <Helmet>
        {/* 🔥 CLAVE TÉCNICA SEO: Le indica a Google que desindexe esta URL sin penalizar como Soft 404 */}
        <meta name="robots" content="noindex, nofollow" />
        <title>Página no encontrada | Disdel</title>
      </Helmet>
      
      <div style={{ fontSize: '72px', fontWeight: '800', color: '#135eab', marginBottom: '10px' }}>404</div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Página o producto no disponible</h1>
      <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', marginBottom: '28px', lineHeight: '1.5' }}>
        El recurso que buscas ha sido descontinuado o ya no se encuentra en el catálogo.
      </p>
      
      <Link to="/" style={{ padding: '12px 28px', backgroundColor: '#135eab', color: '#ffffff', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>
        Volver al Inicio
      </Link>
    </main>
  );
};

export default NotFoundLegacyRedirect;