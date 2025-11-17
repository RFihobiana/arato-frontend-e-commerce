import React from 'react';
import ChangePasswordAdmin from './ChangePasswordAdmin'; // Import de votre composant existant
import "../../../styles/back-office/ChangePasswordModal.css";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    // Fermer le modal après un changement réussi
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Changer le mot de passe</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
       
        <div className="modal-body">
          <ChangePasswordAdmin onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;