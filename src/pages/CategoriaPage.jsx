// CategoriaPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoriaPage = () => {
  // 1. Recuperamos el ID de la URL (ej: "panos-limpieza")
  const { id } = useParams(); 
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // 2. LISTO PARA CONSUMIR API
    // Aquí harás la llamada usando ese 'id' dinámico
    
    console.log(`Consultando API para la categoría: ${id}`);
    
    // Ejemplo:
    // fetch(`https://tu-api.com/productos?categoria=${id}`)
    //   .then(res => res.json())
    //   .then(data => setProductos(data));

  }, [id]); // Se ejecuta cada vez que cambia el ID

  return (
    <div>
      <h1>Mostrando productos de: {id}</h1>
      {/* Aquí renderizas tus productos */}
    </div>
  );
};

export default CategoriaPage;