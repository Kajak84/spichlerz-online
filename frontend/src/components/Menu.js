import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Modal from './Modal';

export default function Menu({ addToCart }) {
  const [menu, setMenu] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);

  useEffect(() => { fetch('http://localhost:3001/menu').then(res=>res.json()).then(data=>setMenu(data)); }, []);

  const customizeProduct = (product) => {
    setSelectedProduct(product);
    fetch(`http://localhost:3001/modifiers/${product.id}`).then(res=>res.json()).then(data=>setModifiers(data));
    setSelectedModifiers([]);
  };

  const toggleModifier = (mod) => setSelectedModifiers(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);
  const addCustomizedProduct = () => { addToCart({ ...selectedProduct, modifiers: selectedModifiers }); setSelectedProduct(null); };

  return (
    <div className="menu">
      {menu.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} onCustomize={customizeProduct} />)}
      <Modal show={selectedProduct} onClose={()=>setSelectedProduct(null)}>
        {selectedProduct && <div>
          <h3>Dodatki do {selectedProduct.name}</h3>
          {modifiers.map(mod=>(
            <div key={mod.id}>
              <input type="checkbox" checked={selectedModifiers.includes(mod)} onChange={()=>toggleModifier(mod)} />
              <span>{mod.name} (+{mod.price} zł)</span>
            </div>
          ))}
          <button onClick={addCustomizedProduct}>Dodaj do koszyka</button>
        </div>}
      </Modal>
    </div>
  );
}
