import React, { useState } from 'react';
import AjouterPromotionModal from './AjouterPromotionModal';
import "../../../styles/back-office/Promotions.css";
const initialPromotions = [
    { 
        id: 1, 
        code: "ARATO12", 
        nom: "Bienvenu nouveau Client 12 sept 2025 à 13 octobre 2025", 
        type: "Pourcentage", 
        valeur: "10 %", 
        statut: "Active", 
        montantMinimum: "Min : 5000 Ar",
        dateDebut: "2025-09-12",
        dateFin: "2025-10-13",
    },
    { 
        id: 2, 
        code: "ARATO569", 
        nom: "Joyeuse fete de paques 12 avril 2025 à 12 mai 2025", 
        type: "Montant fixe", 
        valeur: "5000 Ar", 
        statut: "Active", 
        montantMinimum: "Min : 500000 Ar",
        dateDebut: "2025-04-12",
        dateFin: "2025-05-12",
    },
];

const Promotions = () => {
    const [promotions, setPromotions] = useState(initialPromotions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promotionAEditer, setPromotionAEditer] = useState(null);

    // Assigner un nouvel ID basé sur le plus grand existant ou commencer à 1
    const getNextId = () => {
        const maxId = promotions.reduce((max, p) => Math.max(max, p.id || 0), 0);
        return maxId + 1;
    };

    const handleSavePromotion = (promotionData) => {
        let promotionMisAJour = { ...promotionData };

        if (promotionAEditer) {
            // Mise à jour: conserve l'ID existant
            setPromotions(promotions.map(p => 
                p.id === promotionMisAJour.id ? promotionMisAJour : p
            ));
        } else {
            // Création: assigne un nouvel ID
            promotionMisAJour.id = getNextId(); 
            setPromotions([...promotions, promotionMisAJour]);
        }
        
        setPromotionAEditer(null);
        setIsModalOpen(false);
    };

    const handleEdit = (promotion) => {
        setPromotionAEditer(promotion);
        setIsModalOpen(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")) {
            setPromotions(promotions.filter(p => p.id !== id));
        }
    };
    
    const openAjouterModal = () => {
        setPromotionAEditer(null); 
        setIsModalOpen(true);
    };

    return (
        <div className="gestion-promotions-bo">
            <header className="header-promotions-bo">
                <h1 className="titre-page-bo">🎁 Gestion des Codes Promo</h1>
                <button
                    className="btn-ajouter-promotion-bo"
                    onClick={openAjouterModal}
                >
                    <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Ajouter une promotion
                </button>
            </header>
            
            <div className="table-container-bo">
                <table className="promotions-table-bo">
                    <thead>
                        <tr>
                            <th>Code Promo</th>
                            <th>Nom & Période</th>
                            <th>Type</th>
                            <th>Valeur</th>
                            <th>Montant Min.</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((promo) => (
                            <tr key={promo.id}>
                                <td className="code-promo-td">{promo.code}</td>
                                <td>{promo.nom}</td>
                                <td>
                                    <span className={`badge-type-bo badge-type-${promo.type.replace(/\s/g, '').toLowerCase()}`}>
                                        {promo.type}
                                    </span>
                                </td>
                                <td>{promo.valeur}</td>
                                <td>{promo.montantMinimum}</td>
                                <td>
                                    <span className={`badge-statut-bo badge-statut-${promo.statut.toLowerCase()}`}>
                                        {promo.statut}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions-cell-bo">
                                        <button 
                                            className="btn-action-editer"
                                            onClick={() => handleEdit(promo)}
                                        >
                                            <svg className="icone-action-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-9l5 5L15 21H9l-5-5L17 3z"></path></svg>
                                            Éditer
                                        </button>
                                        <button 
                                            className="btn-action-supprimer"
                                            onClick={() => handleDelete(promo.id)}
                                        >
                                            <svg className="icone-action-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AjouterPromotionModal
                    // Le modal a besoin de la prop 'isOpen' pour son affichage stylistique
                    isOpen={isModalOpen} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setPromotionAEditer(null); // Réinitialiser le mode édition/création
                    }}
                    onSave={handleSavePromotion}
                    // Passe la promotion à éditer ou null si c'est une création
                    promotion={promotionAEditer} 
                />
            )}
        </div>
    );
};

export default Promotions;