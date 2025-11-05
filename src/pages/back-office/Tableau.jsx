import React, { useState } from "react";
import SideBar from "../../composants/back-office/SideBar";
import TableauDeBord from "../../composants/back-office/TableauDeBord";

const Produits = () => <div className="conteneur"><h1>Gestion des Produits</h1></div>;
const Promotion = () => <div className="conteneur"><h1>Gestion des Promotions</h1></div>;
const Articles = () => <div className="conteneur"><h1>Gestion des Articles</h1></div>;
const Paiement = () => <div className="conteneur"><h1>Suivi des Paiements</h1></div>;
const Commandes = () => <div className="conteneur"><h1>Liste des Commandes</h1></div>;
const Clients = () => <div className="conteneur"><h1>Liste des Clients</h1></div>;

const Tableau = () => {
  const [activePage, setActivePage] = useState("Tableau de bord");

  const renderContent = () => {
    switch (activePage) {
      case "Tableau de bord":
        return <TableauDeBord />;
      case "Produits":
        return <Produits />;
      case "Promotion":
        return <Promotion />;
      case "Articles":
        return <Articles />;
      case "Paiement":
        return <Paiement />;
      case "Commandes":
        return <Commandes />;
      case "Clients":
        return <Clients />;
      default:
        return <TableauDeBord />;
    }
  };

  return (
    <div className="dashboard-layout">
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Tableau;
