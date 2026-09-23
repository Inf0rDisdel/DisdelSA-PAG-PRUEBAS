import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import TarjetaResenaProducto from './TarjetaResenaProducto';

const ListaResenasProducto = ({ resenas, estaCargando }) => {
  if (estaCargando) {
    return (
      <div className="reviews-list" aria-label="Cargando opiniones">
        {[1, 2].map((item) => (
          <div className="review-card review-card-loading" key={item}>
            <div className="reviews-shimmer reviews-shimmer-card-title" />
            <div className="reviews-shimmer reviews-shimmer-card-line" />
            <div className="reviews-shimmer reviews-shimmer-card-line is-short" />
          </div>
        ))}
      </div>
    );
  }

  if (!resenas.length) {
    return (
      <div className="reviews-empty">
        <span className="reviews-empty-icon" aria-hidden="true">
          <FiMessageSquare />
        </span>
        <div>
          <h3>Este producto aún no tiene opiniones publicadas</h3>
          <p>Sé la primera persona en compartir su experiencia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-list" aria-label="Opiniones publicadas">
      {resenas.map((resena, indice) => (
        <TarjetaResenaProducto
          key={resena.IdResena ?? resena.idResena ?? indice}
          resena={resena}
        />
      ))}
    </div>
  );
};

export default ListaResenasProducto;
