import React, { useState, useEffect } from 'react';
import AjouterProduitModal from './AjouterProduitModal';
import ProduitCard from './ProduitCard';
import GestionCategories from './categorie';
import { fetchProduits, deleteProduit } from '../../../services/produitService';
import { getCategories } from '../../../services/categorieService';
import "../../../styles/back-office/produits.css";

const Produits = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [categorieFiltre, setCategorieFiltre] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produitAEditer, setProduitAEditer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduits = async () => {
    try {
      setLoading(true);
      const data = await fetchProduits();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      if (error.response?.status === 401) {
        setError("Veuillez vous connecter pour accéder aux produits");
      } else {
        setError("Erreur lors du chargement des produits");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  useEffect(() => {
    loadProduits();
    loadCategories();
  }, []);

  const produitsFiltres = categorieFiltre === 0
    ? products
    : products.filter(p => p.numCategorie === categorieFiltre);

  const handleSaveProduit = (produitMisAJour) => {
    const existe = products.find(p => p.id === produitMisAJour.id);
    if (existe) {
      setProducts(products.map(p => p.id === produitMisAJour.id ? produitMisAJour : p));
    } else {
      setProducts([produitMisAJour, ...products]);
    }
    setProduitAEditer(null);
    setIsModalOpen(false);
  };

  const handleEdit = (produit) => {
    setProduitAEditer(produit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      await deleteProduit(id);
      await loadProduits(); // ← AJOUTÉ: Recharger après suppression
    } catch (error) {
      console.error("Erreur suppression produit:", error);
      alert("Erreur lors de la suppression du produit");
    }
  };

  const openAjouterModal = () => {
    setProduitAEditer(null); 
    setIsModalOpen(true);
  };

  const handleCategoriesChange = (newCategories) => {
    setCategories(newCategories);
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="gestion-produits-bo">
      <header className="header-produits-bo">
        <h1 className="titre-page-bo">Gestion des Produits</h1>
        <button
          className="btn-ajouter-produit-bo"
          onClick={openAjouterModal}
        >
          <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Ajouter un produit
        </button>
      </header>
      
      <hr className="separateur-bo"/>
      <GestionCategories onCategoriesChange={handleCategoriesChange} />
      <hr className="separateur-bo"/>
      
      <div className="filtre-container-bo">
        <label className="filtre-label-bo">Filtrer par catégorie :</label>
        <select 
          className="filtre-select-bo"
          value={categorieFiltre}
          onChange={(e) => setCategorieFiltre(parseInt(e.target.value, 10))}
        >
          <option value={0}>Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option> // ← CORRIGÉ: cat.id au lieu de cat.numCategorie
          ))}
        </select>
      </div>

      <section className="section-catalogue-bo">
        <div className="liste-produits-grid-bo">
          {produitsFiltres.length > 0 ? (
            produitsFiltres.map(produit => (
              <ProduitCard 
                key={produit.id} // ← CORRIGÉ: produit.id au lieu de produit.numProduit
                produit={produit} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
             <p className="message-vide-bo">Aucun produit trouvé pour ce filtre.</p>
          )}
        </div>
      </section>

      <AjouterProduitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduit}
        produitAEditer={produitAEditer}
        categories={categories}
      />
    </div>
  );
};

export default Produits;