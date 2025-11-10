import React, { useState, useEffect } from 'react';

const AjouterPromotionModal = ({ isOpen, onClose, onSave, promotionAEditer }) => {
    const [code, setCode] = useState('');
    const [nom, setNom] = useState('');
    const [type, setType] = useState('Pourcentage');
    const [valeur, setValeur] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [montantMinimum, setMontantMinimum] = useState('');

    useEffect(() => {
        if (promotionAEditer) {
            setCode(promotionAEditer.codePromo);
            setNom(promotionAEditer.nomPromotion);
            setType(promotionAEditer.typePromotion || 'Pourcentage'); // Utilise typePromotion
            setValeur(promotionAEditer.valeur);
            setDateDebut(promotionAEditer.dateDebut ? promotionAEditer.dateDebut.split(' ')[0] : '');
            setDateFin(promotionAEditer.dateFin ? promotionAEditer.dateFin.split(' ')[0] : '');
            setMontantMinimum(promotionAEditer.montantMinimum);
        } else {
            setCode('');
            setNom('');
            setType('Pourcentage');
            setValeur('');
            setDateDebut('');
            setDateFin('');
            setMontantMinimum('');
        }
    }, [promotionAEditer, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const promotionEnregistree = {
            codePromo: code,
            nomPromotion: nom,
            typePromotion: type, // Envoie la clé attendue par le backend
            valeur,
            dateDebut,
            dateFin,
            montantMinimum,
            statutPromotion: 'Active',
        };

        onSave(promotionEnregistree);
    };

    return (
        <div className="modal-overlay-bo">
            <div className="modal-container-bo">
                <div className="modal-header-bo">
                    <h2 className="modal-titre-bo">
                        {promotionAEditer ? 'Éditer la promotion' : 'Nouvelle promotion'}
                    </h2>
                    <button onClick={onClose} className="modal-fermer-bo">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form-bo">
                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Code Promo *</label>
                        <input type="text" className="form-input-bo" value={code} onChange={(e) => setCode(e.target.value)} required />
                    </div>

                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Nom de l'événement / Description *</label>
                        <input type="text" className="form-input-bo" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    
                    <div className="form-row-bo">
                        <div className="form-groupe-bo">
                            <label className="form-label-bo">Type de réduction *</label>
                            <select className="form-select-bo" value={type} onChange={(e) => setType(e.target.value)} required>
                                <option value="Pourcentage">Pourcentage (%)</option>
                                <option value="Montant fixe">Montant fixe (Ar)</option>
                            </select>
                        </div>
                        <div className="form-groupe-bo">
                            <label className="form-label-bo">Valeur ({type === 'Pourcentage' ? '%' : 'Ar'}) *</label>
                            <input type="number" className="form-input-bo" value={valeur} onChange={(e) => setValeur(e.target.value)} required min="0" step="0.01"/>
                        </div>
                    </div>

                    <div className="form-groupe-bo">
                        <label className="form-label-bo">Montant minimum d'achat (Ar) *</label>
                        <input type="number" className="form-input-bo" value={montantMinimum} onChange={(e) => setMontantMinimum(e.target.value)} required min="0" step="0.01"/>
                    </div>

                    <div className="form-row-bo">
                        <div className="form-groupe-bo">
                            <label className="form-label-bo">Date de Début *</label>
                            <input type="date" className="form-input-bo" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
                        </div>
                        <div className="form-groupe-bo">
                            <label className="form-label-bo">Date de Fin *</label>
                            <input type="date" className="form-input-bo" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-actions-bo">
                        <button type="button" className="btn-annuler-bo" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn-enregistrer-bo">
                            {promotionAEditer ? 'Sauvegarder' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterPromotionModal;