import React, { useState, useEffect } from 'react';

const AjouterArticleModal = ({ isOpen, onClose, onSave, article }) => {
    const initialState = {
        numArticle: article ? article.numArticle : null,
        titre: '',
        description: '', // correspond à 'contenu' côté back
        auteur: '',
        datePublication: new Date().toISOString().substring(0, 10),
        image: null, // on stocke le fichier
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (article) {
            setFormData({
                numArticle: article.numArticle,
                titre: article.titre || '',
                description: article.description || '',
                auteur: article.auteur || '',
                datePublication: article.datePublication ? article.datePublication.substring(0, 10) : new Date().toISOString().substring(0, 10),
                image: null, // le fichier sera sélectionné à nouveau si besoin
            });
        } else {
            setFormData(initialState);
        }
    }, [article]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        data.append('contenu', formData.description); // si ton back utilise 'contenu'
        data.append('auteur', formData.auteur);
        data.append('datePublication', formData.datePublication);

        if (formData.image) {
            data.append('image', formData.image);
        }

        onSave(data); // le parent doit utiliser articleService avec multipart/form-data
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
                        <label htmlFor="description">Contenu / Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" required />
                    </div>

                    <div className="form-group-bo">
                        <label htmlFor="image">Image de l'article</label>
                        <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
                    </div>

                 
                        <button type="button" className="btn-annuler-bo" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn-sauvegarder-bo">Sauvegarder</button>
                  
                </form>
            </div>
        </div>
    );
};

export default AjouterArticleModal;
