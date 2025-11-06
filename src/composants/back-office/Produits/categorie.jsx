import React, { useState } from 'react';

const initialCategories = [
    { id: 1, nom: "Légumes et Fruits" },
    { id: 2, nom: "Viandes et Poissons" },
    { id: 3, nom: "Épicerie" },
];

const categorie = ({ onCategoriesChange }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [nouvelleCategorieNom, setNouvelleCategorieNom] = useState('');

    const handleAjouterCategorie = (e) => {
        e.preventDefault();
        if (nouvelleCategorieNom.trim() === '') return;

        const nouvelleCategorie = {
            id: Date.now(),
            nom: nouvelleCategorieNom.trim(),
        };

        const newCategories = [...categories, nouvelleCategorie];
        setCategories(newCategories);
        setNouvelleCategorieNom('');
        onCategoriesChange(newCategories);
    };

    const handleSupprimerCategorie = (id) => {
        const newCategories = categories.filter(cat => cat.id !== id);
        setCategories(newCategories);
        onCategoriesChange(newCategories);
    };

    return (
        <div className="gestion-categories">
            <h2 className="titre-section">⚙️ Gestion des Catégories</h2>
            
            <form onSubmit={handleAjouterCategorie} className="form-categorie">
                <input
                    type="text"
                    value={nouvelleCategorieNom}
                    onChange={(e) => setNouvelleCategorieNom(e.target.value)}
                    placeholder="Nom de la nouvelle catégorie"
                    className="input-categorie"
                    required
                />
                <button type="submit" className="btn-ajouter-categorie">Ajouter</button>
            </form>

            <ul className="liste-categories">
                {categories.map(categorie => (
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

export default categorie;