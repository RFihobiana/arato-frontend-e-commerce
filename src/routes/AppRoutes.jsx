import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// front-office
import Accueil from "../pages/front-office/Accueil";
import Actualite from "../pages/front-office/Actualite";
import ActualiteDetails from "../pages/front-office/ActualiteDetails";
import Panier from "../pages/front-office/Panier";
import Produit from "../pages/front-office/Produit";
import SuiviCommande from "../pages/front-office/SuiviCommande";
import SuiviLivraison from "../pages/front-office/SuiviLivraison";
import Profil from "../pages/front-office/Profil"; 

// back-office
import TableauDeBord from "../pages/back-office/Tableau";
import TousLesProduits from "../pages/back-office/Produit/TousLesProduits";
import AjouterProduit from "../pages/back-office/Produit/AjoutProduit";
import ModifierProduit from "../pages/back-office/Produit/ModifierProduit";
import ListeCommande from "../pages/back-office/Commande/ListeCommande";
import DetailsCommande from "../pages/back-office/Commande/DetailsCommande";
import TousLesClient from "../pages/back-office/TousLesClient";
import ProduitEnPromotion from "../pages/back-office/Promotion/ProduitEnPromotion";
import ProfilAdmin from "../pages/back-office/Profil";
import PaiementStat from "../pages/back-office/Paiement";
import AjoutActualite from "../pages/back-office/Actualite/AjoutActualite";
import ModifierActualite from "../pages/back-office/Actualite/ModifierActualite";
import TousLesActualite from "../pages/back-office/Actualite/TousLesActualite";

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

        <Route path="/admin" element={<TableauDeBord />} />

        {/* Produits */}
        <Route path="/admin/produits" element={<TousLesProduits />} />
        <Route path="/admin/produits/ajouter" element={<AjouterProduit />} />
        <Route path="/admin/produits/modifier/:id" element={<ModifierProduit />} />
        <Route path="/admin/promotion" element={<ProduitEnPromotion />} />

        {/* Commandes */}
        <Route path="/admin/commandes" element={<ListeCommande />} />
        <Route path="/admin/commandes/:id" element={<DetailsCommande />} />

        {/* Actualités */}
        <Route path="/admin/actualites" element={<TousLesActualite />} />
        <Route path="/admin/actualites/ajouter" element={<AjoutActualite />} />
        <Route path="/admin/actualites/modifier/:id" element={<ModifierActualite />} />

        {/* Autres pages admin */}
        <Route path="/admin/clients" element={<TousLesClient />} />
        <Route path="/admin/profil" element={<ProfilAdmin />} />
        <Route path="/admin/paiements" element={<PaiementStat />} />
      </Routes>
    </Router>
  );
}
