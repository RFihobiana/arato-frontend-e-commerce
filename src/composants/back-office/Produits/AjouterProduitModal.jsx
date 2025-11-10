import React, { useState, useEffect } from 'react';
import { createProduit, updateProduit } from '../../../services/produitService';
import { fetchPromotions } from '../../../services/promotionService';

const AjouterProduitModal = ({ isOpen, onClose, onSave, produitAEditer, categories }) => {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [poids, setPoids] = useState('');
  const [quantiteStock, setQuantiteStock] = useState('');
  const [image, setImage] = useState(null);
  const [numCategorie, setNumCategorie] = useState(1);
  const [numPromotion, setNumPromotion] = useState('');
  const [promotions, setPromotions] = useState([]);
 useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await fetchPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Erreur de chargement des promotions :', error);
      }
    };
    loadPromotions();
  }, []);
  useEffect(() => {
    const defaultCatId = categories.length > 0 ? categories[0].numCategorie : 1;
    if (produitAEditer) {
      setNom(produitAEditer.nomProduit);
      setPrix(produitAEditer.prix);
      setPoids(produitAEditer.poids || '');
      setQuantiteStock(produitAEditer.quantiteStock || '');
      setImage(produitAEditer.image);
      setNumCategorie(produitAEditer.numCategorie);
      setNumPromotion(produitAEditer.numPromotion || '');
    } else {
      setNom('');
      setPrix('');
      setPoids('');
      setQuantiteStock('');
      setImage(null);
      setNumCategorie(defaultCatId);
      setNumPromotion('');
    }
  }, [produitAEditer, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nomProduit', nom);
    formData.append('prix', prix);
    formData.append('poids', poids);
    formData.append('quantiteStock', quantiteStock);
    formData.append('numCategorie', numCategorie);
    if (image instanceof File) formData.append('image', image);
    if (numPromotion) formData.append('numPromotion', numPromotion);

    try {
      let produitEnregistre;
      if (produitAEditer) {
        produitEnregistre = await updateProduit(produitAEditer.id, formData);
      } else {
        produitEnregistre = await createProduit(formData);
      }
      onSave(produitEnregistre);
    } catch (error) {
      console.error('Erreur d’enregistrement du produit:', error);
      alert("Erreur lors de l'enregistrement du produit !");
    }
  };

  return (
    <div className="modal-overlay-bo">
      <div className="modal-container-bo">
        <div className="modal-header-bo">
          <h2 className="modal-titre-bo">
            {produitAEditer ? 'Modifier un produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose} className="modal-fermer-bo">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-bo">
          <div className="form-groupe-bo">
            <label className="form-label-bo">Nom *</label>
            <input type="text" className="form-input-bo" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Prix *</label>
            <input type="number" className="form-input-bo" value={prix} onChange={(e) => setPrix(e.target.value)} required />
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Poids *</label>
            <input type="number" className="form-input-bo" value={poids} onChange={(e) => setPoids(e.target.value)} required />
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Quantité en stock *</label>
            <input type="number" className="form-input-bo" value={quantiteStock} onChange={(e) => setQuantiteStock(e.target.value)} required />
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Catégorie *</label>
            <select className="form-select-bo" value={numCategorie} onChange={(e) => setNumCategorie(e.target.value)} required>
              {categories.map(cat => (
                <option key={cat.numCategorie} value={cat.numCategorie}>{cat.nomCategorie}</option>
              ))}
            </select>
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Promotion</label>
            <select
              className="form-select-bo"
              value={numPromotion || ''}
              onChange={(e) => setNumPromotion(e.target.value)}
            >
              <option value="">Aucune promotion</option>
              {promotions.map(promo => (
                <option key={promo.numPromotion} value={promo.numPromotion}>
                  {promo.nomPromotion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-groupe-bo">
            <label className="form-label-bo">Image *</label>
            <input type="file" className="form-input-bo" onChange={(e) => setImage(e.target.files[0])} />
            {image && typeof image === 'string' && <p>Image actuelle : {image}</p>}
          </div>

          <div className="form-actions-bo">
            <button type="button" className="btn-annuler-bo" onClick={onClose}>Annuler</button>
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
