import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';

const FORMULARIO_INICIAL = {
  NombrePublico: '',
  Correo: '',
  NumeroDocumento: '',
  Calificacion: 0,
  Comentario: '',
  AceptarPublicacion: false
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarFormulario = (formulario) => {
  const errores = {};

  if (!formulario.NombrePublico.trim()) {
    errores.NombrePublico = 'Ingresa el nombre que deseas mostrar.';
  }

  if (!EMAIL_VALIDO.test(formulario.Correo.trim())) {
    errores.Correo = 'Ingresa un correo electrónico válido.';
  }

  if (formulario.Calificacion < 1 || formulario.Calificacion > 5) {
    errores.Calificacion = 'Selecciona una calificación.';
  }

  if (formulario.Comentario.trim().length < 20) {
    errores.Comentario = 'El comentario debe contener al menos 20 caracteres.';
  }

  return errores;
};

const FormularioResenaProducto = ({ estaEnviando, onEnviar }) => {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const actualizarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrores((actual) => ({ ...actual, [name]: undefined }));
    setMensaje('');
  };

  const seleccionarCalificacion = (calificacion) => {
    setFormulario((actual) => ({ ...actual, Calificacion: calificacion }));
    setErrores((actual) => ({ ...actual, Calificacion: undefined }));
    setMensaje('');
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarFormulario(formulario);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!onEnviar) return;

    try {
      await onEnviar({
        ...formulario,
        NombrePublico: formulario.NombrePublico.trim(),
        Correo: formulario.Correo.trim(),
        NumeroDocumento: formulario.NumeroDocumento.trim() || null,
        Comentario: formulario.Comentario.trim()
      });

      setFormulario(FORMULARIO_INICIAL);
      setErrores({});
      setMensaje('¡Gracias! Tu reseña fue recibida. Si autorizaste su publicación, será revisada por nuestro equipo.');
    } catch (error) {
      setMensaje(
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        'No fue posible enviar la reseña. Inténtalo nuevamente.'
      );
    }
  };

  return (
    <form className="review-form" onSubmit={enviarFormulario} noValidate>
      <div className="review-form-header">
        <div>
          <span>Comparte tu experiencia</span>
          <h3>Escribe tu reseña</h3>
        </div>
        <p>Los campos con * son obligatorios.</p>
      </div>

      {mensaje && (
        <div className="review-form-message" role="status">
          {mensaje}
        </div>
      )}

      <div className="review-form-grid">
        <label className="review-field">
          <span>Nombre público *</span>
          <input
            name="NombrePublico"
            type="text"
            maxLength="150"
            autoComplete="name"
            placeholder="¿Cómo quieres que te identifiquemos?"
            value={formulario.NombrePublico}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.NombrePublico)}
          />
          {errores.NombrePublico && <small>{errores.NombrePublico}</small>}
        </label>

        <label className="review-field">
          <span>Correo electrónico *</span>
          <input
            name="Correo"
            type="email"
            maxLength="254"
            autoComplete="email"
            placeholder="ejemplo@correo.com"
            value={formulario.Correo}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.Correo)}
          />
          {errores.Correo && <small>{errores.Correo}</small>}
        </label>
      </div>

      <fieldset className="review-stars-field">
        <legend>Calificación *</legend>
        <div className="review-stars-picker">
          {[1, 2, 3, 4, 5].map((estrella) => {
            const IconoEstrella = estrella <= formulario.Calificacion
              ? FaStar
              : FaRegStar;

            return (
              <button
                key={estrella}
                type="button"
                onClick={() => seleccionarCalificacion(estrella)}
                aria-label={`${estrella} ${estrella === 1 ? 'estrella' : 'estrellas'}`}
              >
                <IconoEstrella aria-hidden="true" />
              </button>
            );
          })}
          <span>
            {formulario.Calificacion
              ? `${formulario.Calificacion} de 5`
              : 'Selecciona una calificación'}
          </span>
        </div>
        {errores.Calificacion && <small>{errores.Calificacion}</small>}
      </fieldset>

      <label className="review-field review-field-comment">
        <span>Comentario *</span>
        <textarea
          name="Comentario"
          rows="4"
          minLength="20"
          maxLength="1000"
          placeholder="Comparte tu experiencia con este producto..."
          value={formulario.Comentario}
          onChange={actualizarCampo}
          aria-invalid={Boolean(errores.Comentario)}
        />
        <span className="review-character-count">
          {formulario.Comentario.length}/1000
        </span>
        {errores.Comentario && <small>{errores.Comentario}</small>}
      </label>

      <div className="review-form-footer">
        <div>
          <label className="review-consent">
            <input
              name="AceptarPublicacion"
              type="checkbox"
              checked={formulario.AceptarPublicacion}
              onChange={actualizarCampo}
            />
            <span>Autorizo que mi reseña pueda ser publicada.</span>
          </label>
          <small className="review-consent-help">
            Puedes enviar tu reseña sin marcar esta casilla. Si no la autorizas,
            solo será utilizada para atención interna.
          </small>
        </div>

        <button
          className="review-submit"
          type="submit"
          disabled={estaEnviando || !onEnviar}
          title={!onEnviar ? 'El envío se habilitará al conectar el hook' : undefined}
        >
          {estaEnviando ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </div>

      <p className="review-moderation-note">
        <FiLock aria-hidden="true" />
        Las reseñas serán revisadas antes de publicarse.
      </p>
    </form>
  );
};

export default FormularioResenaProducto;
