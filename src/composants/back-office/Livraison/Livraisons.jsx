import React, { useEffect, useState } from "react";
import { fetchLivraisons, deleteLivraison } from "../../../services/livraisonService";
import LivraisonModal from "./LivraisonModal";
import { FaPlus, FaTruck, FaSearch } from "react-icons/fa";
import "../../../styles/back-office/livraison.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Livraisons = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    const data = await fetchLivraisons();
    setLivraisons(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = livraisons.filter((l) =>
    [l.numCommande, l.transporteur, l.referenceColis]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="livraison-container">
      <div className="livraison-header">
        <h2><FaTruck /> Gestion des Livraisons</h2>
        <div className="livraison-tabs">
          <button className="tab-active">Livraisons</button>
          <button onClick={() => navigate("/admin/livraisons/frais")}>Frais de livraison</button>
          <button onClick={() => navigate("/admin/livraisons/lieux")}>Lieux de livraison</button>
        </div>
      </div>

      <div className="livraison-search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher par commande, transporteur ou référence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Nouvelle Livraison
        </button>
      </div>

      <table className="livraison-table">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Transporteur</th>
            <th>Référence</th>
            <th>Lieu</th>
            <th>Dates</th>
            <th>Poids (kg)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l.numLivraison}>
              <td>{l.numCommande}</td>
              <td>{l.transporteur}</td>
              <td>{l.referenceColis}</td>
              <td>{l.lieuLivraison}</td>
              <td>
                <div>Exp: {l.dateExpedition}</div>
                <div>Liv: {l.dateLivraison}</div>
              </td>
              <td>{l.poidsTotal}</td>
              <td>
                <button className="btn-edit">✏️</button>
                <button
                  className="btn-delete"
                  onClick={ async () => {
                    if ((await Swal.fire({title: "Supprimer cette livraison ?", showDenyButton: true})).isConfirmed)
                      deleteLivraison(l.numLivraison).then(loadData);
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <LivraisonModal onClose={() => setIsModalOpen(false)} onSave={loadData} />
      )}
    </div>
  );
};

export default Livraisons;