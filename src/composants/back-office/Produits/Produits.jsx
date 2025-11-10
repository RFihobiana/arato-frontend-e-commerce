import React, { useState, useEffect } from 'react';
import AjouterProduitModal from './AjouterProduitModal';
import ProduitCard from './ProduitCard';
import GestionCategories from './categorie';
import { fetchProduits, deleteProduit } from '../../../services/produitService';
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
    } catch (err) {
      setError(err.response?.status === 401 ? "Veuillez vous connecter pour accéder aux produits" : "Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduits();
  }, []);

  const produitsFiltres = categorieFiltre === 0 ? products : products.filter(p => p.numCategorie === categorieFiltre);

  const getNomCategorie = (numCategorie) => {
    const cat = categories.find(c => c.numCategorie === numCategorie);
    return cat ? cat.nomCategorie : "N/A";
  };

  const handleSaveProduit = (produitMisAJour) => {
    setProducts(prev => {
      const existe = prev.find(p => p.id === produitMisAJour.id);
      if (existe) {
        return prev.map(p => p.id === produitMisAJour.id ? produitMisAJour : p);
      } else {
        return [produitMisAJour, ...prev];
      }
    });
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
      await loadProduits();
    } catch (err) {
      alert("Erreur lors de la suppression du produit");
    }
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="gestion-produits-bo">
      <header className="header-produits-bo">
        <h1 className="titre-page-bo">Gestion des Produits</h1>
        <button className="btn-ajouter-produit-bo" onClick={() => setIsModalOpen(true)}>+</button>
      </header>
      <hr className="separateur-bo"/>
      <GestionCategories onCategoriesChange={setCategories} />
      <hr className="separateur-bo"/>
      <div className="filtre-container-bo">
        <label className="filtre-label-bo">Filtrer par catégorie :</label>
        <select className="filtre-select-bo" value={categorieFiltre} onChange={(e) => setCategorieFiltre(parseInt(e.target.value, 10))}>
          <option value={0}>Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.numCategorie} value={cat.numCategorie}>{cat.nomCategorie}</option>
          ))}
        </select>
      </div>
      <section className="section-catalogue-bo">
        <div className="liste-produits-grid-bo">
          {produitsFiltres.length > 0 ? produitsFiltres.map(produit => (
            <ProduitCard
              key={produit.id || produit.nomProduit}
              produit={produit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getNomCategorie={getNomCategorie}
            />
          )) : <p className="message-vide-bo">Aucun produit trouvé pour ce filtre.</p>}
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
