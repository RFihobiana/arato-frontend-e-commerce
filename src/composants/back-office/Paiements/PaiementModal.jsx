import React, { useState, useEffect } from "react";
import { createPaiement, updatePaiement, fetchPaiementById } from "../../../services/paiementService";

const PaiementModal = ({ onClose, onSave, modes, editingId }) => {
  const [form, setForm] = useState({
    numCommande: "",
    montantApayer: "",
    modePaiementId: "",
    statut: "en attente"
  });

  useEffect(() => {
    if (editingId) {
      fetchPaiementById(editingId).then(data => {
        setForm({
          numCommande: data.numCommande,
          montantApayer: data.montantApayer,
          modePaiementId: data.mode_paiement.id,
          statut: data.statut
        });
      });
    }
  }, [editingId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.numCommande || !form.montantApayer || !form.modePaiementId) {
      alert("Tous les champs sont obligatoires");
      return;
    }
    try {
      if (editingId) {
        await updatePaiement(editingId, form);
        alert("Paiement mis à jour !");
      } else {
        await createPaiement(form);
        alert("Nouveau paiement ajouté !");
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du paiement");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingId ? "Modifier Paiement" : "Nouveau Paiement"}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Numéro de commande</label>
            <input type="text" name="numCommande" value={form.numCommande} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Montant</label>
            <input type="number" name="montantApayer" value={form.montantApayer} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mode de paiement</label>
            <select name="modePaiementId" value={form.modePaiementId} onChange={handleChange} required>
              <option value="">-- Choisir --</option>
              {modes.map(m => (
                <option key={m.id} value={m.id}>{m.nomMode}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange}>
              <option value="effectué">effectué</option>
              <option value="en attente">en attente</option>
              <option value="échoué">échoué</option>
            </select>
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

export default PaiementModal;
