import React, { useState, useEffect } from 'react';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyBusinessPage = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await fetch("https://disdelsagt.com/MyWsMaestro/api/Conteo/GetAlmacen/SBO_DISDELSA_2013");
        if (!response.ok) throw new Error("Error red");
        const data = await response.json();
        setAlmacenes(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchAlmacenes();
  }, []); 

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Título y Botón regresar */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <FaArrowLeft /> Regresar al Inicio
        </Link>
        <h1 style={{ color: '#004aad', margin: 0 }}>🏢 Mis Almacenes (MyBusiness)</h1>
        <p style={{ color: '#666' }}>Seleccione un almacén para gestionar su inventario.</p>
      </div>

      {/* ESTADO DE CARGA */}
      {loading && <h2 style={{textAlign: 'center', color: '#888'}}>Cargando almacenes...</h2>}

      {/* GRID DE COLUMNAS (Aquí mostramos los datos) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px'
      }}>
        {!loading && almacenes.map((item, index) => (
          <div key={index} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ background: '#e6f0fa', padding: '10px', borderRadius: '50%' }}>
                    <FaStore style={{ color: '#004aad', fontSize: '1.5rem' }} />
                </div>
                <div>
                    <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold' }}>CÓDIGO</span>
                    <h3 style={{ margin: 0, color: '#004aad' }}>{item.Descripcion || "ID"}</h3>
                </div>
            </div>

            <h4 style={{ margin: '10px 0', fontSize: '1.1rem', color: '#333' }}>
                {item.NombreAlmacen || "Sin Nombre"}
            </h4>

            <div style={{ fontSize: '0.9rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                📍 {item.Direccion || "Dirección no disponible"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBusinessPage;