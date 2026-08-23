import React,{useMemo} from 'react';
//import { Link } from 'react-router-dom';

import './FloatingWidgets.css'; 
import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

//import opinionsButtonImage from 'assets/icons/IconosFooter/OPINIONES.webp';
//import whatsappButtonImage from 'assets/icons/IconosFooter/CONTACTANOS-WA.webp';

const FloatingWidgets = () => {

    const {data: bannerData} = useBanners();

    const whatsappButtonImage = useMemo(() => {
        const found = bannerData?.Iconos?.find(i=> i.Titulo?.trim() === "IconoWHTS");

        const fileName= found?.Imagen;
        return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
    }, [bannerData]);

    if (!whatsappButtonImage) return null;

    return (
        <div className="footer-floating-widgets">
            {/* <Link to="/opiniones" className="widget-item widget-opinions">
                <img src={opinionsButtonImage} alt="Opiniones de clientes" width="40" height="40" loading="lazy" decoding="async" fetchPriority="low" />
                <span>Opiniones</span>
            </Link> */}
            <a href="https://wa.me/50231094985" target="_blank" rel="noopener noreferrer" className="widget-item widget-whatsapp">
                <OptimizedImage src={whatsappButtonImage} alt="Contáctanos por WhatsApp" widths={[32, 48, 64]} targetWidth={64} quality={80} sizes="32px" width="32" height="32" loading="lazy" decoding="async" fetchPriority="low" />
            </a>
        </div>
    );
};

export default FloatingWidgets;
