import React, { useState, useEffect } from "react";
import { createMode, updateMode, fetchModeById } from "../../../services/paiementService";

const ModePaiementModal = ({ onClose, onSave, editingId }) => {
  const [nomMode, setNomMode] = useState("");

  useEffect(() => {
    if (editingId) {
      fetchModeById(editingId).then(data => setNomMode(data.nomMode));
    }
  }, [editingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomMode) {
      alert("Le nom du mode est obligatoire");
      return;
    }
    try {
      if (editingId) {
        await updateMode(editingId, { nomMode });
        alert("Mode mis à jour !");
      } else {
        await createMode({ nomMode });
        alert("Nouveau mode ajouté !");
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du mode de paiement");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingId ? "Modifier Mode de Paiement" : "Nouveau Mode de Paiement"}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom du mode</label>
            <input type="text" value={nomMode} onChange={(e) => setNomMode(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button type="submit">{editingId ? "Mettre à jour" : "Ajouter"}</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModePaiementModal;
