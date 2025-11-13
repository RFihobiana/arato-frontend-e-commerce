import api from './api';

// Récupérer les paniers de l'utilisateur connecté
export const fetchPaniers = async () => {
  const res = await api.get('/panier');
  return res.data;
};

// Mettre à jour un détail panier
export const updateDetailPanier = async (numDetailPanier, data) => {
  const res = await api.put(`/detail_panier/${numDetailPanier}`, data);
  return res.data;
};

// Supprimer un produit du panier
export const deleteDetailPanier = async (numDetailPanier) => {
  const res = await api.delete(`/detail_panier/${numDetailPanier}`);
  return res.data;
};

// Ajouter un produit au panier
export const ajouterAuPanier = async (produit) => {
  const userId = localStorage.getItem("userId");

  if (userId) {
    try {
      let panier = JSON.parse(localStorage.getItem("panierId") || "null");

      if (!panier) {
        const res = await api.post("/panier", {});
        panier = res.data.numPanier;
        localStorage.setItem("panierId", panier);
      }

      await api.post("/detail_panier", {
        numPanier: panier,
        numProduit: produit.numProduit,
        quantite: 1,
        decoupeOption: "entier"
      });

      // Mise à jour automatique du panier dans le frontend
      window.dispatchEvent(new CustomEvent('panierUpdated'));

      alert("Produit ajouté au panier");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout au panier");
    }
  } else {
    const localPanier = JSON.parse(localStorage.getItem("panier") || "[]");
    const exist = localPanier.find(p => p.numProduit === produit.numProduit);

    if (exist) {
      exist.quantityKg += 1;
    } else {
      localPanier.push({ ...produit, quantityKg: 1, cuttingOption: "entier" });
    }

    localStorage.setItem("panier", JSON.stringify(localPanier));
    window.dispatchEvent(new CustomEvent('panierUpdated'));
    alert("Produit ajouté au panier (local)");
  }
};
