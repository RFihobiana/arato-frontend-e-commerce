import React, { useState, useEffect } from 'react';
import { createArticle, updateArticle } from '../../../services/articleService';

const AjouterArticleModal = ({ isOpen, onClose, onSave, articleAEditer }) => {
    const today = new Date().toISOString().split('T')[0]; 

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [contenu, setContenu] = useState(''); 
    const [auteur, setAuteur] = useState('');
    const [datePublication, setDatePublication] = useState(today);
    const [image, setImage] = useState(null);
const [imageFileName, setImageFileName] = useState('');

    useEffect(() => {
        if (articleAEditer) {
            setTitre(articleAEditer.titre || '');
            setDescription(articleAEditer.description || '');
            setContenu(articleAEditer.contenu || ''); 
            setAuteur(articleAEditer.auteur || '');
            setDatePublication(articleAEditer.datePublication ? articleAEditer.datePublication.split(' ')[0] : today);
            setImage(null);
             setImageFileName(articleAEditer.image ? articleAEditer.image.split('/').pop() : '');

            
        } else {
            setTitre('');
            setDescription('');
            setContenu('');
            setAuteur('');
            setDatePublication(today);
            setImage(null);
             setImageFileName('');
        }
    }, [articleAEditer]);

    if (!isOpen) return null;

     const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageFileName(file.name);
        } else {
            setImage(null);
            setImageFileName(articleAEditer?.image ? produitAEditer.image.split('/').pop() : '');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (datePublication < today) {
            alert(" La date de publication ne peut pas être antérieure à aujourd'hui !");
            return;
        }

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('contenu', contenu); 
        formData.append('auteur', auteur);
        formData.append('datePublication', datePublication);
          if (image instanceof File) {
            formData.append('image', image);
        }
        if (articleAEditer) formData.append('_method', 'PUT'); 

        try {
            if (articleAEditer) {
                await updateArticle(articleAEditer.numArticle, formData);
            } else {
                await createArticle(formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Erreur de sauvegarde de l’article :", error);
            alert("Erreur lors de sauvegarde de l’article.");
        }
    };

    return (
        <div className="bo-modal-overlay">
            <div className="bo-modal-container">
                <header className="bo-modal-header">
                    <h3 className="bo-modal-title">{articleAEditer ? "Modifier l’article" : "Ajouter un nouvel article"}</h3>
                    <button className="bo-modal-close-btn" onClick={onClose}>&times;</button>
                </header>
                
                <form onSubmit={handleSubmit} className="bo-modal-form">
                    <div className="bo-form-group">
                        <label className="bo-form-label">Titre</label>
                        <input
                            type="text"
                            className="bo-form-input"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="bo-form-group">
                        <label className="bo-form-label">Résumé/Description (Max 255)</label>
                        <textarea
                            className="bo-form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="bo-form-group">
                        <label className="bo-form-label">Contenu Complet</label>
                        <textarea
                            className="bo-form-input"
                            value={contenu}
                            onChange={(e) => setContenu(e.target.value)}
                            rows="6"
                            required
                        />
                    </div>

                    <div className="bo-form-group-row">
                        <div className="bo-form-group">
                             <label className="bo-form-label">Auteur</label>
                            <input
                                type="text"
                                className="bo-form-input"
                                value={auteur}
                                onChange={(e) => setAuteur(e.target.value)}
                                required
                            />
                        </div>
                        <div className="bo-form-group">
                            <label className="bo-form-label">Date de Publication</label>
                            <input
                                type="date"
                                className="bo-form-input"
                                value={datePublication}
                                onChange={(e) => setDatePublication(e.target.value)}
                                min={today}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="bo-form-group">
                        <label className="bo-form-label">Image de l'article</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="bo-form-input-file"
                            onChange={handleFileChange}
                                required={!articleAEditer}
                        />
                            {imageFileName && <p className="image-info-bo">Fichier : {imageFileName}</p>}
                 
                    </div>

                    <div className="bo-modal-actions">
                        <button type="submit" className="bo-btn-primaire">Enregistrer</button>
                        <button type="button" className="bo-btn-annuler" onClick={onClose}>Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterArticleModal;
