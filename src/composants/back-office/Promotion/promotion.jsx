import React, { useState, useEffect } from 'react';
import AjouterPromotionModal from './AjouterPromotionModal';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../../../services/promotionService';
import "../../../styles/back-office/Promotions.css";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promotionAEditer, setPromotionAEditer] = useState(null);

    const loadPromotions = async () => {
        try {
            const data = await fetchPromotions();
            setPromotions(data);
        } catch (error) {
            console.error("Erreur chargement promotions:", error);
        }
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    const handleSavePromotion = async (promotionData) => {
        try {
            let promotionEnregistree;
            if (promotionAEditer) {
                promotionEnregistree = await updatePromotion(promotionAEditer.numPromotion, promotionData);
                setPromotions(promotions.map(p => p.numPromotion === promotionAEditer.numPromotion ? promotionEnregistree : p));
            } else {
                promotionEnregistree = await createPromotion(promotionData);
                setPromotions([...promotions, promotionEnregistree]);
            }
            setPromotionAEditer(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur sauvegarde promotion:", error);
            // Afficher l'erreur pour l'utilisateur si possible
            toast.error(error.response?.data?.message || "Une erreur est survenue lors de la sauvegarde.");
        }
    };

    const handleEdit = (promo) => {
        setPromotionAEditer(promo);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if ((await Swal.fire("Êtes-vous sûr de vouloir supprimer cette promotion ?")).isConfirmed) {
            try {
                await deletePromotion(id);
                setPromotions(promotions.filter(p => p.numPromotion !== id));
            } catch (error) {
                console.error("Erreur suppression promotion:", error);
                toast.error(error.response?.data?.message || "Une erreur est survenue lors de la suppression.");
            }
        }
    };

    return (
        <div className="gestion-promotions-bo">
            <header className="header-promotions-bo">
                <h1 className="titre-page-bo">🎁 Gestion des Codes Promo</h1>
                <button className="btn-ajouter-promotion-bo" onClick={() => {setPromotionAEditer(null); setIsModalOpen(true);}}>
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
                            <tr key={promo.numPromotion}>
                                <td>{promo.codePromo}</td>
                                <td>{promo.nomPromotion}</td>
                                <td>{promo.typePromotion || 'Pourcentage'}</td>
                                <td>{promo.valeur}</td>
                                <td>{promo.montantMinimum || '0'}</td>
                                <td>{promo.statutPromotion}</td>
                                <td>
                                    <button onClick={() => handleEdit(promo)}>Éditer</button>
                                    <button onClick={() => handleDelete(promo.numPromotion)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <AjouterPromotionModal
                    isOpen={isModalOpen}
                    onClose={() => {setIsModalOpen(false); setPromotionAEditer(null);}}
                    onSave={handleSavePromotion}
                    promotionAEditer={promotionAEditer}
                />
            )}
        </div>
    );
};

export default Promotions;