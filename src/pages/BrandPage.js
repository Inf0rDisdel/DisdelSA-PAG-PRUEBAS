import React from 'react';
import { useParams } from 'react-router-dom';

const BrandPage = () => {
  const { slug } = useParams();


  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>Mostrando productos de la marca: {slug}</h1>
      <p>
        Aquí se mostrará la lista de productos de <strong>{slug}</strong>.
      </p>
      {/* Aquí podrías renderizar un componente <ProductList brand={slug} /> */}
    </div>
  );
};

export default BrandPage;