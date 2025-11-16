// panierService.js
import api from "./api";

const PANIER_LOCAL_KEY = "panier_local";

export const getOrCreatePanier = async (connected = false) => {
  if (!connected) {
    return JSON.parse(localStorage.getItem(PANIER_LOCAL_KEY) || "[]");
  }
  const res = await api.post("/panier", {});
  return res.data.numPanier;
};

export const ajouterAuPanier = async (produit, connected = false) => {
  if (!connected) {
    let panierLocal = JSON.parse(localStorage.getItem(PANIER_LOCAL_KEY) || "[]");
    const existing = panierLocal.find(p => p.numProduit === produit.numProduit);
    if (existing) existing.poids += 1;
    else panierLocal.push({ ...produit, poids: 1, decoupe: "entier" });
    localStorage.setItem(PANIER_LOCAL_KEY, JSON.stringify(panierLocal));
    return true;
  }

  const panierId = await getOrCreatePanier(true);
  await api.post("/detail_panier", {
    numPanier: panierId,
    numProduit: produit.numProduit,
    poids: 1,
    decoupe: "entier",
  });
  return true;
};

export const getPanierWithDetails = async (connected = false) => {
  if (!connected) return JSON.parse(localStorage.getItem(PANIER_LOCAL_KEY) || "[]");
  const panierId = await getOrCreatePanier(true);
  const res = await api.get(`/detail_panier/${panierId}`);
  return res.data;
};

export const updateDetailPanier = async (numProduit, updates, connected = false) => {
  if (!connected) {
    let panierLocal = JSON.parse(localStorage.getItem(PANIER_LOCAL_KEY) || "[]");
    panierLocal = panierLocal.map(p => p.numProduit === numProduit ? { ...p, ...updates } : p);
    localStorage.setItem(PANIER_LOCAL_KEY, JSON.stringify(panierLocal));
    return true;
  }
  return await api.put(`/detail_panier/${numProduit}`, updates);
};

export const deleteDetailPanier = async (numProduit, connected = false) => {
  if (!connected) {
    let panierLocal = JSON.parse(localStorage.getItem(PANIER_LOCAL_KEY) || "[]");
    panierLocal = panierLocal.filter(p => p.numProduit !== numProduit);
    localStorage.setItem(PANIER_LOCAL_KEY, JSON.stringify(panierLocal));
    return true;
  }
  return await api.delete(`/detail_panier/${numProduit}`);
};
