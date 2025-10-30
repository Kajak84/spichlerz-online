import React, { useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && JSON.stringify(item.modifiers) === JSON.stringify(product.modifiers || []));
      if (existing) return prev.map(item => item === existing ? {...item, qty: item.qty + 1} : item);
      return [...prev, {...product, qty: 1}];
    });
  };

  const updateQty = (id, qty) => setCart(prev => prev.map(item => item.id === id ? {...item, qty} : item));

  const checkout = () => {
    const total = cart.reduce((sum, item) => {
      const modifiersTotal = item.modifiers ? item.modifiers.reduce((s, m) => s + m.price, 0) : 0;
      return sum + (item.price + modifiersTotal) * item.qty;
    }, 0);

    fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total })
    })
      .then(res => res.json())
      .then(data => alert(`Zamówienie złożone! ID: ${data.orderId}`));
  };

  return (
    <div>
      <h1>Spichlerz z Fantazją</h1>
      <Menu addToCart={addToCart} />
      <Cart cart={cart} updateQty={updateQty} checkout={checkout} />
    </div>
  );
}

export default App;

