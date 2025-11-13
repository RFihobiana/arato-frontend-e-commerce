import React, { useState, useEffect } from "react";
import { fetchFrais, createFrais, updateFrais, deleteFrais } from "../../../services/livraisonService";
import "../../../styles/back-office/fraisLivraison.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const FraisLivraison = () => {
  const [fraisList, setFraisList] = useState([]);
  const [form, setForm] = useState({ poidsMin: "", poidsMax: "", frais: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadFrais();
  }, []);

  const loadFrais = async () => {
    const data = await fetchFrais();
    console.log("Frais reçus du backend :", data);
    setFraisList(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.poidsMin || !form.poidsMax || !form.frais) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
    try {
      if (editingId) {
        await updateFrais(editingId, form);
        alert("Tranche mise à jour !");
      } else {
        await createFrais(form);
        alert("Nouvelle tranche ajoutée !");
      }
      setForm({ poidsMin: "", poidsMax: "", frais: "" });
      setEditingId(null);
      loadFrais();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleEdit = (item) => {
    setForm({ poidsMin: item.poidsMin, poidsMax: item.poidsMax, frais: item.frais });
    setEditingId(item.numFrais);
  };

  const handleDelete = async (numFrais) => {
    if (!window.confirm("Supprimer cette tranche ?")) return;
    await deleteFrais(numFrais);
    loadFrais();
  };

  // Filtrer les frais selon la recherche
  const filteredFrais = fraisList.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.poidsMin.toString().includes(searchLower) ||
      item.poidsMax.toString().includes(searchLower) ||
      item.frais.toString().includes(searchLower)
    );
  });

  return (
    <div className="frais-container">
      <div className="frais-header">
        <h2>Gestion des frais de livraison</h2>
        <button className="btn-retour" onClick={() => navigate("/admin/livraisons")}>
          ⬅ Retour aux livraisons
        </button>
      </div>

      <form onSubmit={handleSubmit} className="frais-form">
        <div className="form-row">
          <div className="form-group">
            <label>Poids min (kg)</label>
            <input type="number" name="poidsMin" value={form.poidsMin} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Poids max (kg)</label>
            <input type="number" name="poidsMax" value={form.poidsMax} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Frais (Ar)</label>
            <input type="number" name="frais" value={form.frais} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn-save">
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* Barre de recherche */}
      <div className="frais-search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher par poids ou frais..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn-clear" onClick={() => setSearch("")}>
            ✕ Effacer
          </button>
        )}
      </div>

      <table className="frais-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poids min (kg)</th>
            <th>Poids max (kg)</th>
            <th>Frais (Ar)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFrais.map((item) => (
            <tr key={item.numFrais}>
              <td>{item.numFrais}</td>
              <td>{item.poidsMin}</td>
              <td>{item.poidsMax}</td>
              <td>{item.frais}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(item)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(item.numFrais)}>🗑️</button>
              </td>
            </tr>
          ))}
          {filteredFrais.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                {search ? "Aucun résultat trouvé" : "Aucune tranche enregistrée"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FraisLivraison;