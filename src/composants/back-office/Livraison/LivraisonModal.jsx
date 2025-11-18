import React, { useState, useEffect } from "react";

import { fetchFrais,createLivraison} from "../../../services/livraisonService";
import "../../../styles/back-office/livraisonModal.css";
import { toast } from "react-toastify";

const LivraisonModal = ({ onClose, onSave, livraisonAEditer }) => {
  const [form, setForm] = useState({
    numCommande: "",
    transporteur: "",
    referenceColis: "",
    lieuLivraison: "",
    dateExpedition: "",
    dateLivraison: "",
    poidsTotal: "",
    fraisLivraison: "",
  });

  const [fraisTranches, setFraisTranches] = useState([]);

  // Charger les tranches de frais
  useEffect(() => {
    fetchFrais().then((data) => setFraisTranches(data));
  }, []);

  // Remplir le formulaire si on édite
  useEffect(() => {
    if (livraisonAEditer) setForm(livraisonAEditer);
  }, [livraisonAEditer]);

  // Calcul automatique du frais selon le poids
  useEffect(() => {
    if (!form.poidsTotal || fraisTranches.length === 0) return;

    const poids = parseFloat(form.poidsTotal);
    const tranche = fraisTranches.find(
      (f) => poids >= f.poidsMin && poids <= f.poidsMax
    );

    if (tranche) {
      setForm((prev) => ({ ...prev, fraisLivraison: tranche.frais }));
    } else {
      setForm((prev) => ({ ...prev, fraisLivraison: "Hors tranche" }));
    }
  }, [form.poidsTotal, fraisTranches]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLivraison(form);
      toast.success("Livraison enregistrée avec succès !");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-livraison">
        <h3>Nouvelle Livraison</h3>
        <form onSubmit={handleSubmit} className="livraison-form">
          <div className="form-group">
            <label>Numéro Commande</label>
            <input
              name="numCommande"
              value={form.numCommande}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Transporteur</label>
            <input
              name="transporteur"
              value={form.transporteur}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Référence Colis</label>
            <input
              name="referenceColis"
              value={form.referenceColis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lieu Livraison</label>
            <input
              name="lieuLivraison"
              value={form.lieuLivraison}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date Expédition</label>
              <input
                type="date"
                name="dateExpedition"
                value={form.dateExpedition}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date Livraison</label>
              <input
                type="date"
                name="dateLivraison"
                value={form.dateLivraison}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Poids total (kg)</label>
              <input
                type="number"
                name="poidsTotal"
                value={form.poidsTotal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Frais de livraison (automatique)</label>
              <input
                type="text"
                name="fraisLivraison"
                value={form.fraisLivraison}
                readOnly
                className="readonly"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">💾 Enregistrer</button>
            <button type="button" className="btn-cancel" onClick={onClose}>❌ Fermer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivraisonModal;
