import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaRegUserCircle,
  FaStore,
  FaTruck
} from 'react-icons/fa';
import { useBanners } from 'hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';
import './QuoteConfirmation.css';

const normalizeTitle = (value) => String(value || '').trim().toLowerCase();

const findBannerByTitle = (groups, title) => (
  groups
    .flatMap((group) => Array.isArray(group) ? group : [])
    .find((banner) => normalizeTitle(banner?.Titulo) === title)
);

const getBannerImage = (banner) => (
  banner?.Imagen || banner?.ImagenBanner || banner?.ImagenMarca
);

const formatCreatedAt = (value) => {
  if (!value) {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date());
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(parsedDate);
};

const QuoteConfirmation = ({ confirmation }) => {
  const { data: bannerData } = useBanners();

  const assets = useMemo(() => {
    const logo = findBannerByTitle(
      [bannerData?.promoExtra, bannerData?.sliderMarcas],
      'catalogodisdelsa'
    );
    const icon = findBannerByTitle(
      [bannerData?.sliderMarcas, bannerData?.promoExtra],
      'asidelimpio'
    );

    return {
      logo: getDisdelImageUrl(getBannerImage(logo)),
      icon: getDisdelImageUrl(getBannerImage(icon))
    };
  }, [bannerData]);

  const documentNumber = confirmation?.documentNumber !== undefined
    && confirmation?.documentNumber !== null
    && String(confirmation.documentNumber).trim() !== ''
    ? String(confirmation.documentNumber).replace(/^#\s*/, '').trim()
    : '';
  const createdAt = formatCreatedAt(confirmation?.createdAt);

  return (
    <main
      className="quote-confirmation"
      role="region"
      aria-live="polite"
      aria-labelledby="quote-confirmation-title"
    >
      <div className="quote-confirmation-brand">
        {assets.logo ? (
          <OptimizedImage
            src={assets.logo}
            alt="Disdel - Suministros de Limpieza y Mantenimiento"
            className="quote-confirmation-logo"
            widths={[220, 320, 440]}
            targetWidth={440}
            quality={82}
            sizes="(max-width: 600px) 220px, 320px"
            width="440"
            height="176"
            loading="eager"
            decoding="async"
            fetchPriority="auto"
          />
        ) : (
          <span className="quote-confirmation-logo-fallback">Disdel</span>
        )}
      </div>

      <section className="quote-confirmation-card">
        <header className="quote-confirmation-hero">
          <div className="quote-confirmation-emblem" aria-hidden="true">
            {assets.icon && (
              <OptimizedImage
                src={assets.icon}
                alt=""
                className="quote-confirmation-emblem-image"
                widths={[64, 96, 128]}
                targetWidth={128}
                quality={80}
                sizes="72px"
                width="128"
                height="128"
                loading="eager"
                decoding="async"
                fetchPriority="auto"
              />
            )}
          </div>
          <h1 id="quote-confirmation-title">Tu cotización fue</h1>
          <p>Procesada con éxito</p>
        </header>

        <div className="quote-confirmation-body">
          <div className="quote-confirmation-client">
            <FaRegUserCircle aria-hidden="true" />
            <div>
              <p>Estimado(a) cliente:</p>
              <h2>{confirmation?.customerName || 'Cliente Disdel'}</h2>
              <span>En un momento uno de nuestros asesores se pondrá en contacto para darle seguimiento a tu cotización.</span>
            </div>
          </div>

          <dl className="quote-confirmation-details">
            <div className="quote-confirmation-detail">
              <FaRegFileAlt aria-hidden="true" />
              <dt>No. de documento</dt>
              <dd>{documentNumber ? `# ${documentNumber}` : '—'}</dd>
            </div>
            <div className="quote-confirmation-detail">
              <FaRegCalendarAlt aria-hidden="true" />
              <dt>Fecha y hora de creación</dt>
              <dd>{createdAt}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="quote-confirmation-services" aria-label="Opciones de entrega">
        <article>
          <span className="quote-confirmation-service-icon"><FaTruck aria-hidden="true" /></span>
          <div>
            <h3>Entregas a toda Guatemala</h3>
            <p>Cobertura para empresas e instituciones.</p>
          </div>
        </article>
        <article>
          <span className="quote-confirmation-service-icon"><FaStore aria-hidden="true" /></span>
          <div>
            <h3>Pickup en tienda</h3>
            <p><FaMapMarkerAlt aria-hidden="true" /> 5 Calle 16-30, Zona 1, Ciudad de Guatemala.</p>
          </div>
        </article>
      </section>

      <div className="quote-confirmation-email-note">
        <FaEnvelope aria-hidden="true" />
        <p>
          Tu cotización fue enviada exitosamente al correo
          {' '}
          <strong>{confirmation?.email || 'registrado en el formulario'}</strong>.
        </p>
      </div>

      <Link to="/" className="quote-confirmation-home-link">Volver al catálogo</Link>
    </main>
  );
};

export default QuoteConfirmation;
