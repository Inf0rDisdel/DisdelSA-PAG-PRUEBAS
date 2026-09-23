import React, { useEffect, useMemo, useRef, useState} from 'react';
import { Link, useLocation} from 'react-router-dom';

import './FloatingWidgets.css';
import { useBanners } from 'hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from'components/ui/OptimizedImage/OptimizedImage';

const FloatingWidgets = () => {
  const { data: bannerData } = useBanners();
  const { pathname } = useLocation();
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const widgetsRef = useRef(null);
  const whatsappButtonRef = useRef(null);

  const rutaActual =
    pathname.replace(/\/+$/, '').toLowerCase() || '/';

  const estaEnOpiniones = rutaActual === '/opiniones';

  useEffect(() => {
    setChatAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!chatAbierto) {
      return undefined;
    }

    const cerrarAlHacerClickFuera = event => {
      if (
        widgetsRef.current &&
        !widgetsRef.current.contains(event.target)
      ) {
        setChatAbierto(false);
      }
    };

    const cerrarConEscape = event => {
      if (event.key === 'Escape') {
        setChatAbierto(false);
        whatsappButtonRef.current?.focus();
      }
    };

    document.addEventListener(
      'pointerdown',
      cerrarAlHacerClickFuera
    );
    document.addEventListener('keydown', cerrarConEscape);

    return () => {
      document.removeEventListener(
        'pointerdown',
        cerrarAlHacerClickFuera
      );
      document.removeEventListener(
        'keydown',
        cerrarConEscape
      );
    };
  }, [chatAbierto]);

  const imagenes = useMemo(() => {
    const normalizarTitulo = valor =>
      String(valor ?? '').trim().toLowerCase();

    const todosLosBanners = Object.values(
      bannerData ?? {}
    ).flatMap(grupo =>
      Array.isArray(grupo) ? grupo : []
    );

    const obtenerImagen = (titulo) => {
      const banner = todosLosBanners.find(
        item =>
          normalizarTitulo(item?.Titulo) ===
          normalizarTitulo(titulo)
      );

      const archivo =
        banner?.Imagen ||
        banner?.ImagenBanner ||
        banner?.ImagenMarca;

      return getDisdelImageUrl(archivo) || '';
    };

    return {
      whatsapp: obtenerImagen('IconoWHTS'),
      comentarios: obtenerImagen('ComentariosGeneral'),
      logo: obtenerImagen('catalogodisdelsa')
    };
  }, [bannerData]);

  const enviarMensaje = event => {
    event.preventDefault();

    const texto = mensaje.trim() ||
      'Hola, necesito información sobre los productos de Disdel.';

    const url =
      `https://wa.me/50231094985?text=${encodeURIComponent(texto)}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

    setMensaje('');
    setChatAbierto(false);
  };

  if (!imagenes.whatsapp && !imagenes.comentarios) {
    return null;
  }

  return (
    <nav
      ref={widgetsRef}
      className="footer-floating-widgets"
      aria-label="Accesos rápidos"
    >
      {imagenes.whatsapp && chatAbierto && (
        <section
          id="disdel-whatsapp-chat"
          className="whatsapp-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="disdel-whatsapp-title"
        >
          <header className="whatsapp-chat-header">
            <div className="whatsapp-chat-brand">
              <div className="whatsapp-chat-logo">
                {imagenes.logo ? (
                  <OptimizedImage
                    src={imagenes.logo}
                    alt=""
                    widths={[96, 144, 192]}
                    targetWidth={144}
                    quality={82}
                    sizes="68px"
                    width="68"
                    height="38"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span aria-hidden="true">D</span>
                )}
              </div>

              <div>
                <h2 id="disdel-whatsapp-title">
                  Disdel
                </h2>
              </div>
            </div>

            <button
              type="button"
              className="whatsapp-chat-close"
              onClick={() => {
                setChatAbierto(false);
                whatsappButtonRef.current?.focus();
              }}
              aria-label="Cerrar chat de WhatsApp"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="whatsapp-chat-body">
            <div className="whatsapp-chat-message">
              <strong>Equipo Disdel</strong>

              <p>
                ¡Hola! 👋 Bienvenido a Disdel.<br />
                ¿En qué podemos ayudarte?
              </p>

              <span>Te responderemos lo antes posible.</span>
            </div>
          </div>

          <form
            className="whatsapp-chat-form"
            onSubmit={enviarMensaje}
          >
            <label
              htmlFor="disdel-whatsapp-message"
              className="widget-visually-hidden"
            >
              Escribe tu mensaje para Disdel
            </label>

            <input
              id="disdel-whatsapp-message"
              type="text"
              value={mensaje}
              onChange={event => setMensaje(event.target.value)}
              placeholder="Escribe tu mensaje..."
              maxLength={500}
              autoComplete="off"
            />

            <button
              type="submit"
              aria-label="Enviar mensaje por WhatsApp"
            >
              <span aria-hidden="true">➜</span>
            </button>
          </form>

          <p className="whatsapp-chat-note">
            El mensaje se abrirá de forma segura en WhatsApp.
          </p>
        </section>
      )}

      {imagenes.comentarios && !estaEnOpiniones && (
        <Link
          to="/opiniones"
          className="widget-item widget-comentarios"
          aria-label="Ver opiniones de nuestros clientes"
        >
          <OptimizedImage
            src={imagenes.comentarios}
            alt=""
            widths={[48, 64, 80]}
            targetWidth={64}
            quality={80}
            sizes="52px"
            width="52"
            height="52"
            loading="lazy"
            decoding="async"
          />

          <span>Opiniones</span>
        </Link>
      )}

      {imagenes.whatsapp && (
        <button
          ref={whatsappButtonRef}
          type="button"
          className="widget-item widget-whatsapp"
          onClick={() => setChatAbierto(actual => !actual)}
          aria-label={
            chatAbierto
              ? 'Cerrar chat de WhatsApp'
              : 'Abrir chat de WhatsApp'
          }
          aria-expanded={chatAbierto}
          aria-controls="disdel-whatsapp-chat"
          aria-haspopup="dialog"
        >
          <OptimizedImage
            src={imagenes.whatsapp}
            alt=""
            widths={[40, 56, 72]}
            targetWidth={56}
            quality={80}
            sizes="48px"
            width="48"
            height="48"
            loading="lazy"
            decoding="async"
          />

          <span
            className="widget-whatsapp-status"
            aria-hidden="true"
          />
        </button>
      )}
    </nav>
  );
};

export default FloatingWidgets;
