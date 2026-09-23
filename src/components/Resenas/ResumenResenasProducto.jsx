import React, { useMemo } from 'react';
import { FaStar } from 'react-icons/fa';

const obtenerValor = (objeto, nombrePascal, nombreCamel, respaldo = 0) => {
  const valor = objeto?.[nombrePascal] ?? objeto?.[nombreCamel];
  return Number.isFinite(Number(valor)) ? Number(valor) : respaldo;
};

const ResumenResenasProducto = ({ resumen, resenas, estaCargando }) => {
  const totalResenas = obtenerValor(resumen, 'TotalResenas', 'totalResenas');
  const promedio = obtenerValor(resumen, 'Promedio', 'promedio');

  const distribucion = useMemo(() => {
    const valores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    resenas.forEach((resena) => {
      const calificacion = obtenerValor(
        resena,
        'Calificacion',
        'calificacion'
      );

      if (calificacion >= 1 && calificacion <= 5) {
        valores[Math.round(calificacion)] += 1;
      }
    });

    return valores;
  }, [resenas]);

  if (estaCargando) {
    return (
      <aside className="reviews-summary reviews-summary-loading" aria-label="Cargando resumen">
        <div className="reviews-shimmer reviews-shimmer-score" />
        <div className="reviews-shimmer reviews-shimmer-stars" />
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="reviews-shimmer reviews-shimmer-row" />
        ))}
      </aside>
    );
  }

  return (
    <aside className="reviews-summary" aria-label="Resumen de calificaciones">
      <div className="reviews-score">
        <strong>{promedio.toFixed(1)}</strong>
        <span>de 5</span>
      </div>

      <div className="reviews-summary-stars" aria-label={`${promedio.toFixed(1)} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((estrella) => (
          <FaStar
            key={estrella}
            aria-hidden="true"
            className={estrella <= Math.round(promedio) ? 'is-filled' : ''}
          />
        ))}
      </div>

      <p className="reviews-total">
        Basado en {totalResenas} {totalResenas === 1 ? 'reseña' : 'reseñas'}
      </p>

      <div className="reviews-divider" />

      <div className="reviews-distribution">
        {[5, 4, 3, 2, 1].map((estrellas) => {
          const cantidad = distribucion[estrellas];
          const porcentaje = totalResenas > 0
            ? Math.min(100, (cantidad / totalResenas) * 100)
            : 0;

          return (
            <div className="reviews-distribution-row" key={estrellas}>
              <span>{estrellas} {estrellas === 1 ? 'estrella' : 'estrellas'}</span>
              <div
                className="reviews-progress"
                role="progressbar"
                aria-label={`${estrellas} estrellas`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(porcentaje)}
              >
                <span style={{ width: `${porcentaje}%` }} />
              </div>
              <strong>{cantidad}</strong>
            </div>
          );
        })}
      </div>

      <p className="reviews-summary-note">
        El promedio considera únicamente reseñas publicadas de este producto.
      </p>
    </aside>
  );
};

export default ResumenResenasProducto;
