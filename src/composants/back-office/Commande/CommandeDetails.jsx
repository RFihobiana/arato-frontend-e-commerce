import React from "react";
import { useParams } from "react-router-dom";
import "../../../styles/back-office/commandes.css";

const CommandeDetails = () => {
  const { id } = useParams();

  const commande = {
    numCommande: id,
    client: "John Doe",
    date: "2025-11-05",
    statut: "Livré",
    produits: [
      { nom: "Produit A", quantite: 2, prix: 100 },
      { nom: "Produit B", quantite: 1, prix: 200 },
    ],
  };

  return (
    <div className="details-container">
      <h2>Détails de la commande {commande.numCommande}</h2>
      <p><strong>Client :</strong> {commande.client}</p>
      <p><strong>Date :</strong> {commande.date}</p>
      <p><strong>Statut :</strong> {commande.statut}</p>
      <h3>Produits</h3>
      <table className="table-produits">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {commande.produits.map((p, index) => (
            <tr key={index}>
              <td>{p.nom}</td>
              <td>{p.quantite}</td>
              <td>{p.prix} Ar</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeDetails;
