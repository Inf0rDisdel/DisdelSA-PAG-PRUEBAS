import React, { useState } from 'react';
import './ComentariosPage.css';
import { useResenasGenerales } from 'hooks/useResenasGenerales';

const formularioInicial = {
  NombrePublico: '',
  Correo: '',
  Calificacion: 0,
  Comentario: '',
  AceptarPublicacion: false
};

const Estrellas = ({ valor }) => {
  const calificacion = Number(valor) || 0;

  return (
    <div
      className="general-review-stars"
      role="img"
      aria-label={`${calificacion} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map(estrella => (
        <span
          key={estrella}
          className={
            estrella <= calificacion
              ? 'is-active'
              : ''
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
};

const formatearFecha = fecha => {
  if (!fecha) {
    return '';
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(fechaConvertida);
};

const ComentarioCard = ({ comentario }) => {
  const nombre =
    comentario.NombrePublico?.trim() ||
    'Cliente Disdel';

  const inicial = nombre.charAt(0).toUpperCase();

  const fecha = formatearFecha(
    comentario.FechaCreacion
  );

  return (
    <article className="general-review-card">
      <header className="general-review-card-header">
        <div
          className="general-review-avatar"
          aria-hidden="true"
        >
          {inicial}
        </div>

        <div className="general-review-customer">
          <h2>{nombre}</h2>

          {comentario.EsClienteVerificado && (
            <span className="general-review-verified">
              <span aria-hidden="true">✓</span>
              Cliente verificado
            </span>
          )}
        </div>

        {fecha && (
          <time dateTime={comentario.FechaCreacion}>
            {fecha}
          </time>
        )}
      </header>

      <div className="general-review-rating">
        <Estrellas
          valor={comentario.Calificacion}
        />

        <strong>
          {Number(comentario.Calificacion) || 0}/5
        </strong>
      </div>

      <p>{comentario.Comentario}</p>
    </article>
  );
};

const FormularioOpinionGeneral = ({
  onEnviarComentario,
  estaEnviando = false
}) => {
  const [formulario, setFormulario] = useState({
    ...formularioInicial
  });

  const [mensaje, setMensaje] = useState(null);

  const formularioDisponible =
    typeof onEnviarComentario === 'function';

  const actualizarCampo = event => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormulario(actual => ({
      ...actual,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));

    if (mensaje) {
      setMensaje(null);
    }
  };

  const seleccionarCalificacion = valor => {
    setFormulario(actual => ({
      ...actual,
      Calificacion: valor
    }));

    if (mensaje) {
      setMensaje(null);
    }
  };

  const enviarFormulario = async event => {
    event.preventDefault();

    if (!formularioDisponible || estaEnviando) {
      return;
    }

    try {
      await onEnviarComentario({
        NombrePublico:
          formulario.NombrePublico.trim(),

        Correo:
          formulario.Correo.trim(),

        Calificacion:
          Number(formulario.Calificacion),

        Comentario:
          formulario.Comentario.trim(),

        AceptarPublicacion:
          formulario.AceptarPublicacion
      });

      setFormulario({
        ...formularioInicial
      });

      setMensaje({
        tipo: 'success',
        texto:
          '¡Gracias! Tu opinión fue recibida. Si autorizaste su publicación, será revisada por nuestro equipo.'
      });
    } catch (error) {
      const texto =
        error?.response?.data?.Mensaje ||
        error?.response?.data?.Message ||
        error?.message ||
        'No pudimos enviar tu opinión. Inténtalo nuevamente.';

      setMensaje({
        tipo: 'error',
        texto
      });
    }
  };

  return (
    <section
      className="general-review-form-card"
      aria-labelledby="general-review-form-title"
    >
      <div className="general-review-form-heading">
        <div>
          <span>COMPARTE TU EXPERIENCIA</span>

          <h2 id="general-review-form-title">
            Escribe tu opinión
          </h2>
        </div>

        <p>
          Los campos con <strong>*</strong> son
          obligatorios.
        </p>
      </div>

      {mensaje && (
        <div
          className={`general-review-form-feedback is-${mensaje.tipo}`}
          role={
            mensaje.tipo === 'error'
              ? 'alert'
              : 'status'
          }
          aria-live="polite"
        >
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={enviarFormulario}>
        <div className="general-review-form-grid">
          <div className="general-review-field">
            <label htmlFor="general-review-name">
              Nombre público <span>*</span>
            </label>

            <input
              id="general-review-name"
              name="NombrePublico"
              type="text"
              value={formulario.NombrePublico}
              onChange={actualizarCampo}
              placeholder="¿Cómo quieres que te identifiquemos?"
              autoComplete="name"
              minLength={2}
              maxLength={150}
              required
            />
          </div>

          <div className="general-review-field">
            <label htmlFor="general-review-email">
              Correo electrónico <span>*</span>
            </label>

            <input
              id="general-review-email"
              name="Correo"
              type="email"
              value={formulario.Correo}
              onChange={actualizarCampo}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              aria-describedby="general-review-email-help"
              maxLength={254}
              required
            />

            <small
              id="general-review-email-help"
              className="general-review-field-help"
            >
              Tu correo no se mostrará públicamente.
            </small>
          </div>
        </div>

        <fieldset className="general-review-rating-field">
          <legend>
            Calificación <span>*</span>
          </legend>

          <div className="general-review-rating-options">
            {[1, 2, 3, 4, 5].map(estrella => (
              <label
                key={estrella}
                className="general-review-rating-option"
                aria-label={`${estrella} ${
                  estrella === 1
                    ? 'estrella'
                    : 'estrellas'
                }`}
              >
                <input
                  type="radio"
                  name="Calificacion"
                  value={estrella}
                  checked={
                    Number(
                      formulario.Calificacion
                    ) === estrella
                  }
                  onChange={() =>
                    seleccionarCalificacion(
                      estrella
                    )
                  }
                  required
                />

                <span
                  className={
                    estrella <=
                    Number(
                      formulario.Calificacion
                    )
                      ? 'is-selected'
                      : ''
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
              </label>
            ))}

            <small>
              {formulario.Calificacion
                ? `${formulario.Calificacion} de 5`
                : 'Selecciona una calificación'}
            </small>
          </div>
        </fieldset>

        <div className="general-review-field">
          <div className="general-review-comment-label">
            <label htmlFor="general-review-comment">
              Comentario <span>*</span>
            </label>

            <small>
              {formulario.Comentario.length}/1000
            </small>
          </div>

          <textarea
            id="general-review-comment"
            name="Comentario"
            value={formulario.Comentario}
            onChange={actualizarCampo}
            placeholder="Cuéntanos cómo fue tu experiencia con Disdel..."
            minLength={20}
            maxLength={1000}
            rows={5}
            required
          />
        </div>

        <div className="general-review-form-actions">
          <label className="general-review-consent">
            <input
              name="AceptarPublicacion"
              type="checkbox"
              checked={
                formulario.AceptarPublicacion
              }
              onChange={actualizarCampo}
            />

            <span>
              Autorizo que mi opinión pueda ser publicada.
            </span>
          </label>

          <small className="general-review-field-help">
            Puedes enviar tu opinión sin marcar esta casilla. Si no la autorizas,
            solo será utilizada para atención interna.
          </small>

          <button
            type="submit"
            disabled={
              !formularioDisponible ||
              estaEnviando
            }
          >
            {estaEnviando
              ? 'Enviando…'
              : 'Enviar opinión'}
          </button>
        </div>

        <div className="general-review-form-note">
          <span aria-hidden="true">◇</span>

          Las opiniones serán revisadas antes de
          publicarse.
        </div>
      </form>
    </section>
  );
};

const ComentariosPage = () => {
  const {
    resenas,
    estaCargando,
    ocurrioError,
    enviarResena,
    estaEnviando
  } = useResenasGenerales();

  const comentariosReales = Array.isArray(resenas)
    ? resenas
    : [];

  const hayComentarios =
    comentariosReales.length > 0;

  return (
    <main className="general-reviews-page">
      <div className="general-reviews-container">
        <header className="general-reviews-heading">
          <span>EXPERIENCIAS REALES</span>

          <h1>
            Opiniones de nuestros clientes
          </h1>

          <p>
            Conoce las experiencias compartidas
            por nuestros clientes.
          </p>
        </header>

        {estaCargando && (
          <div
            className="general-reviews-status"
            role="status"
            aria-live="polite"
          >
            Cargando opiniones…
          </div>
        )}

        {!estaCargando &&
          ocurrioError && (
            <section
              className="general-reviews-empty"
              role="alert"
            >
              <div
                className="general-reviews-empty-icon"
                aria-hidden="true"
              >
                !
              </div>

              <h2>
                No pudimos cargar las opiniones
              </h2>

              <p>
                Inténtalo nuevamente dentro de
                unos momentos.
              </p>
            </section>
          )}

        {!estaCargando &&
          !ocurrioError &&
          !hayComentarios && (
            <section className="general-reviews-empty">
              <div
                className="general-reviews-empty-icon"
                aria-hidden="true"
              >
                ☆
              </div>

              <h2>Aún no hay reseñas</h2>

              <p>
                Sé la primera persona en compartir
                tu experiencia con Disdel.
              </p>
            </section>
          )}

        {!estaCargando &&
          !ocurrioError &&
          hayComentarios && (
            <section
              className="general-reviews-grid"
              aria-label="Opiniones publicadas"
            >
              {comentariosReales.map(
                comentario => (
                  <ComentarioCard
                    key={comentario.IdResena}
                    comentario={comentario}
                  />
                )
              )}
            </section>
          )}

        <FormularioOpinionGeneral
          onEnviarComentario={enviarResena}
          estaEnviando={estaEnviando}
        />
      </div>
    </main>
  );
};

export default ComentariosPage;
