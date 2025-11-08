import React, { useState, useEffect } from 'react';
import { getCategories, createCategorie, deleteCategorie } from '../../../services/categorieService'; // ← IMPORT CORRIGÉ

const Categorie = ({ onCategoriesChange }) => {
    const [categories, setCategories] = useState([]);
    const [nouvelleCategorieNom, setNouvelleCategorieNom] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les catégories depuis l'API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories(); // ← UTILISER LE SERVICE
                setCategories(data);
                onCategoriesChange(data);
                setError(null);
            } catch (err) {
                console.error("Erreur chargement catégories: ", err);
                if (err.response?.status === 401) {
                    setError("Veuillez vous connecter pour accéder aux catégories");
                } else {
                    setError("Impossible de charger les catégories");
                }
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [onCategoriesChange]);

    const handleAjouterCategorie = async (e) => { // ← ASYNC AJOUTÉ
        e.preventDefault();
        if (!nouvelleCategorieNom.trim()) return;

        try {
            const nouvelleCategorie = await createCategorie(nouvelleCategorieNom.trim()); // ← UTILISER LE SERVICE
            const newCategories = [...categories, nouvelleCategorie];
            setCategories(newCategories);
            setNouvelleCategorieNom('');
            onCategoriesChange(newCategories);
        } catch (error) {
            console.error("Erreur création catégorie: ", error);
            alert("Erreur lors de la création de la catégorie");
        }
    };

    const handleSupprimerCategorie = async (id) => { // ← ASYNC AJOUTÉ
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
        
        try {
            await deleteCategorie(id); // ← UTILISER LE SERVICE
            const newCategories = categories.filter(cat => cat.id !== id);
            setCategories(newCategories);
            onCategoriesChange(newCategories);
        } catch (error) {
            console.error("Erreur suppression catégorie: ", error);
            alert("Erreur lors de la suppression de la catégorie");
        }
    };

    if (loading) return <p>Chargement des catégories...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="gestion-categories">
            <h2 className="titre-section">Catégories</h2>
            
            <form onSubmit={handleAjouterCategorie} className="form-categorie">
                <input
                    type="text"
                    value={nouvelleCategorieNom}
                    onChange={(e) => setNouvelleCategorieNom(e.target.value)}
                    placeholder="Nom de la nouvelle catégorie"
                    className="input-categorie"
                    required
                />
                <button type="submit" className="btn-ajouter-categorie">
                    <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </form>

            <ul className="liste-categories">
                {categories?.map(categorie => (
                    <li key={categorie.id} className="categorie-item">
                        <span>{categorie.nom} (ID: {categorie.id})</span>
                        <div className="categorie-actions">
                            <button className="btn-editer-categorie">Éditer</button>
                            <button 
                                onClick={() => handleSupprimerCategorie(categorie.id)}
                                className="btn-supprimer-categorie"
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorie;