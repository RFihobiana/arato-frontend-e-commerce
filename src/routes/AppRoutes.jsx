import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// FRONT-OFFICE
import Accueil from "../pages/front-office/Accueil";
import Actualite from "../pages/front-office/Actualite";
import ActualiteDetails from "../pages/front-office/ActualiteDetails";
import Panier from "../pages/front-office/Panier";
import Produit from "../pages/front-office/Produit";
import SuiviCommande from "../pages/front-office/SuiviCommande";
import SuiviLivraison from "../pages/front-office/SuiviLivraison";
import Profil from "../pages/front-office/Profil";

// BACK-OFFICE
import TableauLayout from "../pages/back-office/TableauLayout";
import TableauDeBord from "../composants/back-office/TableauDeBord";
import Produits from "../composants/back-office/Produits/Produits";
import Paiement from "../composants/back-office/Paiements/paiements";
import Promotion from "../composants/back-office/Promotion/promotion";
import Articles from "../composants/back-office/Article/articles";
import Commandes from "../composants/back-office/Commande/Commandes";
import  CommandeDetails from "../composants/back-office/Commande/CommandeDetails";
import Clients from "../composants/back-office/Client/Clients"; 
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* -------- FRONT-OFFICE -------- */}
        <Route path="/" element={<Accueil />} />
        <Route path="/actualite" element={<Actualite />} />
        <Route path="/actualite/:id" element={<ActualiteDetails />} />
        <Route path="/produit" element={<Produit />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/commandes" element={<SuiviCommande />} />
        <Route path="/livraisons/:id" element={<SuiviLivraison />} />
        <Route path="/profil" element={<Profil />} />

        <Route path="/admin" element={<TableauLayout />}>
          <Route index element={<TableauDeBord />} />
  <Route path="produits" element={<Produits />} />
  <Route path="articles" element={<Articles />} />
  <Route path="commandes" element={<Commandes />} />
  <Route path="commandes/:id" element={<CommandeDetails />} />
  <Route path="paiement" element={<Paiement />} />
  <Route path="promotion" element={<Promotion />} />
  <Route path="clients" element={<Clients />} />
        </Route>
      </Routes>
    </Router>
  );
}
