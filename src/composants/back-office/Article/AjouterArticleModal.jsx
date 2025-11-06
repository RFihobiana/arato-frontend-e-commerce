import React, { useState, useEffect } from 'react';

const AjouterArticleModal = ({ isOpen, onClose, onSave, article }) => {
    const initialState = {
        numArticle: article ? article.numArticle : null,
        titre: '',
        resume: '',
        description: '',
        auteur: '',
        datePublication: new Date().toISOString().substring(0, 10),
        image: '',
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (article) {
            setFormData({
                numArticle: article.numArticle,
                titre: article.titre || '',
                resume: article.resume || '',
                description: article.description || '',
                auteur: article.auteur || '',
                datePublication: article.datePublication ? article.datePublication.substring(0, 10) : new Date().toISOString().substring(0, 10),
                image: article.image || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [article]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-bo modal-article">
                <header className="modal-header-bo">
                    <h2>{article ? 'Éditer' : 'Ajouter'} un Article</h2>
                    <button className="btn-fermer-modal-bo" onClick={onClose}>&times;</button>
                </header>
                
                <form className="modal-form-bo" onSubmit={handleSubmit}>
                    
                    <div className="form-group-bo">
                        <label htmlFor="titre">Titre de l'Article</label>
                        <input type="text" id="titre" name="titre" value={formData.titre} onChange={handleChange} required />
                    </div>

                    <div className="form-group-bo">
                        <label htmlFor="auteur">Auteur</label>
                        <input type="text" id="auteur" name="auteur" value={formData.auteur} onChange={handleChange} required />
                    </div>

                    <div className="form-group-bo">
                        <label htmlFor="datePublication">Date de Publication</label>
                        <input type="date" id="datePublication" name="datePublication" value={formData.datePublication} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group-bo">
                        <label htmlFor="resume">Résumé (Court)</label>
                        <textarea id="resume" name="resume" value={formData.resume} onChange={handleChange} rows="3" required />
                    </div>

                    <div className="form-group-bo">
                        <label htmlFor="description">Contenu Détaillé</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" required />
                    </div>

                    <div className="form-group-bo">
                        <label htmlFor="image">Nom du Fichier Image</label>
                        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
                    </div>

                    <footer className="modal-footer-bo">
                        <button type="button" className="btn-annuler-bo" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn-sauvegarder-bo">
                            Sauvegarder
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AjouterArticleModal;