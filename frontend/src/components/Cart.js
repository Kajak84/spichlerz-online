import React from 'react';
export default function Cart({ cart, updateQty, checkout }) {
  const total = cart.reduce((sum, item) => {
    const modifiersTotal = item.modifiers ? item.modifiers.reduce((s,m)=>s+m.price,0):0;
    return sum + (item.price + modifiersTotal)*item.qty;
  }, 0);

  return (
    <div className="cart">
      <h2>Koszyk</h2>
      {cart.map((item,index)=>(
        <div key={index}>
          <b>{item.name}</b> x {item.qty}
          {item.modifiers && item.modifiers.length>0 && (<div>Dodatki: {item.modifiers.map(m=>m.name).join(', ')}</div>)}
          <input type="number" value={item.qty} min="1" onChange={e=>updateQty(item.id,parseInt(e.target.value))} />
        </div>
      ))}
      <h3>Łącznie: {total.toFixed(2)} zł</h3>
      <button onClick={checkout}>Zamów</button>
    </div>
  );
}
