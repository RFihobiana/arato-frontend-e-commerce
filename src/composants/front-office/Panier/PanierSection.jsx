// PanierSection.jsx
import React, { useEffect, useState } from "react";
import { FaTrash, FaMobileAlt, FaCreditCard, FaUniversity, FaLock, FaTruck } from "react-icons/fa";
import Pagination from "../Accueil/PaginationProduits"; 
import panierImage from "../../../assets/images/panierList.png"; 
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Panier/panierSection.css";

import MVolaModal from './MvolaModal';
import CarteBancaireModal from './CarteBancaireModal';
import VirementBancaireModal from './VirementBancaireModal';

import { 
  getPanierWithDetails, 
  updateDetailPanier, 
  deleteDetailPanier 
} from '../../../services/panierService';

import api from "../../../services/api";

const cuttingOptions = [
  { value: "entier", label: "Entier " },
  { value: "tranches", label: "En tranches " },
  { value: "des", label: "En dés " },
  { value: "mixte", label: "Découpe spécifique (à préciser)" },
];

const PanierSection = ({ connected = false }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [promoCode, setPromoCode] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  // Charger le panier
  useEffect(() => {
    const loadPanier = async () => {
      try {
        const data = await getPanierWithDetails(connected);
        setCartItems(data || []);
      } catch (err) {
        console.error("Erreur chargement panier :", err);
      }
    };
    loadPanier();
  }, [connected]);

  const sousTotal = cartItems.reduce((acc, item) => acc + (item.prix * item.poids), 0);
  const fraisDeService = 1.0;
  const livraisonOfferte = 0.0;
  const montantAPayer = sousTotal + fraisDeService + livraisonOfferte;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleQuantityChange = async (numProduit, increment) => {
    setCartItems(prev =>
      prev.map(item =>
        item.numProduit === numProduit
          ? { ...item, poids: Math.max(1, item.poids + increment) }
          : item
      )
    );
    const updatedItem = cartItems.find(i => i.numProduit === numProduit);
    if (updatedItem) await updateDetailPanier(numProduit, { poids: Math.max(1, updatedItem.poids + increment) }, connected);
  };

  const handleCuttingOptionChange = async (numProduit, newOption) => {
    setCartItems(prev =>
      prev.map(item =>
        item.numProduit === numProduit ? { ...item, decoupe: newOption } : item
      )
    );
    await updateDetailPanier(numProduit, { decoupe: newOption }, connected);
  };

  const handleDelete = async (numProduit) => {
    setCartItems(prev => prev.filter(item => item.numProduit !== numProduit));
    await deleteDetailPanier(numProduit, connected);
    if (currentItems.length === 1 && totalPages > 1) setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleCommanderClick = async () => {
    try {
      const panierId = connected ? await api.get("/panier/active").then(r => r.data.numPanier) : null;
      await api.post("/commande", { panierId });
      alert("Commande passée avec succès !");
      setCartItems([]);
      if (!connected) localStorage.removeItem("panier_local");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la commande");
    }
  };

  const openModal = (mode) => setActiveModal(mode);
  const closeModal = () => setActiveModal(null);

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
            <div className="item-card" key={produit.numProduit}>
              <div className="item-card-image-info">
                <img src={produit.image} alt={produit.nomProduit} className="panier-img" />
                <div className="produit-info-text">
                  <p className="precommande">[Précommande]</p>
                  <p className="produit-nom">{produit.nomProduit}</p>
                  <p className="produit-description">{produit.description}</p>
                </div>
              </div>

              <div className="produit-controls-row">
                <div className="cutting-option-group">
                  <label htmlFor={`cutting-${produit.numProduit}`}>Découpe :</label>
                  <select
                    id={`cutting-${produit.numProduit}`}
                    value={produit.decoupe || "entier"} 
                    onChange={(e) => handleCuttingOptionChange(produit.numProduit, e.target.value)}
                  >
                    {cuttingOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="quantite-control-group">
                  <button onClick={() => handleQuantityChange(produit.numProduit, -1)}>-</button>
                  <span>{produit.poids}</span>
                  <button onClick={() => handleQuantityChange(produit.numProduit, 1)}>+</button>
                </div>
              </div>

              <div className="produit-final-row">
                <p>{(produit.prix * produit.poids).toLocaleString()} Ar</p>
                <button onClick={() => handleDelete(produit.numProduit)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <div className="right-panel-wrapper">
        <div className="panier-total-card">
          <h2>Sous-Total : {sousTotal.toLocaleString()} €</h2>
          <h2>Livraison : {livraisonOfferte.toFixed(2)} €</h2>
          <h2>Frais service : {fraisDeService.toFixed(2)} €</h2>
          <hr />
          <h2>Montant à payer : {montantAPayer.toLocaleString()} €</h2>

          <div>
            <p>Choisir jour livraison</p>
            <input type="date" />
            <p>Adresse de livraison</p>
            <input type="text" placeholder="Ville / Région" />
            <p>Code promo</p>
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
          </div>

          <button onClick={handleCommanderClick}><FaLock /> Passer la commande</button>
        </div>

        <div className="paiement-section">
          <h3>Choisir un mode de paiement</h3>
          <div onClick={() => openModal('mvola')}><FaMobileAlt /> Mvola</div>
          <div onClick={() => openModal('carte')}><FaCreditCard /> Carte Bancaire</div>
          <div onClick={() => openModal('virement')}><FaUniversity /> Virement</div>
        </div>
      </div>

      {activeModal === 'mvola' && <MVolaModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
      {activeModal === 'carte' && <CarteBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
      {activeModal === 'virement' && <VirementBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal} />}
    </section>
  );
};

export default PanierSection;
