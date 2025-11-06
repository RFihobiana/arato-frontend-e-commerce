import React, { useState } from 'react';
import AjouterProduitModal from './AjouterProduitModal';
import ProduitCard from './ProduitCard';
import GestionCategories from './categorie';
import "../../../styles/back-office/produits.css";

const initialProducts = [
  { id: 1, nom: "Carotte", prix: "500Ar/kg", image: 'carotte.png', promotion:{valeur:'-50%'}, numCategorie: 1},
  { id: 2, nom: "Tomate", prix: "500Ar/kg", image: 'tomate.png', promotion: null, numCategorie: 1},
  { id: 3, nom: "Chou", prix: "500Ar/kg", image: 'chou.png', promotion: null, numCategorie: 1},
  { id: 4, nom: "Bavette de Boeuf", prix: "7500Ar/kg", image: 'viande.jpg', promotion: { valeur: '-20%' }, numCategorie: 2},
  { id: 5, nom: "Pomme de Terre", prix: "400Ar/kg", image: 'pommedeterre.png', promotion: { valeur: '-10%' }, numCategorie: 1},
];

const initialCategories = [
    { id: 1, nom: "Légumes et Fruits" },
    { id: 2, nom: "Viandes et Poissons" },
    { id: 3, nom: "Épicerie" },
];

const Produits = () => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories); 
  const [categorieFiltre, setCategorieFiltre] = useState(0); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produitAEditer, setProduitAEditer] = useState(null); 

  const produitsFiltres = categorieFiltre === 0
    ? products
    : products.filter(p => p.numCategorie === categorieFiltre);
  
  const handleSaveProduit = (produitMisAJour) => {
    if (produitAEditer) {
      setProducts(products.map(p => 
        p.id === produitMisAJour.id ? produitMisAJour : p
      ));
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
  
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  
  const openAjouterModal = () => {
    setProduitAEditer(null); 
    setIsModalOpen(true);
  };
  
  const handleCategoriesChange = (newCategories) => {
    setCategories(newCategories);
  };

  return (
    <div className="gestion-produits-bo">
      <header className="header-produits-bo">
        <h1 className="titre-page-bo">Gestion des Produits</h1>
        <button
          className="btn-ajouter-produit-bo"
          onClick={openAjouterModal}
        >
          <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
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
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
      </div>

      <section className="section-catalogue-bo">
        <div className="liste-produits-grid-bo">
          {produitsFiltres.length > 0 ? (
            produitsFiltres.map(produit => (
              <ProduitCard 
                key={produit.id} 
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