import React, { useMemo } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import './CarItem.css';
import { useBanners } from 'hooks/useBanners';

const CartItem = ({ product }) => {

  const {data:bannerData} = useBanners ();

 const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault");
    const fileName = found?.BannerImagenMovil;
    return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
  }, [bannerData]);

  const { removeFromCart, updateQuantity } = useCartStore();
  const quantity = product.quantity || 1;

  return (
    <div className="cart-item-wrapper">
      <div className="item-image-container">
        <img
          src={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : defaultImage}
          alt={product.Descripcion}
          className="item-image"
          // Evitamos que la imagen se vea estirada
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="item-info">
        <span className="info-label">Producto</span>
        <p className="item-name">{product.Descripcion}</p>
        <span className="item-id">Cód: {product.IdProducto}</span>
      </div>

      {/* 🔥 Muestra la presentación guardada (Imagen 1) */}
      <div className="item-info">
        <span className="info-label">Presentación Solicitada</span>
        <p className="item-packaging" style={{ color: '#135eab', fontWeight: 'bold' }}>
          {product.presentationSelected || 'Unidad'}
        </p>
      </div>


      <div className="quantity-control">
        <button className="quantity-btn" disabled={quantity <= 1} onClick={() => updateQuantity(product.IdProducto, product.unitType, -1)}>
          <FiMinus />
        </button>
        <span className="quantity-display">{quantity}</span>
        <button className="quantity-btn" onClick={() => updateQuantity(product.IdProducto, product.unitType, 1)}>
          <FiPlus />
        </button>
      </div>

      <button className="delete-btn" onClick={() => removeFromCart(product.IdProducto, product.unitType)}>
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;