import React from 'react';

const ProduitCard = ({ produit, onEdit, onDelete, getNomCategorie }) => {
    if (!produit) return null;

    const produitId = produit.id ?? produit.numProduit;
    if (!produitId) {
        console.warn("Produit sans ID :", produit);
        return null;
    }

    const nomCategorie = getNomCategorie(produit.numCategorie) || "Catégorie inconnue";

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

    const handleEdit = () => {
       
        onEdit(produit);
    };

    return (
        <div className="produit-card-bo">
            {produit.promotion?.valeur && (
                <span className="promo-cercle-bo">
                    {produit.promotion.valeur}
                    {produit.promotion.typePromotion === "Pourcentage" ? "%" : "Ar"}
                </span>
            )}

            <div className="produit-image-container-bo">
                <img
                    src={`${IMAGE_BASE_URL}${produit.image}`}
                    alt={produit.nomProduit || "Produit"}
                    onError={(e) => {
                        e.target.src = "/placeholder.png";
                    }}
                />
            </div>

            <div className="produit-text-bo">
                <h3 className="produit-nom-bo">{produit.nomProduit || "Nom inconnu"}</h3>
                <p className="produit-prix-bo">{Number(produit.prix || 0).toFixed(2)} Ar</p>
                <p className="produit-cat-bo">{nomCategorie}</p>

                <div className="produit-actions-bo">
                    <button className="btn-editer" onClick={handleEdit}>
                        Éditer
                    </button>
                    <button
                        className="btn-supprimer"
                        onClick={() => {
                            onDelete(produitId)
                        }}
                        disabled={!produitId}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProduitCard;