import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { useMutation } from '@tanstack/react-query'; 
import { suscribiNewsLetter } from 'api/VentasApi';
import Swal from 'sweetalert2';
import './NewsLetterSignup.css'; 

// --- 1. DEFINICIÓN DEL TOAST (Configuración para el efecto pequeño y arriba a la derecha) ---
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);

    // 2. CONFIGURAR LA MUTACIÓN
    const mutation = useMutation({
        mutationFn: (data) => suscribiNewsLetter(data),
        onSuccess: (respuesta) => {
            if (respuesta.Resultado) {
                // CAMBIO: Ahora usamos Toast.fire para que sea pequeño y elegante
                Toast.fire({
                    icon: 'success',
                    title: respuesta.Mensaje || '¡Suscrito exitosamente!'
                });
                setEmail('');
                setAccepted(false);
            } else {
                // CAMBIO: Alerta de advertencia también en estilo Toast
                Toast.fire({
                    icon: 'warning',
                    title: respuesta.Mensaje
                });
            }
        },
        onError: () => {
            // CAMBIO: Alerta de error en estilo Toast
            Toast.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Inténtalo de nuevo más tarde.'
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!accepted) {
            // CAMBIO: Validación inicial también con Toast
            Toast.fire({
                icon: 'info',
                title: 'Atención',
                text: 'Debes aceptar las políticas de privacidad'
            });
            return;
        }

        // 3. DISPARAR LA MUTACIÓN
        mutation.mutate({ email, acepto: accepted });
    };

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

                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Escribe tu correo" 
                        className="newsletter-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        disabled={mutation.isPending} 
                    />
                    <button 
                        type="submit" 
                        className="newsletter-button" 
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'PROCESANDO...' : 'SUSCRIBIRME'}
                    </button>
                </form>
            </div>
            
            <div className="newsletter-acceptance">
                <input 
                    type="checkbox" 
                    id="terms-acceptance" 
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    required 
                />
                <label htmlFor="terms-acceptance">
                    Acepto que he leído y acepto los términos de <Link to="/politicas-de-privacidad" className="Políticas de privacidad">Políticas de privacidad</Link>
                </label>
            </div>
        </section>
    );
};

export default NewsletterSignup;