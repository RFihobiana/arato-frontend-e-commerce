import React, { useState, useEffect } from "react";
import { fetchFrais, createFrais, updateFrais, deleteFrais } from "../../../services/livraisonService";
import "../../../styles/back-office/fraisLivraison.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    try {
      const data = await fetchFrais();
      setFraisList(data);
    } catch (err) {
      console.error("Erreur lors du chargement des frais :", err);
      setFraisList([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.poidsMin || !form.poidsMax || !form.frais) {
    toast("Tous les champs sont obligatoires !");
    return;
  }

  const poidsMin = parseFloat(form.poidsMin);
  const poidsMax = parseFloat(form.poidsMax);
  const fraisValue = parseFloat(form.frais);

  if (poidsMax <= poidsMin) {
    toast("Le poids max doit être supérieur au poids min !");
    return;
  }

  const poids = fraisList.some(item => {
    if (editingId && (item.id === editingId || item.numFrais === editingId)) return false;
    return (poidsMin <= item.poidsMax && poidsMax >= item.poidsMin);
  });

  if (poids) {
    toast("ce poids existe deja !");
    return;
  }

  const fraisExist = fraisList.some(item => {
    if (editingId && (item.id === editingId || item.numFrais === editingId)) return false;
    return item.frais === fraisValue;
  });

  if (fraisExist) {
    toast("Ce montant de frais existe déjà !");
    return;
  }

  const payload = { poidsMin, poidsMax, frais: fraisValue };

  try {
    if (editingId) {
      await updateFrais(editingId, payload);
      toast("Tranche mise à jour !");
    } else {
      await createFrais(payload);
      toast.success("Nouvelle tranche ajoutée !");
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
    setEditingId(item.id || item.numFrais);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette tranche ?")) return;
    try {
      await deleteFrais(id);
      loadFrais();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredFrais = fraisList.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.poidsMin.toString().includes(s) ||
      item.poidsMax.toString().includes(s) ||
      item.frais.toString().includes(s)
    );
  });

  return (
    <div className="frais-container">
      <div className="frais-header">
        <h2>Gestion des Frais de Livraison</h2>
        <div className="livraison-tabs">
          <button className="tab-inactive" onClick={() => navigate("/admin/livraisons")}>Livraisons</button>
          <button className="tab-active">Frais de livraison</button>
          <button className="tab-inactive" onClick={() => navigate("/admin/livraisons/lieux")}>Lieux de livraison</button>
        </div>
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
            <tr key={item.id || item.numFrais}>
              <td>{item.id || item.numFrais}</td>
              <td>{item.poidsMin}</td>
              <td>{item.poidsMax}</td>
              <td>{item.frais}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(item)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(item.id || item.numFrais)}>🗑️</button>
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
