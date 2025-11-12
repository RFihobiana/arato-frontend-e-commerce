import React, { useState, useEffect } from 'react';
import { getCategories, createCategorie, deleteCategorie, updateCategorie } from '../../../services/categorieService';

const Categorie = ({ onCategoriesChange }) => {
    const [categories, setCategories] = useState([]);
    const [nouvelleCategorieNom, setNouvelleCategorieNom] = useState('');
    const [categorieAEditer, setCategorieAEditer] = useState(null);
    const [nomEdition, setNomEdition] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
                onCategoriesChange?.(data);
                setError(null);
            } catch (err) {
                console.error("Erreur détaillée:", err);
                setError(err.response?.data?.message || "Impossible de charger les catégories");
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, [onCategoriesChange]);

    const checkAuth = () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("Veuillez vous connecter pour effectuer cette action.");
            return false;
        }
        return true;
    }

    const handleAjouterCategorie = async (e) => {
        e.preventDefault();
        if (!nouvelleCategorieNom.trim() || !checkAuth()) return;

        try {
            const nouvelleCategorie = await createCategorie(nouvelleCategorieNom.trim());
            const newCategories = [...categories, nouvelleCategorie];
            setCategories(newCategories);
            setNouvelleCategorieNom('');
            onCategoriesChange?.(newCategories);
        } catch (err) {
            console.error("Erreur création:", err);
            if (err.response?.status === 422) {
                alert("Cette catégorie existe déjà !");
            } else {
                alert(err.response?.data?.message || "Erreur lors de la création de la catégorie");
            }
        }
    };

    const handleEditerOuMettreAJour = async (cat) => {
        if (!checkAuth()) return;
        
        if (categorieAEditer && categorieAEditer.numCategorie === cat.numCategorie) {
            if (!nomEdition.trim()) return;
            
            try {
                const categorieMiseAJour = await updateCategorie(cat.numCategorie, nomEdition.trim());
                
                const newCategories = categories.map(c => 
                    c.numCategorie === cat.numCategorie ? categorieMiseAJour : c
                );
                
                setCategories(newCategories);
                setCategorieAEditer(null);
                setNomEdition('');
                onCategoriesChange?.(newCategories);
            } catch (err) {
                console.error("Erreur mise à jour:", err);
                alert(err.response?.data?.message || "Erreur lors de la mise à jour de la catégorie");
            }
        } else {
            setCategorieAEditer(cat);
            setNomEdition(cat.nomCategorie);
        }
    };

    const handleAnnulerEdition = () => {
        setCategorieAEditer(null);
        setNomEdition('');
    };

    const handleSupprimerCategorie = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?") || !checkAuth()) return;
        
        try {
            await deleteCategorie(id);
            const newCategories = categories.filter(cat => cat.numCategorie !== id);
            setCategories(newCategories);
            onCategoriesChange?.(newCategories);
        } catch (err) {
            console.error("Erreur suppression:", err);
            alert(err.response?.data?.message || "Erreur lors de la suppression de la catégorie");
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
                <button type="submit" className="btn-ajouter-categorie">+</button>
            </form>

            <ul className="liste-categories">
                {categories.map(cat => (
                    <li key={cat.numCategorie} className="categorie-item">
                        {categorieAEditer && categorieAEditer.numCategorie === cat.numCategorie ? (
                            <input 
                                type="text"
                                value={nomEdition}
                                onChange={(e) => setNomEdition(e.target.value)}
                                className="input-edition-categorie"
                            />
                        ) : (
                            <span>{cat.nomCategorie} (ID: {cat.numCategorie})</span>
                        )}
                        <div className="categorie-actions">
                            {categorieAEditer && categorieAEditer.numCategorie === cat.numCategorie ? (
                                <>
                                    <button className="btn-sauvegarder-categorie" onClick={() => handleEditerOuMettreAJour(cat)}>Sauvegarder</button>
                                    <button className="btn-annuler-categorie" onClick={handleAnnulerEdition}>Annuler</button>
                                </>
                            ) : (
                                <button className="btn-editer-categorie" onClick={() => handleEditerOuMettreAJour(cat)}>Éditer</button>
                            )}
                            <button
                                onClick={() => handleSupprimerCategorie(cat.numCategorie)}
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