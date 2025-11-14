import React, { useEffect, useState, useContext } from "react";
import panierIcon from "../../../assets/icones/panier.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Accueil/produitSection.css";
import PaginationProduits from './PaginationProduits';
import { fetchProduits } from '../../../services/produitService';
import { CartContext } from "../../../contexts/CartContext";

const ProduitsSection = ({ categorieActive, showHeader = true }) => {
  const { addToCart } = useContext(CartContext);
  const [produits, setProduits] = useState([]);
  const [page, setPage] = useState(1);
  const produitsParPage = 4;

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8000";

  // Chargement des produits
  useEffect(() => {
    const loadProduits = async () => {
      try {
        const data = await fetchProduits();
        console.log("Produits récupérés :", data);
        setProduits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur récupération produits :", err);
        setProduits([]);
      }
    };
    loadProduits();
  }, []);

  // Reset page quand catégorie change
  useEffect(() => {
    setPage(1);
  }, [categorieActive]);

  // Filtrage par catégorie
  const produitsFiltre = categorieActive
    ? produits.filter(p => p.numCategorie === categorieActive)
    : produits;

  const indexDepart = (page - 1) * produitsParPage;
  const produitsAffiches = produitsFiltre.slice(indexDepart, indexDepart + produitsParPage);

  // Ajouter au panier
  const handleAddToCart = (produit) => {
    const produitId = produit.id ?? produit.numProduit;
    if (!produitId) {
      console.warn("Produit sans ID, impossible d'ajouter au panier :", produit);
      return;
    }
    addToCart({
      id: produitId,
      nom: produit.nomProduit,
      prixPerKg: Number(produit.prix) || 0,
      quantityKg: 1,
      image: produit.image ? `${IMAGE_BASE_URL}${produit.image}` : "/placeholder.png",
      cuttingOption: "entier",
    });
  };

  return (
    <section className="produit-section">
      {showHeader && (
        <div className="produit-header">
          <h3>Nos produits</h3>
          <p>Découvrez nos produits frais et de qualité directement depuis nos champs et élevages</p>
        </div>
      )}

      <div className="produit-grid">
        {produitsAffiches.length > 0 ? (
          produitsAffiches.map(produit => (
            <div key={produit.numProduit} className="produit-card">
              {produit.promotion?.valeur && (
                <span className="promo-cercle">
                  {produit.promotion.valeur}
                  {produit.promotion.typePromotion === "Pourcentage" ? "%" : "Ar"}
                </span>
              )}
              <div className="produit-image-container">
                <img
                  src={produit.image ? `${IMAGE_BASE_URL}${produit.image}` : "/placeholder.png"}
                  alt={produit.nomProduit || "Produit"}
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
              </div>
              <div className="produit-text">
                <h2>{produit.nomProduit}</h2>
                <div className="produit-text-icon">
                  <p>{Number(produit.prix || 0).toLocaleString()} Ar/kg</p>
                  <button onClick={() => handleAddToCart(produit)} className="add-to-cart-btn">
                    <img src={panierIcon} className="header-icons" alt="Panier" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>Aucun produit disponible</p>
        )}
      </div>

      {/* Pagination */}
      <PaginationProduits
        totalProduits={produitsFiltre.length}
        produitsParPage={produitsParPage}
        onPageChange={setPage}
      />
    </section>
  );
};

export default ProduitsSection;
