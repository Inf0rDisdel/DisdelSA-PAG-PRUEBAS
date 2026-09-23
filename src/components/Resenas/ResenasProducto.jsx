import React from 'react';
import ResumenResenasProducto from './ResumenResenasProducto';
import ListaResenasProducto from './ListaResenasProducto';
import FormularioResenaProducto from './FormularioResenaProducto';
import './ResenasProducto.css';

const RESUMEN_VACIO = {
  TotalResenas: 0,
  Promedio: 0
};

const ResenasProducto = ({
  idProducto,
  resumen = RESUMEN_VACIO,
  resenas = [],
  estaCargando = false,
  estaEnviando = false,
  onEnviarResena
}) => {
  const resenasPublicadas = Array.isArray(resenas) ? resenas : [];

  return (
    <section
      className="reviews-section"
      aria-labelledby="reviews-title"
      data-product-id={idProducto}
    >
      <header className="reviews-heading">
        <span className="reviews-eyebrow">Opiniones verificadas</span>
        <h2 id="reviews-title">Opiniones sobre este producto</h2>
        <p>
          Conoce la experiencia de otros clientes o comparte la tuya para ayudar
          a elegir mejor.
        </p>
      </header>

      <div className="reviews-layout">
        <ResumenResenasProducto
          resumen={resumen}
          resenas={resenasPublicadas}
          estaCargando={estaCargando}
        />

        <div className="reviews-content">
          <ListaResenasProducto
            resenas={resenasPublicadas}
            estaCargando={estaCargando}
          />

          <FormularioResenaProducto
            estaEnviando={estaEnviando}
            onEnviar={onEnviarResena}
          />
        </div>
      </div>
    </section>
  );
};

export default ResenasProducto;
