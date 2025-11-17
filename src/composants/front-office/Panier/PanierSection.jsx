import React, { useContext, useState, useEffect } from "react";
import { FaTrash, FaLock, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaTag, FaMobileAlt, FaCreditCard, FaUniversity } from "react-icons/fa";
import Pagination from "../Accueil/PaginationProduits";
import panierImage from "../../../assets/images/panierList.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Panier/panierSection.css";
import MVolaModal from './MvolaModal';
import CarteBancaireModal from './CarteBancaireModal';
import VirementBancaireModal from './VirementBancaireModal';
import { CartContext } from "../../../contexts/CartContext";
import { createCommande } from "../../../services/commandeService";
import { fetchFrais } from "../../../services/livraisonService";

const cuttingOptions = [
  { value: "entier", label: "Entier" },
  { value: "tranches", label: "En tranches" },
  { value: "des", label: "En dés" }
];

const PanierSection = () => {
  const { cartItems,

        removeFromCart,
        updateQuantity,
        clearCart,
        totalWeight,
        subtotal} = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const [lieuLivraison, setLieuLivraison] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  const [codePromo, setCodePromo] = useState("");
  const [remise, setRemise] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [fraisList, setFraisList] = useState([]);

  useEffect(() => {
    const loadFrais = async () => {
      const data = await fetchFrais();
      console.log("Données de frais reçues :", data); 
      setFraisList(data);
    };
    loadFrais();
  }, []);

  
const totalPoids = totalWeight;

  const tranche = fraisList.find(
    (f) =>
      totalPoids >= Number(f.poidsMin) &&
      totalPoids <= Number(f.poidsMax)
  );

  const fraisLivraison = tranche ? Number(tranche.frais) : 0;
 const sousTotal = subtotal;

  const montantBrut = sousTotal + fraisLivraison;
  const montantAPayer = montantBrut - remise;
  const formattedMontant = montantAPayer.toFixed(2).replace(".", ",");

  const handleApplyCodePromo = () => {
    const code = codePromo.trim().toUpperCase();
    if (code === "WELCOME10") {
      const newRemise = Math.min(montantBrut * 0.1, 10);
      setRemise(newRemise);
          alert(`Code "${code}" appliqué ! ${newRemise.toFixed(2)} Ar de réduction.`);
    } else {
      setRemise(0);
      alert("Code promo non valide.");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const closeModal = () => setActiveModal(null);

  const handleModalConfirm = async ({ numModePaiement, payerLivraison }) => {
    if (cartItems.length === 0 || !lieuLivraison || !dateLivraison) {
      alert("Panier vide ou informations de livraison manquantes.");
      return;
    }

    const panierPayload = cartItems.map(item => ({
      numProduit: item.numProduit,
      poids: Number(item.quantityKg || item.poids),
      prix: Number(item.prixPerKg || item.prix),
      decoupe: item.cuttingOption || "entier"
    }));

    const payload = {
      numModePaiement,
      adresseDeLivraison: lieuLivraison,
      payerLivraison: !!payerLivraison,
      statut: "en cours",
      panier: panierPayload
    };

    try {
      setIsCreating(true);
      const res = await createCommande(payload);
      alert("Commande créée avec succès (numCommande: " + (res.numCommande || res.id || "n/a") + ")");
      clearCart();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Erreur lors de la création de la commande";
      alert("Erreur : " + msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuantityChange = (itemId, increment) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    updateQuantity(itemId, Math.max(1, Number(item.quantityKg || item.poids) + increment));
  };

  const handleCuttingOptionChange = (itemId, newOption) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    updateQuantity(itemId, Number(item.quantityKg || item.poids), newOption);
  };

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    if (currentItems.length === 1 && totalPages > 1) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const handlePasserCommandeClick = () => {
    if (cartItems.length === 0 || !lieuLivraison || !dateLivraison) {
      alert("Panier vide ou informations de livraison manquantes.");
      return;
    }
    const paiementSection = document.querySelector(".paiement-section");
    if (paiementSection) paiementSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="panier-section">
      <div className="panier-produits">
        <div className="panier-header">
          <div className="panier-icon-container">
            <img src={panierImage} className="panier-image" alt="Panier icône" />
            <h3>Mon Panier ({cartItems.length} article{cartItems.length > 1 ? "s" : ""})</h3>
          </div>
        </div>

        <div className="panier-item-container">
          {currentItems.length > 0 ? (
            currentItems.map((produit) => (
              <div className="item-card" key={produit.id}>
                <div className="item-card-image-info">
                  <img src={produit.image} alt={produit.nom} className="panier-img" />
                  <div className="produit-info-text">
                    {produit.precommande && <p className="precommande">[Précommande]</p>}
                    <p className="produit-nom">{produit.nom}</p>
                    <p className="prix-per-kg">
                      {(Number(produit.prixPerKg || produit.prix)).toFixed(2).replace(".", ",")} Ar / kg
                    </p>
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
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="quantite-control-group">
                    <button
                      onClick={() => handleQuantityChange(produit.id, -1)}
                      disabled={Number(produit.quantityKg || produit.poids) <= 1}
                    >
                      -
                    </button>
                    <span>{Number(produit.quantityKg || produit.poids)}</span>
                    <button onClick={() => handleQuantityChange(produit.id, 1)}>+</button>
                  </div>
                </div>

                <div className="produit-final-row">
                  <p className="total-item-prix">
                    {(
                      Number(produit.prixPerKg || produit.prix) *
                      Number(produit.quantityKg || produit.poids)
                    )
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    Ar
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
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              placeholder="Lieu de livraison (ex: Anosy, Antananarivo)"
              value={lieuLivraison}
              onChange={(e) => setLieuLivraison(e.target.value)}
            />
          </div>
          <div className="livraison-input-group">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              value={dateLivraison}
              onChange={(e) => setDateLivraison(e.target.value)}
              min={getMinDate()}
            />
          </div>
          <p className="delivery-note"><FaTruck /> Livraison rapide et fraîcheur garantie !</p>
        </div>

        <div className="panier-total-card promo-code-card">
          <h3><FaTag /> Code Promo</h3>
          <div className="promo-input-group">
            <input type="text" value={codePromo} onChange={(e) => setCodePromo(e.target.value)} />
            <button className="apply-promo-btn" onClick={handleApplyCodePromo}>Appliquer</button>
          </div>
          {remise > 0 && (
            <p className="remise-applied-message">
              {remise.toFixed(2).replace(".", ",")} Ar de remise appliquée !
            </p>
          )}
        </div>

        <div className="panier-total-card commande-globale-card">
          <div className="total-card">
            <div className="total-card-top">
              <div className="text">
                <h2>Sous-Total</h2>
                <p>{sousTotal.toFixed(2).replace(".", ",")} Ar</p>
              </div>
              <div className="text">
                <h2><FaTruck /> Frais de Livraison</h2>
                <p>{fraisLivraison.toFixed(2).replace(".", ",")} Ar</p>
              </div>
              {remise > 0 && (
                <div className="text discount-line">
                  <h2>Remise Code Promo</h2>
                  <p>-{remise.toFixed(2).replace(".", ",")} Ar</p>
                </div>
              )}
            </div>
            <hr />
            <div className="text total-line">
              <h2>Montant total</h2>
              <p className="total-prix-to-pay">{formattedMontant} Ar</p>
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
            className={`paiement-option mvola-option ${activeModal === "mvola" ? "active" : ""}`}
            onClick={() => setActiveModal("mvola")}
          >
            <div className="logo-container">
              <FaMobileAlt className="logo-icon mvola" />
            </div>
            <div className="text-info">
              <h4>Paiement Mobile Rapide</h4>
              <p>Utilisez votre compte Mvola.</p>
            </div>
            <FaChevronRight className="arrow-icon" />
          </div>

          <div
            className={`paiement-option carte-option ${activeModal === "carte" ? "active" : ""}`}
            onClick={() => setActiveModal("carte")}
          >
            <div className="logo-container">
              <span className="mini-logo visa">VISA</span>
              <span className="mini-logo mastercard">MC</span>
            </div>
            <div className="text-info">
              <h4>Carte Bancaire</h4>
              <p>Paiement sécurisé.</p>
            </div>
            <FaChevronRight className="arrow-icon" />
          </div>

          <div
            className={`paiement-option virement-option ${activeModal === "virement" ? "active" : ""}`}
            onClick={() => setActiveModal("virement")}
          >
            <div className="logo-container">
              <FaUniversity className="logo-icon virement" />
            </div>
            <div className="text-info">
              <h4>Virement Bancaire</h4>
              <p>Traitement en 24 à 48h.</p>
            </div>
            <FaChevronRight className="arrow-icon" />
          </div>

          {activeModal === "mvola" && (
            <MVolaModal montant={formattedMontant} onClose={closeModal} onConfirm={handleModalConfirm} />
          )}
          {activeModal === "carte" && (
            <CarteBancaireModal montant={formattedMontant} onClose={closeModal} onConfirm={handleModalConfirm} />
          )}
          {activeModal === "virement" && (
            <VirementBancaireModal montant={formattedMontant} onClose={closeModal} onConfirm={handleModalConfirm} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PanierSection;