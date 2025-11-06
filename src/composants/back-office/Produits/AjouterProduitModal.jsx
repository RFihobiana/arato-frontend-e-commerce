import React, { useState, useEffect } from 'react';

const AjouterProduitModal = ({ isOpen, onClose, onSave, produitAEditer, categories }) => {
    const [nom, setNom] = useState('');
    const [prix, setPrix] = useState('');
    const [image, setImage] = useState('');
    const [numCategorie, setNumCategorie] = useState(1);
    const [promotionValeur, setPromotionValeur] = useState('');
    
    useEffect(() => {
        const defaultCatId = categories.length > 0 ? categories[0].id : 1;
        if (produitAEditer) {
            setNom(produitAEditer.nom);
            setPrix(produitAEditer.prix);
            setImage(produitAEditer.image);
            setNumCategorie(produitAEditer.numCategorie);
            setPromotionValeur(produitAEditer.promotion?.valeur || '');
        } else {
            setNom('');
            setPrix('');
            setImage('');
            setNumCategorie(defaultCatId);
            setPromotionValeur('');
        }
    }, [produitAEditer, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const produitEnregistre = {
            id: produitAEditer ? produitAEditer.id : Date.now(),
            nom,
            prix,
            image,
            numCategorie: parseInt(numCategorie, 10),
            promotion: promotionValeur ? { valeur: promotionValeur } : null,
        };

        onSave(produitEnregistre);
    };

    return (
        <div className="modal-overlay-bo">
            <div className="modal-container-bo">
                <div className="modal-header-bo">
                    <h2 className="modal-titre-bo">
                        {produitAEditer ? 'Éditer le produit' : 'Nouveau produit'}
                    </h2>
                    <button onClick={onClose} className="modal-fermer-bo">
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form-bo">
                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Nom *</label>
                        <input type="text" className="form-input-bo" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>

                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Prix (ex: 500Ar/kg) *</label>
                        <input type="text" className="form-input-bo" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                    </div>

                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Catégorie *</label>
                        <select 
                            className="form-select-bo" 
                            value={numCategorie} 
                            onChange={(e) => setNumCategorie(e.target.value)} 
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nom}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Image (Nom du fichier/URL) *</label>
                        <input type="text" className="form-input-bo" value={image} onChange={(e) => setImage(e.target.value)} required />
                    </div>
                    
                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Promotion (Ex: -20%)</label>
                        <input 
                            type="text" 
                            className="form-input-bo" 
                            value={promotionValeur} 
                            onChange={(e) => setPromotionValeur(e.target.value)} 
                            placeholder="Laisser vide si pas de promo"
                        />
                    </div>

                    <div className="form-actions-bo">
                        <button type="button" className="btn-annuler-bo" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-enregistrer-bo">
                            {produitAEditer ? 'Sauvegarder' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterProduitModal;