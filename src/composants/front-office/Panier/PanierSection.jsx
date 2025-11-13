import React, { useState, useEffect } from "react";
import { FaTrash, FaMobileAlt, FaCreditCard, FaUniversity, FaLock, FaTruck } from "react-icons/fa";
import Pagination from "../Accueil/PaginationProduits";
import panierImage from "../../../assets/images/panierList.png";
import "../../../styles/front-office/global.css";
import "../../../styles/front-office/Panier/panierSection.css";

import MVolaModal from './MvolaModal';
import CarteBancaireModal from './CarteBancaireModal';
import VirementBancaireModal from './VirementBancaireModal';

import { fetchPaniers, updateDetailPanier, deleteDetailPanier } from '../../../services/panierService';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const cuttingOptions = [
    { value: "entier", label: "Entier" },
    { value: "tranches", label: "En tranches" },
    { value: "des", label: "En dés" },
    { value: "mixte", label: "Découpe spécifique (à préciser)" },
];

const PanierSection = () => {
    const [cartItems, setCartItems] = useState([]);
    const [promoCode, setPromoCode] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dateLivraison, setDateLivraison] = useState("");
    const [adresseLivraison, setAdresseLivraison] = useState("");

    const itemsPerPage = 3;
    const fraisDeService = 1.0;
    const livraisonOfferte = 0.0;

    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        loadPanier();
        window.addEventListener('panierUpdated', loadPanier);
        return () => window.removeEventListener('panierUpdated', loadPanier);
    }, []);

    const loadPanier = async () => {
        const token = localStorage.getItem('token');

        try {
            setLoading(true);
            let items = [];
            if (!token) {
                const localPanier = JSON.parse(localStorage.getItem('panier') || '[]');
                items = localPanier.map(p => ({
                    id: p.numProduit,
                    numProduit: p.numProduit,
                    nom: p.nomProduit || p.nom || 'Produit',
                    prixPerKg: parseFloat(p.prix || 0),
                    quantityKg: parseFloat(p.poids || 1),
                    quantiteStock: p.quantiteStock || 1000,
                    image: p.image || '',
                    cuttingOption: p.decoupe || 'entier',
                }));
            } else {
                const paniers = await fetchPaniers();
                if (paniers?.length > 0 && paniers[0]?.detailPaniers) {
                    items = paniers[0].detailPaniers.map(detail => {
                        const produit = detail.produit || {};
                        return {
                            id: detail.numDetailPanier ?? detail.numProduit,
                            numDetailPanier: detail.numDetailPanier,
                            numProduit: detail.numProduit,
                            nom: produit.nom || produit.nomProduit || 'Produit',
                            prixPerKg: parseFloat(produit.prix || 0),
                            quantityKg: parseFloat(detail.quantite || 1),
                            quantiteStock: produit.quantiteStock || 1000,
                            image: produit.image || '',
                            cuttingOption: detail.decoupeOption || 'entier',
                        };
                    });
                }
            }
            setCartItems(items);
        } catch (error) {
            console.error("Erreur chargement panier:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (item, newQuantity) => {
        newQuantity = parseFloat(newQuantity);
        if (isNaN(newQuantity)) return;
        
        if (item.quantiteStock) newQuantity = Math.min(newQuantity, item.quantiteStock);
        if (newQuantity < 0) newQuantity = 0;

        const token = localStorage.getItem('token');
        const updatedItem = { ...item, quantityKg: newQuantity };

        // Optimistic update
        setCartItems(prev => prev.map(i => i.id === item.id ? updatedItem : i).filter(i => i.quantityKg > 0));

        try {
            if (token && item.numDetailPanier) {
                if (newQuantity === 0) {
                    await deleteDetailPanier(item.numDetailPanier);
                } else {
                    await updateDetailPanier(item.numDetailPanier, { quantite: newQuantity, decoupeOption: item.cuttingOption });
                }
            } else {
                let updatedLocal = cartItems.map(i => i.id === item.id ? updatedItem : i);
                updatedLocal = updatedLocal.filter(i => i.quantityKg > 0);
                localStorage.setItem('panier', JSON.stringify(updatedLocal));
            }
            window.dispatchEvent(new CustomEvent('panierUpdated'));
        } catch (err) {
            console.error("Erreur lors de la mise à jour du panier:", err);
            
            alert("Erreur lors de la mise à jour du panier. Veuillez réessayer.");
            loadPanier(); 
        }
    };

    const handleCuttingOptionChange = async (item, newOption) => {
        const token = localStorage.getItem('token');
        try {
            if (token && item.numDetailPanier) {
                await updateDetailPanier(item.numDetailPanier, { decoupeOption: newOption, quantite: item.quantityKg });
            }
            setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, cuttingOption: newOption } : i));
            
            if (!token) {
                const updatedLocal = cartItems.map(i => i.id === item.id ? { ...i, cuttingOption: newOption } : i);
                localStorage.setItem('panier', JSON.stringify(updatedLocal));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (item) => handleQuantityChange(item, 0);
    const handleCommanderClick = () => {
        if (!dateLivraison || !adresseLivraison) {
            alert("Veuillez renseigner la date et l'adresse de livraison");
            return;
        }
        alert("Passer la commande !");
    };
    const openModal = (mode) => setActiveModal(mode);
    const closeModal = () => setActiveModal(null);

    if (loading) return <section className="panier-section"><p style={{textAlign:'center', padding:'3rem'}}>Chargement du panier...</p></section>;

    const sousTotal = cartItems.reduce((acc, item) => acc + (item.prixPerKg * item.quantityKg), 0);
    const montantAPayer = sousTotal + fraisDeService + livraisonOfferte;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(cartItems.length / itemsPerPage);

    return (
        <section className="panier-section">
            <div className="panier-produits">
                <div className="panier-header">
                    <div className="panier-icon-container">
                        <img src={panierImage} className="panier-image" alt="Panier icône"/>
                        <h3>Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</h3>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Votre panier est vide</div>
                ) : (
                    <>
                        <div className="panier-item-container">
                         {currentItems.map(item => (
  <div className="item-card" key={item.id}>
    <div className="item-card-image-info">
      <img
        src={item.image ? `${IMAGE_BASE_URL}${item.image}` : '/placeholder.png'}
        alt={item.nom}
        className="panier-img"
        onError={e => e.target.src = '/placeholder.png'}
      />
      <div className="produit-info-text">
        <p className="precommande">[Précommande]</p>
        <p className="produit-nom">{item.nom}</p>
        <p className="prix-per-kg">{item.prixPerKg} Ar / kg</p>
        <p className="stock-restant">Il nous reste {item.quantiteStock} en stock</p>
      </div>
    </div>

    <div className="produit-controls-row">
      <div className="cutting-option-group">
        <label htmlFor={`cutting-${item.id}`}>Découpe :</label>
        <div className="select-wrapper">
          <select
            id={`cutting-${item.id}`}
            value={item.cuttingOption}
            onChange={(e) => handleCuttingOptionChange(item, e.target.value)}
          >
            {cuttingOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="quantite-control-group">
        <div className="quantite-control">
          <button onClick={() => handleQuantityChange(item, Math.max(0, item.quantityKg - 0.5))}>-</button>
          <input
            type="number"
            value={item.quantityKg}
            min="0"
            step="0.5"
            onChange={e => handleQuantityChange(item, parseFloat(e.target.value) || 0)}
          />
          <button onClick={() => handleQuantityChange(item, Math.min(item.quantiteStock, item.quantityKg + 0.5))}>+</button>
        </div>
        <p className="quantite-unit">{item.quantityKg} kg</p>
        <p className="total-item-prix">{(item.prixPerKg * item.quantityKg).toLocaleString('fr-FR')} Ar</p>
      </div>
    </div>

    <div className="produit-final-row">
      <button className="delete-btn" onClick={() => handleDelete(item)} title="Supprimer"><FaTrash /></button>
    </div>
  </div>
))}

                        </div>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>

            <div className="right-panel-wrapper">
                <div className="panier-total-card commande-globale-card">
                    <div className="total-card">
                        <div className="total-card-top">
                            <div className="text">
                                <h2>Sous-Total Panier</h2>
                                <p>{sousTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</p>
                            </div>
                            <div className="text">
                                <h2><FaTruck className="delivery-icon"/> Livraison</h2>
                                <p>{livraisonOfferte.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</p>
                            </div>
                            <div className="text">
                                <h2>Frais de service <span className="info-icon" title="Information sur les frais">&#9432;</span></h2>
                                <p>{fraisDeService.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</p>
                            </div>
                        </div>
                        <hr className="total-card-middle"/>
                        <div className="text total-line">
                            <h2>Montant à payer</h2>
                            <p className="total-prix-to-pay">{montantAPayer.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</p>
                        </div>
                    </div>

                    <div className="promo-code-section">
                        <p>Choisir le jour de ma livraison</p>
                        <div className="livraison-input-group">
                            <input type="date" value={dateLivraison} onChange={e=>setDateLivraison(e.target.value)} />
                        </div>
                        <p>Adresse de livraison</p>
                        <div className="livraison-input-group">
                            <input type="text" value={adresseLivraison} placeholder="Ville / Région" onChange={e=>setAdresseLivraison(e.target.value)} />
                        </div>
                        <p>Vous avez un code promo?</p>
                        <div className="promo-input-group">
                            <input type="text" value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder="Saisissez votre code..." />
                            <button className="promo-ok-btn">OK</button>
                        </div>
                    </div>

                    <button className="passer-commande-btn" onClick={handleCommanderClick}><FaLock className="lock-icon"/> Passer la commande</button>
                </div>

                <div className="paiement-section">
                    <h3>Choisir un mode de paiement</h3>
                    <div className="paiement-option" onClick={()=>openModal('mvola')}>
                        <FaMobileAlt className="icon mvola"/>
                        <div><h4>Mvola</h4><p>Paiement mobile instantané</p></div>
                        <span className="arrow">›</span>
                    </div>
                    <div className="paiement-option" onClick={()=>openModal('carte')}>
                        <FaCreditCard className="icon carte"/>
                        <div><h4>Carte Bancaire</h4><p>Visa, Mastercard</p></div>
                        <span className="arrow">›</span>
                    </div>
                    <div className="paiement-option" onClick={()=>openModal('virement')}>
                        <FaUniversity className="icon virement"/>
                        <div><h4>Virement Bancaire</h4><p>Transfert depuis votre banque</p></div>
                        <span className="arrow">›</span>
                    </div>
                </div>
            </div>

            {activeModal==='mvola' && <MVolaModal montant={montantAPayer.toFixed(2)} onClose={closeModal}/>}
            {activeModal==='carte' && <CarteBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal}/>}
            {activeModal==='virement' && <VirementBancaireModal montant={montantAPayer.toFixed(2)} onClose={closeModal}/>}
        </section>
    );
};

export default PanierSection;