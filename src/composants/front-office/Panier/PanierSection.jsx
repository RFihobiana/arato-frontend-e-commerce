import React, { useContext, useState } from "react";
import { FaTrash, FaLock, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaTag,FaMobileAlt,FaCreditCard,FaUniversity } from "react-icons/fa"; // Ajout de FaTag
import Pagination from "../Accueil/PaginationProduits";
import panierImage from "../../../assets/images/panierList.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Panier/panierSection.css";

// Importez vos composants de modale (créés plus loin)
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
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  // États pour la livraison
  const [lieuLivraison, setLieuLivraison] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  
  // NOUVEAU : État pour le code promo
  const [codePromo, setCodePromo] = useState("");
  const [remise, setRemise] = useState(0.0); // Montant de la remise appliquée

  // États pour la modale de paiement
  const [activeModal, setActiveModal] = useState(null);
  
  // Logique de calculs
  const sousTotal = cartItems.reduce((acc, item) => acc + (item.prixPerKg * item.quantityKg), 0);
  const fraisDeService = 1.0; 
  // CORRECTION: Utilisation de la variable que vous avez définie au début (1.0)
  const fraisLivraison = 1.0; 
  
  // CORRECTION: Le montant à payer prend en compte la remise
  const montantBrut = sousTotal + fraisDeService + fraisLivraison;
  const montantAPayer = montantBrut - remise;

  const formattedMontant = montantAPayer.toFixed(2).replace('.', ',');

  // Fonction pour simuler la vérification du code promo
  const handleApplyCodePromo = () => {
      const code = codePromo.trim().toUpperCase();
      if (code === "WELCOME10") {
          const newRemise = Math.min(montantBrut * 0.10, 10.0); // 10% de réduction, max 10€
          setRemise(newRemise);
          alert(`Code "${code}" appliqué ! Vous bénéficiez de ${newRemise.toFixed(2)} € de réduction.`);
      } else if (code) {
          setRemise(0.0);
          alert(`Code promo "${code}" non valide.`);
      } else {
          setRemise(0.0);
          alert("Veuillez entrer un code promo.");
      }
  };


  // Fonction pour obtenir la date minimale (demain)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); 
    return today.toISOString().split('T')[0];
  };

  const closeModal = () => setActiveModal(null);
  
  const openModal = (mode) => {
    if (!lieuLivraison || !dateLivraison) {
        alert("Veuillez d'abord remplir le lieu et la date de livraison pour choisir un mode de paiement.");
        return;
    }
    setActiveModal(mode);
  };


  // Gestion des produits
  const handleQuantityChange = (itemId, increment) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) updateQuantity(itemId, Math.max(1, item.quantityKg + increment));
  };

  const handleCuttingOptionChange = (itemId, newOption) => {
    console.log(`Produit ${itemId}: Découpe mise à jour à ${newOption}`);
  };

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    if (currentItems.length === 1 && totalPages > 1) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  // Le bouton principal sert de validation des étapes avant le paiement
  const handlePasserCommandeClick = () => {
    if (cartItems.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    if (!lieuLivraison || !dateLivraison) {
        alert("Veuillez remplir le lieu et la date de livraison pour continuer.");
        document.querySelector('.livraison-info-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    alert("Livraison et résumé validés ! Veuillez maintenant choisir un mode de paiement ci-dessous.");
    const paiementSection = document.querySelector('.paiement-section');
    if (paiementSection) {
        paiementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <section className="panier-section">
      <div className="panier-produits">
        {/* ... (Header) ... */}
        <div className="panier-header">
          <div className="panier-icon-container">
            <img src={panierImage} className="panier-image" alt="Panier icône"/>
            <h3>Mon Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</h3>
          </div>
        </div>

        {/* ... (Liste des articles) ... */}
        <div className="panier-item-container">
          {currentItems.length > 0 ? (
            currentItems.map((produit) => (
              <div className="item-card" key={produit.id}>
                <div className="item-card-image-info">
                  <img src={produit.image} alt={produit.nom} className="panier-img" />
                  <div className="produit-info-text">
                    {produit.precommande && <p className="precommande">[Précommande]</p>}
                    <p className="produit-nom">{produit.nom}</p>
                     <p className="prix-per-kg">{produit.prixPerKg.toFixed(2).replace('.', ',')} € / kg</p>
                  
                    {produit.description && <p className="produit-description">{produit.description}</p>}
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
                    <button onClick={() => handleQuantityChange(produit.id, -1)} disabled={produit.quantityKg <= 1}>-</button>
                    <span>{produit.quantityKg}</span>
                    <button onClick={() => handleQuantityChange(produit.id, 1)}>+</button>
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
            ))
          ) : (
             <div className="empty-cart-message">
                <p>Votre panier est vide. Ajoutez des produits pour commencer votre commande !</p>
            </div>
          )}
        </div>
        
        {cartItems.length > itemsPerPage && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        )}
      </div>

      <div className="right-panel-wrapper">
        <div className="panier-total-card livraison-info-card">
            <h3><FaTruck /> Informations de Livraison</h3>
            <div className="livraison-input-group">
                <FaMapMarkerAlt className="input-icon"/>
                <input
                    type="text"
                    placeholder="Lieu de livraison (ex: Anosy, Antananarivo)"
                    value={lieuLivraison}
                    onChange={(e) => setLieuLivraison(e.target.value)}
                    required
                />
            </div>
            <div className="livraison-input-group">
                <FaCalendarAlt className="input-icon"/>
                <input
                    type="date"
                    placeholder="Date de Livraison Souhaitée"
                    value={dateLivraison}
                    onChange={(e) => setDateLivraison(e.target.value)}
                    min={getMinDate()}
                    required
                />
            </div>
                  <p className="delivery-note">
                <FaTruck /> Livraison rapide et fraîcheur garantie !
            </p>
        </div>
        
        <div className="panier-total-card promo-code-card">
            <h3><FaTag /> Code Promo</h3>
            <div className="promo-input-group">
                <input
                    type="text"
                    placeholder="Entrez votre code"
                    value={codePromo}
                    onChange={(e) => setCodePromo(e.target.value)}
                />
                <button 
                    className="apply-promo-btn"
                    onClick={handleApplyCodePromo}
                >
                    Appliquer
                </button>
            </div>
            {remise > 0.0 && (
                <p className="remise-applied-message">
                     {remise.toFixed(2)} € de remise appliquée !
                </p>
            )}
        </div>


        <div className="panier-total-card commande-globale-card">
          
          <div className="total-card">
            <div className="total-card-top">
              <div className="text">
                <h2>Sous-Total </h2>
                <p>{sousTotal.toFixed(2).replace('.', ',')} €</p>
              </div>
              <div className="text">
                <h2><FaTruck /> Frais de Livraison</h2>
                <p>{fraisLivraison.toFixed(2).replace('.', ',')} €</p>
              </div>
             
              {remise > 0.0 && (
                  <div className="text discount-line">
                      <h2>Remise Code Promo</h2>
                      <p>-{remise.toFixed(2).replace('.', ',')} €</p>
                  </div>
              )}
            </div>

            <hr />

            <div className="text total-line">
              <h2>Montant total </h2>
              <p className="total-prix-to-pay">{formattedMontant} €</p>
            </div>
          </div>
          
          <button 
             className="passer-commande-btn" 
             onClick={handlePasserCommandeClick}
             disabled={cartItems.length === 0}
          >
            <FaLock /> Valider la Livraison et Payer
          </button>
        </div>
        
       <div className="paiement-section">
  
  <div 
     className={`paiement-option mvola-option ${activeModal === 'mvola' ? 'active' : ''}`} 
     onClick={() => openModal('mvola')}
  >
    <div className="logo-container">
        <FaMobileAlt className="logo-icon mvola" />
    </div>
    <div className="text-info">
        <h4>Paiement Mobile Rapide</h4>
        <p>Utilisez votre compte Mvola pour un paiement instantané.</p>
    </div>
    <FaChevronRight className="arrow-icon" />
  </div>

  <div 
     className={`paiement-option carte-option ${activeModal === 'carte' ? 'active' : ''}`} 
     onClick={() => openModal('carte')}
  >
    <div className="logo-container">
        <span className="mini-logo visa">VISA</span>
        <span className="mini-logo mastercard">MC</span>
    </div>
    <div className="text-info">
        <h4>Carte de Crédit / Débit</h4>
        <p>Paiement sécurisé via Visa et Mastercard (256-bit SSL).</p>
    </div>
    <FaChevronRight className="arrow-icon" />
  </div>

  <div 
     className={`paiement-option virement-option ${activeModal === 'virement' ? 'active' : ''}`} 
     onClick={() => openModal('virement')}
  >
    <div className="logo-container">
        <FaUniversity className="logo-icon virement" />
    </div>
    <div className="text-info">
        <h4>Transfert Bancaire</h4>
        <p>Paiement par virement classique (comptez 24 à 48h).</p>
    </div>
    <FaChevronRight className="arrow-icon" />
  </div>
</div>
      </div>
      
      {/* Modales de Paiement */}
      {activeModal === 'mvola' && (
        <MVolaModal montant={formattedMontant} onClose={closeModal} />
      )}
      {activeModal === 'carte' && (
        <CarteBancaireModal montant={formattedMontant} onClose={closeModal} />
      )}
      {activeModal === 'virement' && (
        <VirementBancaireModal montant={formattedMontant} onClose={closeModal} />
      )}
   </section>
  );
};

export default PanierSection;