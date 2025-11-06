import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import "../../../styles/back-office/clients.css"; // Importez le CSS qui contient les styles de formulaire

const AjouterClientModal = ({ show, clientToEdit, onClose, onSave }) => {
   const [clientData, setClientData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const isEditing = clientToEdit !== null && clientToEdit !== undefined;

  // Met à jour l'état du formulaire lorsque le client à éditer change (ou est réinitialisé à null)
  useEffect(() => {
    if (clientToEdit) {
      setClientData(clientToEdit);
    } else {
      // Réinitialise pour la création
      setClientData({ nom: '', prenom: '', email: '', telephone: '', adresse: '' });
    }
  }, [clientToEdit]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(clientData, isEditing); // Appelle la fonction de sauvegarde passée par le parent
    onClose(); // Ferme la modale après sauvegarde
  };

  return (
    <div className="modal-overlay"> {/* Utilisation d'une classe globale pour l'overlay */}
      <div className="client-form-card"> {/* Réutilisation du style de carte/formulaire */}
        <div className="modal-header-bo">
            <h2 className="modal-titre-bo">
                {isEditing ? `Modifier Client #${clientToEdit.id}` : 'Créer un Nouveau Client'}
            </h2>
            <button 
                className="btn-fermer-modal-bo" 
                onClick={onClose}
            >
                <FaTimes />
            </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Form groups (utilisant les styles de client.css) */}
          <div className="form-group">
            <label htmlFor="prenom" className="form-label">Prénom</label>
            <input type="text" id="prenom" name="prenom" value={clientData.prenom} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input type="text" id="nom" name="nom" value={clientData.nom} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" name="email" value={clientData.email} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="telephone" className="form-label">Téléphone</label>
            <input type="tel" id="telephone" name="telephone" value={clientData.telephone} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="adresse" className="form-label">Adresse Complète</label>
            <textarea id="adresse" name="adresse" value={clientData.adresse} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterClientModal;