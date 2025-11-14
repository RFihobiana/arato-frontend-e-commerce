import React, { useContext, useState } from "react";
import { FaTrash, FaMobileAlt, FaCreditCard, FaUniversity, FaLock, FaTruck } from "react-icons/fa";
import Pagination from "../Accueil/PaginationProduits";
import panierImage from "../../../assets/images/panierList.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Panier/panierSection.css";

import MVolaModal from './MvolaModal';
import CarteBancaireModal from './CarteBancaireModal';
import VirementBancaireModal from './VirementBancaireModal';
import { CartContext } from "../../../contexts/CartContext";

const cuttingOptions = [
  { value: "entier", label: "Entier" },
  { value: "tranches", label: "En tranches" },
  { value: "des", label: "En dés" },
  { value: "mixte", label: "Découpe spécifique" }
];

const PanierSection = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  // Modals
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (mode) => setActiveModal(mode);
  const closeModal = () => setActiveModal(null);

  // Totaux
  const sousTotal = cartItems.reduce((acc, item) => acc + (item.prixPerKg * item.quantityKg), 0);
  const fraisDeService = 1.0;
  const livraisonOfferte = 0.0;
  const montantAPayer = sousTotal + fraisDeService + livraisonOfferte;

  // Gestion quantité et suppression
  const handleQuantityChange = (itemId, increment) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) updateQuantity(itemId, Math.max(1, item.quantityKg + increment));
  };

  const handleCuttingOptionChange = (itemId, newOption) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) updateQuantity(itemId, item.quantityKg); // garde quantité inchangée
    // On met à jour l'option via context ou directement ici si nécessaire
  };

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    if (currentItems.length === 1 && totalPages > 1) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const handleCommanderClick = () => alert("Passer la commande !");

  return (
    <section className="panier-section">
      <div className="panier-produits">
        <div className="panier-header">
          <div className="panier-icon-container">
            <img src={panierImage} className="panier-image" alt="Panier icône"/>
            <h3>Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</h3>
          </div>
        </div>

        <div className="panier-item-container">
          {currentItems.map((produit) => (
            <div className="item-card" key={produit.id}>
              <div className="item-card-image-info">
                <img src={produit.image} alt={produit.nom} className="panier-img" />
                <div className="produit-info-text">
                  <p className="precommande">[Précommande]</p>
                  <p className="produit-nom">{produit.nom}</p>
                  <p className="produit-description">{produit.description}</p>
                </div>
              </div>

              <div className="produit-controls-row">
                <div className="cutting-option-group">
                  <label htmlFor={`cutting-${produit.id}`}>Découpe :</label>
                  <select
                    id={`cutting-${produit.id}`}
                    value={produit.cuttingOption || "entier"}
                    onChange={(e) => handleCuttingOptionChange(produit.id, e.target.value)}
                  >
                    {cuttingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="quantite-control-group">
                  <button onClick={() => handleQuantityChange(produit.id, -1)}>-</button>
                  <span>{produit.quantityKg}</span>
                  <button onClick={() => handleQuantityChange(produit.id, 1)}>+</button>
                  <p className="prix-per-kg">{produit.prixPerKg.toFixed(2).replace('.', ',')} € / kg</p>
                </div>
              </div>

              <div className="produit-final-row">
                <p className="total-item-prix">
                  {(produit.prixPerKg * produit.quantityKg).toFixed(2).replace('.', ',')} €
                </p>
                <button className="delete-btn" onClick={() => handleDelete(produit.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="right-panel-wrapper">
        <div className="panier-total-card commande-globale-card">
          <div className="total-card">
            <div className="total-card-top">
              <div className="text">
                <h2>Sous-Total Panier</h2>
                <p>{sousTotal.toFixed(2).replace('.', ',')} €</p>
              </div>
              <div className="text">
                <h2><FaTruck /> Livraison</h2>
                <p>{livraisonOfferte.toFixed(2).replace('.', ',')} €</p>
              </div>
              <div className="text">
                <h2>Frais de service</h2>
                <p>{fraisDeService.toFixed(2).replace('.', ',')} €</p>
              </div>
            </div>

            <hr />

            <div className="text total-line">
              <h2>Montant à payer</h2>
              <p>{montantAPayer.toFixed(2).replace('.', ',')} €</p>
            </div>
          </div>

          <button className="passer-commande-btn" onClick={handleCommanderClick}>
            <FaLock /> Passer la commande
          </button>
        </div>

        <div className="paiement-section">
          <h3>Choisir un mode de paiement</h3>
          <div onClick={() => openModal('mvola')}><FaMobileAlt /> Mvola</div>
          <div onClick={() => openModal('carte')}><FaCreditCard /> Carte Bancaire</div>
          <div onClick={() => openModal('virement')}><FaUniversity /> Virement Bancaire</div>
        </div>
      </div>

      {activeModal === 'mvola' && <MVolaModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
      {activeModal === 'carte' && <CarteBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
      {activeModal === 'virement' && <VirementBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
    </section>
  );
};

export default PanierSection;
