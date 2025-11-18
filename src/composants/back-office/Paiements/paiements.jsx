import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaPlus, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaClock, 
  FaTimes,
  FaChartLine,
  FaDownload,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import "../../../styles/back-office/paiements.css";
import PaiementModal from "./PaiementModal";
import ModePaiementModal from "./ModePaiementModal";
import { 
  fetchPaiements, 
  createPaiement, 
  updatePaiement, 
  deletePaiement, 
  fetchModes, 
  createMode, 
  updateMode, 
  deleteMode 
} from "../../../services/paiementService";

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [modes, setModes] = useState([]);
  const [search, setSearch] = useState("");
  const [isPaiementModalOpen, setIsPaiementModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [editingPaiementId, setEditingPaiementId] = useState(null);
  const [editingModeId, setEditingModeId] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    failedPayments: 0
  });
  const navigate = useNavigate();

  const loadPaiements = async () => {
    try {
      const data = await fetchPaiements();
      setPaiements(data);
      calculateStats(data);
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
    }
  };

  const loadModes = async () => {
    try {
      const data = await fetchModes();
      setModes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des modes:", error);
    }
  };

  const calculateStats = (paiementsData) => {
    const totalRevenue = paiementsData
      .filter(p => p.statut === "effectué")
      .reduce((sum, p) => sum + p.montantApayer, 0);
    
    const pendingPayments = paiementsData.filter(p => p.statut === "en attente").length;
    const failedPayments = paiementsData.filter(p => p.statut === "échoué").length;

    setStats({
      totalRevenue,
      pendingPayments,
      failedPayments
    });
  };

  useEffect(() => {
    loadPaiements();
    loadModes();
  }, []);

  const filteredPaiements = paiements.filter(p =>
    [p.numPaiement, p.commande.numCommande, p.commande.utilisateur.nom, p.commande.utilisateur.email]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredModes = modes.filter(m =>
    m.nomMode.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleUpdateStatut = (numPaiement) => {
        toast(`Action: Modifier le statut du paiement #${numPaiement} (Appel à PaiementController@update)`);
         };

    const handleDeletePaiement = async (id) => {
        if ((await Swal.fire("Êtes-vous sûr de vouloir supprimer ce paiement ?")).isConfirmed) {
          try {
            await deletePaiement(id);
            await loadPaiements();
            toast.success(`Paiement #${id} supprimé.`);
          } catch (error) {
            toast.error("Erreur lors de la suppression du paiement");
          }
        }
    };

  const handleDeleteMode = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce mode de paiement ?")) return;
    try {
      await deleteMode(id);
      await loadModes();
    } catch (error) {
      alert("Erreur lors de la suppression du mode de paiement");
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "effectué":
        return "status-badge status-success";
      case "en attente":
        return "status-badge status-pending";
      case "échoué":
        return "status-badge status-failed";
      default:
        return "status-badge";
    }
  };



  return (
    <div className="paiements-container">
      {/* En-tête */}
      <div className="paiements-header">
        <h2>
          <FaCreditCard /> Gestion des Paiements
        </h2>
        <div className="paiements-tabs">
          <button className="tab-active">Tableau de bord</button>
          <button onClick={() => navigate("/admin/paiements/historique")}>Historique complet</button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-label">Revenu Total</div>
          <div className="stat-value">
            {stats.totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
          <div className="stat-change positive">
            <FaChartLine /> 
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-label">Paiements en Attente</div>
          <div className="stat-value">{stats.pendingPayments}</div>
          <div className="stat-change">
            <FaClock /> Nécessitent une attention
          </div>
        </div>
        
        <div className="stat-card failed">
          <div className="stat-label">Paiements Échoués</div>
          <div className="stat-value">{stats.failedPayments}</div>
          <div className="stat-change negative">
            <FaTimes /> 
          </div>
        </div>
      </div>

      {/* Barre de recherche et actions */}
      <div className="paiements-search-bar">
        <div className="search-input">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher un paiement, client, email ou commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => { setEditingPaiementId(null); setIsPaiementModalOpen(true); }}
        >
          <FaPlus /> Nouveau Paiement
        </button>
        
        <button 
          className="btn-secondary"
          onClick={() => { setEditingModeId(null); setIsModeModalOpen(true); }}
        >
          <FaMoneyBillWave /> Nouveau Mode
        </button>
        

      </div>

      {/* Section Paiements Récents */}
      <div className="table-section">
        <div className="table-header">
          <h3>Paiements Récents</h3>
          <span className="text-muted">{filteredPaiements.length} paiement(s)</span>
        </div>
        
        <div className="table-wrapper">
          <table className="paiements-table">
            <thead>
              <tr>
                <th>ID Paiement</th>
                <th>Client</th>
                <th>Commande</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaiements.slice(0, 10).map(p => (
                <tr key={p.numPaiement}>
                  <td className="paiement-id">#{p.numPaiement}</td>
                  <td>
                    <div className="client-name">
                      {p.commande.utilisateur.prenom} {p.commande.utilisateur.nom}
                    </div>
                    <div className="client-email">
                      {p.commande.utilisateur.email}
                    </div>
                  </td>
                  <td className="paiement-commande-id">#{p.commande.numCommande}</td>
                  <td>
                    {new Date(p.datePaiement).toLocaleDateString("fr-FR")}
                    <div className="paiement-heure">
                      {new Date(p.datePaiement).toLocaleTimeString("fr-FR", { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="paiement-montant">
                    {p.montantApayer.toLocaleString("fr-FR", { 
                      style: "currency", 
                      currency: "EUR" 
                    })}
                  </td>
                  <td>{p.mode_paiement.nomMode}</td>
                  <td>
                    <span className={getStatusBadge(p.statut)}>
                      {p.statut}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="action-btn edit"
                        onClick={() => { 
                          setEditingPaiementId(p.numPaiement); 
                          setIsPaiementModalOpen(true); 
                        }}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeletePaiement(p.numPaiement)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredPaiements.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <FaCreditCard />
                    <div>
                      {search ? "Aucun paiement trouvé" : "Aucun paiement enregistré"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Modes de Paiement */}
      <div className="modes-section">
        <div className="table-header">
          <h3>Modes de Paiement</h3>
          <span className="text-muted">{modes.length} mode(s) disponible(s)</span>
        </div>
        
        <div className="table-wrapper">
          <table className="modes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom du Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModes.map(mode => (
                <tr key={mode.id}>
                  <td>{mode.id}</td>
                  <td>{mode.nomMode}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="action-btn edit"
                        onClick={() => { 
                          setEditingModeId(mode.id); 
                          setIsModeModalOpen(true); 
                        }}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteMode(mode.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredModes.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-state">
                    <FaMoneyBillWave />
                    <div>
                      {search ? "Aucun mode trouvé" : "Aucun mode de paiement configuré"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isPaiementModalOpen && (
        <PaiementModal
          onClose={() => {
            setIsPaiementModalOpen(false);
            setEditingPaiementId(null);
          }}
          onSave={loadPaiements}
          modes={modes}
          editingId={editingPaiementId}
        />
      )}

      {isModeModalOpen && (
        <ModePaiementModal
          onClose={() => {
            setIsModeModalOpen(false);
            setEditingModeId(null);
          }}
          onSave={loadModes}
          editingId={editingModeId}
        />
      )}
    </div>
  );
};

export default Paiements;