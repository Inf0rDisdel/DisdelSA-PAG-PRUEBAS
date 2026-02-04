import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { useMutation } from '@tanstack/react-query'; 
import { suscribiNewsLetter } from 'api/VentasApi';
import Swal from 'sweetalert2';
import './NewsLetterSignup.css'; 

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
});

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);

    const mutation = useMutation({
        mutationFn: (data) => suscribiNewsLetter(data),
        onSuccess: (respuesta) => {
            if (respuesta.Resultado) {
                Toast.fire({ icon: 'success', title: respuesta.Mensaje || '¡Suscrito exitosamente!' });
                setEmail('');
                setAccepted(false);
            } else {
                Toast.fire({ icon: 'warning', title: respuesta.Mensaje });
            }
        },
        onError: () => {
            Toast.fire({ icon: 'error', title: 'Error de conexión' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!accepted) {
            Toast.fire({ icon: 'info', title: 'Atención', text: 'Debes aceptar las políticas de privacidad' });
            return;
        }
        mutation.mutate({ email, acepto: accepted });
    };

    return (
        <section className="newsletter-wrapper">
            <div className="newsletter-container">
                {/* BLOQUE DE INFORMACIÓN (Icono + Texto) */}
                <div className="newsletter-info">
                    <div className="newsletter-icon-box">
                        <HiOutlineMail className="newsletter-icon" />
                    </div>
                    <div className="newsletter-text-content">
                        <strong>SUSCRÍBETE Y RECIBE EN TU CORREO</strong>
                        <p>NUESTRAS PROMOCIONES Y DESCUENTOS.</p>
                    </div>
                </div>

                {/* BLOQUE DE ACCIÓN (Formulario + Checkbox) */}
                <div className="newsletter-action-column">
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
                        <button type="submit" className="newsletter-button" disabled={mutation.isPending}>
                            {mutation.isPending ? '...' : 'SUSCRÍBETE'}
                        </button>
                    </form>

                    <div className="newsletter-acceptance">
                        <input 
                            type="checkbox" 
                            id="terms-acceptance" 
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            required 
                        />
                        <label htmlFor="terms-acceptance">
                            Acepto que he leído y acepto los términos de <Link to="/politicas-de-privacidad">Políticas de privacidad</Link>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;