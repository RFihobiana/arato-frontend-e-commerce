import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import ClientModal from "./AjouterClientModal";
import { usePagination } from "../../../pages/hooks/hooks";
import '../../../styles/front-office/Accueil/Pagination.css';
import "../../../styles/back-office/clients.css";

const Clients = () => {
  const [clientsData, setClientsData] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Alice",
      email: "alice.dupont@mail.fr",
      commandes: 5,
      dateInscription: "2024-01-15",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Bernard",
      email: "b.martin@mail.fr",
      commandes: 12,
      dateInscription: "2023-11-20",
    },
    {
      id: 3,
      nom: "Petit",
      prenom: "Claire",
      email: "claire.petit@mail.fr",
      commandes: 1,
      dateInscription: "2024-05-01",
    },
  ]);

  // État pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null); // Contient les données du client à éditer ou null pour la création

  const handleOpenCreate = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleSaveClient = (client, isEditing) => {
    // Logique de sauvegarde CRUD (Appel API ici)
    console.log(
      `Action de sauvegarde : ${isEditing ? "Mise à jour" : "Création"}`,
      client
    );
    // Ici, vous feriez l'appel API, puis mettez à jour l'état `clientsData` si succès.

    // Exemple de mise à jour simple de l'état local pour démonstration
    if (isEditing) {
      setClientsData(clientsData.map((c) => (c.id === client.id ? client : c)));
    } else {
      const newId = Math.max(...clientsData.map((c) => c.id)) + 1;
      setClientsData([
        ...clientsData,
        {
          ...client,
          id: newId,
          commandes: 0,
          dateInscription: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      console.log(`Supprimer client ${id}`);
      // Logique de suppression (Appel API)
      setClientsData(clientsData.filter((c) => c.id !== id));
    }
  };

  const { currentRows: clientsDataRows, goToPage, currentPage, totalPages } = usePagination(clientsData, 5);

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="clients-title">Gestion des Clients</h1>
        <button
          className="btn-add-client"
          onClick={handleOpenCreate} // Ouvre la modale pour la création
        >
          <FaUserPlus />
          Ajouter Client
        </button>
      </div>

      <div className="clients-card">
        {/* ... (Barre de filtre) ... */}

        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Commandes</th>
                <th>Inscrit depuis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clientsDataRows.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td className="client-name">
                    {client.prenom} {client.nom}
                  </td>
                  <td className="client-email">{client.email}</td>
                  <td>{client.commandes}</td>
                  <td>{client.dateInscription}</td>
                  <td className="client-actions">
                    <button
                      className="btn-action-edit"
                      onClick={() => handleOpenEdit(client)} // Ouvre la modale pour l'édition
                    >
                      Éditer
                    </button>
                    <button
                      className="btn-action-delete"
                      onClick={() => handleDelete(client.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`pagination-btn ${currentPage === 1 ? '' : 'active'}`}
            >&lt;</button>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`pagination-btn ${currentPage === totalPages ? '' : 'active'}`}
            >&gt;</button>
          </div>
        </div>
      </div>

      {/* Intégration de la Modale */}
      <ClientModal
        show={isModalOpen}
        clientToEdit={clientToEdit}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default Clients;