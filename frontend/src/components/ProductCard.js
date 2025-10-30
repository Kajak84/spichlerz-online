import React from 'react';
export default function ProductCard({ product, onAdd, onCustomize }) {
  return (
    <div className="product-card">
      <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} zł</p>
      <button onClick={() => onAdd(product)}>Dodaj</button>
      <button onClick={() => onCustomize(product)}>Dostosuj</button>
    </div>
  );
}
