import React from 'react';
import { useParams } from 'react-router-dom';

const DepartmentPage = () => {
  const { slug } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Departamento: {slug}</h1>
      <p>
        Aquí iría la lista de todos los productos que pertenecen al departamento de <strong>{slug}</strong>.
      </p>
    </div>
  );
};

export default DepartmentPage;