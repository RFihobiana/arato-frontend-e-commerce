import React, { useState, useEffect } from 'react';
import { getCategories, createCategorie, deleteCategorie } from '../../../services/categorieService';

const Categorie = ({ onCategoriesChange }) => {
  const [categories, setCategories] = useState([]);
  const [nouvelleCategorieNom, setNouvelleCategorieNom] = useState('');
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

  const handleAjouterCategorie = async (e) => {
    e.preventDefault();
    if (!nouvelleCategorieNom.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert("Veuillez vous connecter pour ajouter une catégorie");
        return;
      }

      const nouvelleCategorie = await createCategorie(nouvelleCategorieNom.trim());
      const newCategories = [...categories, nouvelleCategorie];
      setCategories(newCategories);
      setNouvelleCategorieNom('');
      onCategoriesChange?.(newCategories);
    } catch (err) {
      console.error("Erreur création:", err);
      alert(err.response?.data?.message || "Erreur lors de la création de la catégorie");
    }
  };

  const handleSupprimerCategorie = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
    
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert("Veuillez vous connecter pour supprimer une catégorie");
        return;
      }

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
            <span>{cat.nomCategorie} (ID: {cat.numCategorie})</span>
            <div className="categorie-actions">
              <button className="btn-editer-categorie">Éditer</button>
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
