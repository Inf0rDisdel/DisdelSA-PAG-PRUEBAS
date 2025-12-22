import React from 'react';
import './NewsLetterSignup.css'; 

import { HiOutlineMail } from 'react-icons/hi';

const NewsletterSignup = () => {
    return (
        <section className="newsletter-wrapper">
            <div className="newsletter-container">

                <div className="newsletter-info">
                    <HiOutlineMail className="newsletter-icon" />
                    <p>
                        <strong>SUSCRÍBETE Y RECIBE EN TU CORREO</strong><br />
                        NUESTRAS PROMOCIONES Y DESCUENTOS.
                    </p>
                </div>

                <form className="newsletter-form">
                    <input 
                        type="email" 
                        placeholder="Escribe tu correo" 
                        className="newsletter-input" 
                        required 
                    />
                    <button type="submit" className="newsletter-button">
                        SUSCRIBIRME
                    </button>
                </form>

            </div>
            
            <div className="newsletter-acceptance">
                <input type="checkbox" id="terms-acceptance" required />
                <label htmlFor="terms-acceptance">
                    Acepto que he leído y acepto los términos de <a href="/politicas-de-privacidad">Políticas de privacidad</a>
                </label>
            </div>
        </section>
    );
};

export default NewsletterSignup;