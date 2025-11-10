import React from 'react';

<<<<<<< HEAD
const ProduitCard = ({ produit, onEdit, onDelete, getNomCategorie }) => {
=======
const ProduitCard = ({ produit, onEdit, onDelete }) => {
>>>>>>> 95c0e233250fc2f70e2cd80ceef6fe0f37dfc1dc
    if (!produit) return null;

    return (
        <div className="produit-card-bo">
            {produit.promotion?.valeur && (
                <span className="promo-cercle-bo">{produit.promotion.valeur}</span>
            )}
<<<<<<< HEAD
=======

>>>>>>> 95c0e233250fc2f70e2cd80ceef6fe0f37dfc1dc
            <div className="produit-image-container-bo">
                <img 
                    src={produit.image || "/placeholder.png"} 
                    alt={produit.nomProduit || "Produit"} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
            <div className="produit-text-bo">
                <h3 className="produit-nom-bo">{produit.nomProduit || "Nom inconnu"}</h3>
                <p className="produit-prix-bo">{produit.prix || 0} Ar</p>
<<<<<<< HEAD
                <p className="produit-cat-bo">{getNomCategorie(produit.numCategorie)}</p>
=======
                <p className="produit-cat-bo">Catégorie ID: {produit.numCategorie || "N/A"}</p>

>>>>>>> 95c0e233250fc2f70e2cd80ceef6fe0f37dfc1dc
                <div className="produit-actions-bo">
                    <button className="btn-editer" onClick={() => onEdit(produit)}>Éditer</button>
                    <button className="btn-supprimer" onClick={() => onDelete(produit.id)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};

export default ProduitCard;
