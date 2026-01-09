import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedBrands.css'; 

import SilverLogo from 'assets/logo/SILVERCHEMICAL.png';
import KimberlyLogo from 'assets/logo/KCP.png';
import m3Logo from 'assets/logo/3M.png';
import WieseLogo from 'assets/logo/WIESE.png';

const FeaturedBrands = () => {
  return (
    <section className="featured-brands-section">
      <h2 className="section-title">Aliados Comerciales</h2>
      
      <div className="brands-container">
        {/* Rutas normalizadas a minúsculas y con guiones */}
        <Link to="/marca/kimberly-clark" className="brand-item">
          <img src={KimberlyLogo} alt="Kimberly-Clark Professional" />
        </Link>
        
        <Link to="/marca/silver" className="brand-item">
          <img src={SilverLogo} alt="Silver" />
        </Link>

        <Link to="/marca/wiese" className="brand-item">
          <img src={WieseLogo} alt="Wiese" />
        </Link>
        
        <Link to="/marca/3m" className="brand-item">
          <img src={m3Logo} alt="3M Distribuidor Autorizado" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedBrands;