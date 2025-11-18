import React, { useState, useEffect } from "react";
import { fetchLieux, createLieu, updateLieu, deleteLieu } from "../../../services/livraisonService";
import "../../../styles/back-office/fraisLivraison.css";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const LieuxLivraison = () => {
  const [lieuxList, setLieuxList] = useState([]);
  const [form, setForm] = useState({ nomLieu: "", fraisLieu: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLieux();
  }, []);

  const loadLieux = async () => {
    try {
      const data = await fetchLieux();
      setLieuxList(data);
    } catch (err) {
      console.error("Erreur lors du chargement des lieux :", err);
      setLieuxList([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkDuplicate = (nomLieu) => {
    return lieuxList.some(
      (lieu) =>
        lieu.nomLieu.toLowerCase() === nomLieu.toLowerCase() &&
        lieu.numLieu !== editingId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomLieu || form.fraisLieu === "") {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    if (checkDuplicate(form.nomLieu)) {
      alert("Ce nom de lieu existe déjà !");
      return;
    }

    const payload = {
      nomLieu: form.nomLieu,
      fraisLieu: parseFloat(form.fraisLieu),
    };

    try {
      if (editingId) {
        await updateLieu(editingId, payload);
        alert("Lieu mis à jour !");
      } else {
        await createLieu(payload);
        alert("Nouveau lieu ajouté !");
      }
      setForm({ nomLieu: "", fraisLieu: "" });
      setEditingId(null);
      loadLieux();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement. Vérifiez que le nom du lieu n'existe pas déjà.");
    }
  };

  const handleEdit = (item) => {
    setForm({ nomLieu: item.nomLieu, fraisLieu: item.fraisLieu });
    setEditingId(item.numLieu);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce lieu de livraison ?")) return;
    try {
      await deleteLieu(id);
      loadLieux();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredLieux = lieuxList.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.nomLieu.toLowerCase().includes(s) ||
      item.fraisLieu.toString().includes(s)
    );
  });

  return (
    <div className="frais-container">
      <div className="frais-header">
        <h2><FaMapMarkerAlt /> Gestion des Lieux de Livraison</h2>
        <div className="livraison-tabs">
          <button className="tab-inactive" onClick={() => navigate("/admin/livraisons")}>Livraisons</button>
          <button className="tab-inactive" onClick={() => navigate("/admin/livraisons/frais")}>Frais de livraison</button>
          <button className="tab-active">Lieux de livraison</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="frais-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nom du Lieu</label>
            <input type="text" name="nomLieu" value={form.nomLieu} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Frais (Ar)</label>
            <input type="number" name="fraisLieu" value={form.fraisLieu} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn-save">
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      <div className="frais-search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher par lieu ou frais..."
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
            <th>Nom du Lieu</th>
            <th>Frais (Ar)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLieux.map((item) => (
            <tr key={item.numLieu}>
              <td>{item.numLieu}</td>
              <td>{item.nomLieu}</td>
              <td>{item.fraisLieu}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(item)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(item.numLieu)}>🗑️</button>
              </td>
            </tr>
          ))}
          {filteredLieux.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#777" }}>
                {search ? "Aucun résultat trouvé" : "Aucun lieu enregistré"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LieuxLivraison;
