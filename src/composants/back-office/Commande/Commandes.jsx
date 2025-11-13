import React, { useState, useEffect } from "react";
import "../../../styles/back-office/commandes.css";
import { Link } from "react-router-dom";
import { usePagination } from "../../../pages/hooks/hooks";

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);

  const { currentRows, currentPage, totalPages, goToPage } = usePagination(
    commandes,
    5
  );

  useEffect(() => {
    const data = [
      {
        id: 1,
        numCommande: "CMD001",
        client: "John Doe",
        date: "2025-11-05",
        statut: "Livré",
      },
      {
        id: 2,
        numCommande: "CMD002",
        client: "Jane Smith",
        date: "2025-11-04",
        statut: "En cours",
      },
      {
        id: 3,
        numCommande: "CMD003",
        client: "Ali Baba",
        date: "2025-11-03",
        statut: "Annulé",
      },
    ];
    setCommandes(data);
  }, []);

  return (
    <div className="commandes-container">
      <h2>Liste des Commandes</h2>
      <table className="table-commandes">
        <thead>
          <tr>
            <th>N° Commande</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((cmd) => (
            <tr key={cmd.id}>
              <td>{cmd.numCommande}</td>
              <td>{cmd.client}</td>
              <td>{cmd.date}</td>
              <td>{cmd.statut}</td>
              <td>
                <Link
                  to={`/admin/commandes/${cmd.numCommande}`}
                  className="btn-voir"
                >
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          &lt;
        </button>

        <button className={`pagination-btn active`}>{currentPage}</button>

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Commandes;