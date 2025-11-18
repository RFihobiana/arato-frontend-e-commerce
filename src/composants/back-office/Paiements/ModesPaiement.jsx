import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchModes, createMode, updateMode, deleteMode } from "../../../services/paiementService";

const ModesPaiement = () => {
  const [modes, setModes] = useState([]);
  const [form, setForm] = useState({
    nomModePaiement: "",
    actif: true,
    config: {},
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadModes();
  }, []);

  const loadModes = async () => {
    try {
      const data = await fetchModes();
      setModes(data);
    } catch (error) {
      console.error("Erreur chargement modes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomModePaiement.trim()) {
      alert("Le nom du mode de paiement est obligatoire !");
      return;
    }

    try {
      const submitData = {
        ...form,
        actif: Boolean(form.actif)
      };

      if (editingId) {
        await updateMode(editingId, submitData);
        alert("Mode de paiement mis à jour !");
      } else {
        await createMode(submitData);
        alert("Nouveau mode de paiement ajouté !");
      }
      setForm({ nomModePaiement: "", actif: true, config: {}, image: null });
      setEditingId(null);
      loadModes();
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (mode) => {
    setForm({
      nomModePaiement: mode.nomModePaiement || "",
      actif: Boolean(mode.actif),
      config: mode.config || {},
      image: null
    });
    setEditingId(mode.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce mode de paiement ?")) return;
    try {
      await deleteMode(id);
      loadModes();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredModes = modes.filter((mode) => {
    const s = search.toLowerCase();
    return (
      mode.nomModePaiement?.toLowerCase().includes(s) ||
      mode.id?.toString().includes(s)
    );
  });

  return (
    <div className="frais-container">
      <div className="frais-header">
        <h2>Gestion des Modes de Paiement</h2>
      </div>

      <form onSubmit={handleSubmit} className="frais-form">
        <div className="form-group">
          <label>Nom du mode de paiement *</label>
          <input
            type="text"
            name="nomModePaiement"
            value={form.nomModePaiement}
            onChange={handleChange}
            placeholder="Ex: Carte Bancaire, PayPal..."
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="actif"
              checked={form.actif}
              onChange={handleChange}
            />
            Actif
          </label>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">
          {editingId ? "Modifier" : "Ajouter"}
        </button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={() => setEditingId(null)}>
            Annuler
          </button>
        )}
      </form>

      <div className="frais-search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher un mode de paiement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button className="btn-clear" onClick={() => setSearch("")}>✕ Effacer</button>}
      </div>

      <table className="frais-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nom du mode</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredModes.map((mode) => (
            <tr key={mode.id}>
              <td>
                {mode.image ? (
                  <img 
                    src={`/storage/${mode.image}`} 
                    alt={mode.nomModePaiement}
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>{mode.nomModePaiement || "Non défini"}</td>
              <td>{mode.actif ? "🟢 Actif" : "🔴 Inactif"}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(mode)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(mode.id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {filteredModes.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#777" }}>
                {search ? "Aucun mode de paiement trouvé" : "Aucun mode de paiement enregistré"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ModesPaiement;