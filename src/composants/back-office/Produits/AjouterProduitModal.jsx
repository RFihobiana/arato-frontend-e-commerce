import React, { useState, useEffect } from 'react';
import { createProduit, updateProduit } from '../../../services/produitService';
import { fetchPromotions } from '../../../services/promotionService';
import { toast } from 'react-toastify';

const AjouterProduitModal = ({ isOpen, onClose, onSave, produitAEditer, categories }) => {
    const [nom, setNom] = useState('');
    const [prix, setPrix] = useState('');
    const [poids, setPoids] = useState('');
    const [quantiteStock, setQuantiteStock] = useState('');
    const [image, setImage] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    const [numCategorie, setNumCategorie] = useState('');
    const [numPromotion, setNumPromotion] = useState('');
    const [promotions, setPromotions] = useState([]);
    useEffect(() => {
        console.log("produitAEditer reçu :", produitAEditer);
    }, [produitAEditer]);
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPromotions();
                setPromotions(data || []);
            } catch (err) {
                console.error("Erreur promotions:", err);
            }
        };
        load();
    }, []);
    useEffect(() => {
        if (!produitAEditer) {
            setNom('');
            setPrix('');
            setPoids('');
            setQuantiteStock('');
            setImage(null);
            setImageFileName('');
            setNumCategorie(categories[0]?.numCategorie || '');
            setNumPromotion('');
            return;
        }
        setNom(produitAEditer.nomProduit || '');
        setPrix(produitAEditer.prix?.toString() || '');
        setPoids(produitAEditer.poids?.toString() || '');
        setQuantiteStock(produitAEditer.quantiteStock?.toString() || '');
        setNumCategorie(produitAEditer.numCategorie || categories[0]?.numCategorie || '');
        setNumPromotion(produitAEditer.numPromotion || '');
        setImage(null);
        setImageFileName(produitAEditer.image ? produitAEditer.image.split('/').pop() : '');

        console.log("Inputs remplis avec :", {
            nom: produitAEditer.nomProduit,
            prix: produitAEditer.prix,
            categorie: produitAEditer.numCategorie
        });
    }, [produitAEditer, categories]);
    useEffect(() => {
        if (!isOpen) {
            setNom('');
            setPrix('');
            setPoids('');
            setQuantiteStock('');
            setImage(null);
            setImageFileName('');
            setNumCategorie('');
            setNumPromotion('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageFileName(file.name);
        } else {
            setImage(null);
            setImageFileName(produitAEditer?.image ? produitAEditer.image.split('/').pop() : '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const produitId = produitAEditer?.id ?? produitAEditer?.numProduit;
        console.log("ID pour update :", produitId);

        if (produitAEditer && !produitId) {
            toast("ID manquant !");
            return;
        }

        const formData = new FormData();
        formData.append('nomProduit', nom);
        formData.append('prix', prix);
        formData.append('poids', poids);
        formData.append('quantiteStock', quantiteStock);
        formData.append('numCategorie', numCategorie);
        if (numPromotion) formData.append('numPromotion', numPromotion);

        if (image instanceof File) {
            formData.append('image', image);
        }

        try {
            let result;
            if (produitAEditer) {
                  result = await updateProduit(produitId, formData);
            } else {
                    result = await createProduit(formData);
            }
            onSave(result);
            onClose();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toast.error("Erreur ! Vérifie la console.");
        }
    };

    const boutonTexte = produitAEditer ? 'Confirmer' : 'Créer';

    return (
        <div className="modal-overlay-bo" onClick={onClose}>
            <div className="modal-container-bo" onClick={e => e.stopPropagation()}>
                <div className="modal-header-bo">
                    <h2 className="modal-titre-bo">
                        {produitAEditer ? 'Modifier le produit' : 'Ajouter un produit'}
                    </h2>
                    <button onClick={onClose} className="modal-fermer-bo">×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form-bo">
                    <div className="form-groupe-bo">
                        <label>Nom *</label>
                        <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
                    </div>

                    <div className="form-row-bo">
                        <div className="form-groupe-bo">
                            <label>Prix (Ar) *</label>
                            <input type="number" value={prix} onChange={e => setPrix(e.target.value)} required min="0" step="0.01" />
                        </div>
                        <div className="form-groupe-bo">
                            <label>Stock *</label>
                            <input type="number" value={quantiteStock} onChange={e => setQuantiteStock(e.target.value)} required min="0" />
                        </div>
                    </div>

                    <div className="form-row-bo">
                        <div className="form-groupe-bo">
                            <label>Poids (kg) *</label>
                            <input type="number" value={poids} onChange={e => setPoids(e.target.value)} required min="0" step="0.01" />
                        </div>
                        <div className="form-groupe-bo">
                            <label>Catégorie *</label>
                            <select value={numCategorie} onChange={e => setNumCategorie(e.target.value)} required>
                                {categories.map(cat => (
                                    <option key={cat.numCategorie} value={cat.numCategorie}>
                                        {cat.nomCategorie}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-groupe-bo">
                        <label>Image {produitAEditer ? '' : '*'}</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {imageFileName && <p className="image-info-bo">Fichier : {imageFileName}</p>}
                    </div>

                    <div className="form-groupe-bo">
                        <label>Promotion</label>
                        <select value={numPromotion || ''} onChange={e => setNumPromotion(e.target.value)}>
                            <option value="">Aucune</option>
                            {promotions.map(promo => (
                                <option key={promo.numPromotion} value={promo.numPromotion}>
                                    {promo.nomPromotion} — {promo.valeur}{promo.typePromotion === "Pourcentage" ? "%" : "Ar"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions-bo">
                        <button type="button" onClick={onClose} className="btn-annuler-bo">
                            Annuler
                        </button>
                        <button type="submit" className="btn-enregistrer-bo">
                            {boutonTexte}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterProduitModal;