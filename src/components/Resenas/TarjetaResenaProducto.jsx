import React from 'react';
import { FaStar } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

const leerCampo = (objeto, nombrePascal, nombreCamel, respaldo = '') => (
  objeto?.[nombrePascal] ?? objeto?.[nombreCamel] ?? respaldo
);

const formatearFecha = (valor) => {
  if (!valor) return '';

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';

  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(fecha);
};

const TarjetaResenaProducto = ({ resena }) => {
  const nombre = leerCampo(resena, 'NombrePublico', 'nombrePublico', 'Cliente');
  const comentario = leerCampo(resena, 'Comentario', 'comentario');
  const calificacion = Number(
    leerCampo(resena, 'Calificacion', 'calificacion', 0)
  );
  const esClienteVerificado = Boolean(
    leerCampo(resena, 'EsClienteVerificado', 'esClienteVerificado', false)
  );
  const fecha = formatearFecha(
    leerCampo(resena, 'FechaCreacion', 'fechaCreacion')
  );

  return (
    <article className="review-card">
      <div className="review-card-top">
        <div className="review-rating" aria-label={`${calificacion} de 5 estrellas`}>
          {[1, 2, 3, 4, 5].map((estrella) => (
            <FaStar
              key={estrella}
              aria-hidden="true"
              className={estrella <= calificacion ? 'is-filled' : ''}
            />
          ))}
          <span>{calificacion}/5</span>
        </div>
        {fecha && <time dateTime={leerCampo(resena, 'FechaCreacion', 'fechaCreacion')}>{fecha}</time>}
      </div>

      <div className="review-author">
        <h3>{nombre}</h3>
        {esClienteVerificado && (
          <span className="review-verified">
            <FiCheckCircle aria-hidden="true" />
            Cliente verificado
          </span>
        )}
      </div>

      <p className="review-comment">{comentario}</p>
    </article>
  );
};

export default TarjetaResenaProducto;
