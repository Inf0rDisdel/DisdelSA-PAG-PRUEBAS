import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Categoría: {slug}</h1>
      <p>
        Aquí iría la lista de todos los productos que pertenecen a la categoría <strong>{slug}</strong>.
      </p>
      {/* Aquí es donde, en un futuro, renderizarías un componente como <ProductList category={slug} /> */}
    </div>
  );
};

export default CategoryPage;