import React, { useEffect } from 'react';

const ProduitCard = ({ produit, onEdit, onDelete, getNomCategorie }) => {
    if (!produit) return null;
    const produitId = produit.id ?? produit.numProduit;
    return (
        <div className="produit-card-bo">
            {produit.promotion?.valeur && <span className="promo-cercle-bo">{produit.promotion.valeur}</span>}
            <div className="produit-image-container-bo">
                <img src={`http://localhost:8000${produit.image}` || "/placeholder.png"} alt={produit.nomProduit || "Produit"} />
            </div>
            <div className="produit-text-bo">
                <h3 className="produit-nom-bo">{produit.nomProduit || "Nom inconnu"}</h3>
                <p className="produit-prix-bo">{produit.prix || 0} Ar</p>
                <p className="produit-cat-bo">{getNomCategorie(produit.numCategorie)}</p>
                <div className="produit-actions-bo">
                    <button className="btn-editer" onClick={() => onEdit(produitId)}>Éditer</button>
                    <button className="btn-supprimer" onClick={() => produitId && onDelete(produitId)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};

export default ProduitCard;
