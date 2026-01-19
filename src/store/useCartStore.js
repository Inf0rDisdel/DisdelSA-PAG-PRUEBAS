import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast'; 

// --- CORRECCIÓN DE RUTAS ---
// Usamos ../ para subir un nivel y luego entrar a la carpeta api
import { solicitarCotizador } from '../api/VentasApi';
import { VentasModels } from '../api/ventasModels'; 

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        const { cart } = get();
        // Verificamos por ID o por Código de Disdel
        const productId = product.id || product.disdelId;
        const existingItem = cart.find(item => (item.id || item.disdelId) === productId);
        
        toast.success(`${product.name} agregado a la cotización`, {
          position: "bottom-right",
          style: { background: '#135eab', color: '#fff', borderRadius: '10px', fontSize: '14px' },
        });

        if (existingItem) {
          set({
            cart: cart.map(item =>
              (item.id || item.disdelId) === productId 
                ? { ...item, quantity: (item.quantity || 1) + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => set({ 
        cart: get().cart.filter(item => (item.id || item.disdelId) !== id) 
      }),

      updateQuantity: (id, amount) => set({
        cart: get().cart.map(item => {
          if ((item.id || item.disdelId) === id) {
            const newQty = (item.quantity || 1) + amount;
            return { ...item, quantity: newQty < 1 ? 1 : newQty };
          }
          return item;
        })
      }),

      clearCart: () => set({ cart: [] }),

      sendQuote: async (formData) => {
        const { cart } = get();
        const dataParaEnviar = VentasModels.crearDocAuxDTO();
        
        dataParaEnviar.Encabezado = {
          NombreCliente: formData.company || `${formData.name} ${formData.lastname}`,
          Autor: `${formData.name} ${formData.lastname}`,
          Empresa: formData.company,
          AuxTelefono: formData.phone,
          Correo: formData.email,
          DireccionEntrega: formData.address,
          U_DoctoNIT: "C/F",
          Recaptcha_key: "", 
          PaginaProvenienteRecaptcha: window.location.hostname,
          BaseDatos: "SBO_DISDELSA_2013",
          Almacen: "03",
          TipoCliente: "Minorista"
        };

        // Mapeamos el detalle usando el modelo que ya tienes
        dataParaEnviar.Detalle = cart.map(item => VentasModels.crearDocDetalleDTO(item));

        try {
          const respuesta = await solicitarCotizador(dataParaEnviar);
          if (respuesta.Resultado) {
            get().clearCart();
            return { success: true, message: respuesta.Mensaje };
          }
          return { success: false, message: respuesta.Mensaje };
        } catch (error) {
          return { success: false, message: "Error técnico al conectar con SAP" };
        }
      }
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;