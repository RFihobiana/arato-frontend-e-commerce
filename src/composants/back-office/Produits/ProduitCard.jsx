import React from 'react';

const ProduitCard = ({ produit, onEdit, onDelete }) => {
    const imageUrl = produit.image; 

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'contain' 
    };

    return (
        <div className="produit-card-bo">
            {produit.promotion && produit.promotion.valeur && (
                <span className="promo-cercle-bo">{produit.promotion.valeur}</span>
            )}
            
            <div className="produit-image-container-bo">
                <span className="image-placeholder-bo">{imageUrl.substring(0, 15)}...</span>
            </div>

            <div className="produit-text-bo">
                <h3 className="produit-nom-bo">{produit.nom}</h3>
                <p className="produit-prix-bo">{produit.prix}</p>
                <p className="produit-cat-bo">Catégorie ID: {produit.numCategorie}</p>

                <div className="produit-actions-bo">
                    <button 
                        className="btn-editer" 
                        onClick={() => onEdit(produit)}
                    >
                        Éditer
                    </button>
                    <button 
                        className="btn-supprimer"
                        onClick={() => onDelete(produit.id)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProduitCard;