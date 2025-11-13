import React, { useEffect, useState } from "react";
import panier from "../../../assets/icones/panier.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Accueil/produitSection.css";
import PaginationProduits from './PaginationProduits';
import { fetchProduits } from '../../../services/produitService'; // Assure-toi que ça existe

const ProduitsSection = ({ categorieActive, showHeader = true }) => {
  const [produits, setProduits] = useState([]);
  const [page, setPage] = useState(1);
  const produitsParPage = 4;

  // URL de base pour accéder aux images depuis le backend
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8000/storage/produits/";

  useEffect(() => {
    const loadProduits = async () => {
      try {
        const data = await fetchProduits(); // récupère les produits depuis l'API
        setProduits(data || []);
      } catch (err) {
        console.error("Erreur récupération produits :", err);
      }
    };
    loadProduits();
  }, []);

  useEffect(() => {
    setPage(1); // reset page quand la catégorie change
  }, [categorieActive]);

  // Filtre par catégorie si nécessaire
  const produitsFiltre = categorieActive
    ? produits.filter(p => p.numCategorie === categorieActive)
    : produits;

  const indexDepart = (page - 1) * produitsParPage;
  const produitsAffiches = produitsFiltre.slice(indexDepart, indexDepart + produitsParPage);

  return (
    <section className="produit-section">
      {showHeader && (
        <div className="produit-header">
          <h3>Nos produits</h3>
          <p>
            Découvrez nos produits frais et de qualité directement depuis nos champs et élevages
          </p>
        </div>
      )}

      <div className="produit-grid">
        {produitsAffiches.length > 0 ? (
          produitsAffiches.map(produit => (
            <div key={produit.id ?? produit.numProduit} className="produit-card">
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
                  <a>
                    <img src={panier} className="header-icons" alt="Panier" />
                  </a>
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
