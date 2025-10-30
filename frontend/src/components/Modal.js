import React from 'react';
export default function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );
}
