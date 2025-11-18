import React, { useState, useEffect } from "react";
import SweetAlert from 'sweetalert2'
import {toast} from 'react-toastify'
import AjouterProduitModal from "./AjouterProduitModal";
import ProduitCard from "./ProduitCard";
import GestionCategories from "./Categorie";
import { fetchProduits, deleteProduit } from 
"../../../services/produitService";
import "../../../styles/back-office/produits.css";

const Produits = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorieFiltre, setCategorieFiltre] = useState(0);
  const [isOnPromoFiltre, setIsOnPromoFiltre] = useState(false);
  const [termeRecherche, setTermeRecherche] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produitAEditer, setProduitAEditer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduits = async () => {
    try {
      setLoading(true);
      const data = await fetchProduits();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Veuillez vous connecter"
          : "Erreur chargement produits"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduits();
  }, []);

   const produitsFiltres = products.filter((produit) => {
    const categorieMatch =
      categorieFiltre === 0 || produit.numCategorie === categorieFiltre;
    const estEnPromotion = !!produit.promotion?.valeur;
    const promoMatch = !isOnPromoFiltre || estEnPromotion;
   const nomProduit = produit.nomProduit ? produit.nomProduit.toLowerCase() : "";
    const descriptionProduit = produit.description ? produit.description.toLowerCase() : "";
    const terme = termeRecherche.trim().toLowerCase();
    
    const rechercheMatch =
      terme === "" ||
      nomProduit.includes(terme) ||
      descriptionProduit.includes(terme);

    return categorieMatch && promoMatch && rechercheMatch;
  });

  const getNomCategorie = (numCategorie) => {
    const cat = categories.find((c) => c.numCategorie === numCategorie);
    return cat ? cat.nomCategorie : "N/A";
  };

  const handleSaveProduit = async (produit) => {
    await loadProduits();
    setProduitAEditer(null);
    setIsModalOpen(false);
  };

  const handleEdit = (produit) => {
    setProduitAEditer(produit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await SweetAlert.fire({
      title: 'Supprimer?',
      text: "Supprimer ce produit ?",
      showCancelButton: true,
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui'
    })
    if(!result.isConfirmed) return;
    
    try {
      await deleteProduit(id);
      await loadProduits();
    } catch (err) {
      toast.error("Erreur lors de la suppression du produit.");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
 
  return (
    <div className="gestion-produits-bo">
      <header className="header-produits-bo">
        <h1 className="titre-page-bo">Gestion des Produits</h1>
        <button
          className="btn-ajouter-produit-bo"
          onClick={() => {
            setProduitAEditer(null);
            setIsModalOpen(true);
          }}
        >
          +
        </button>
      </header>
      <hr className="separateur-bo" />
      <GestionCategories onCategoriesChange={setCategories} />
      <hr className="separateur-bo" />
      <div className="filtre-container-bo">
        <label className="filtre-label-bo">Filtrer par catégorie :</label>
        <select
          className="filtre-select-bo"
          value={categorieFiltre}
          onChange={(e) => setCategorieFiltre(parseInt(e.target.value, 10))}
        >
          <option value={0}>Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.numCategorie} value={cat.numCategorie}>
              {cat.nomCategorie}
            </option>
          ))}
        </select>

        <div className="filtre-promo-bo">
          <input
            type="checkbox"
            id="promoFiltre"
            checked={isOnPromoFiltre}
            onChange={(e) => setIsOnPromoFiltre(e.target.checked)}
          />
          <label htmlFor="promoFiltre" className="filtre-label-bo">
            En promotion
          </label>
        </div>

        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="recherche-input-bo"
          value={termeRecherche}
          onChange={(e) => setTermeRecherche(e.target.value)}
        />
      </div>
      <section className="section-catalogue-bo">
        <div className="liste-produits-grid-bo">
          {produitsFiltres.length > 0 ? (
            produitsFiltres.map((produit, index) => (
              <ProduitCard
                key={produit.id ?? produit.numProduit}
                produit={produit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getNomCategorie={getNomCategorie}
              />
            ))
          ) : (
            <p className="message-vide-bo">
              Aucun produit trouvé pour les filtres actuels.
            </p>
          )}
        </div>
      </section>
      <AjouterProduitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduit}
        produitAEditer={produitAEditer}
        categories={categories}
      />
    </div>
  );
};

export default Produits;