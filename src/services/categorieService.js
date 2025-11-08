import api from "./api";

const CATEGORIE_URL = "/categories";

// Récupérer la config avec token si présent
const getConfig = () => {
  const token = localStorage.getItem("userToken");
  return token
    ? { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    : { withCredentials: true };
};

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const res = await api.get(CATEGORIE_URL, getConfig());
    return res.data;
  } catch (error) {
    console.error("Erreur chargement catégories: ", error);
    return []; // Retourne un tableau vide si erreur
  }
};

// Créer une catégorie
export const createCategorie = async (nomCategorie) => {
  try {
    const res = await api.post(CATEGORIE_URL, { nomCategorie }, getConfig());
    return res.data;
  } catch (error) {
    console.error("Erreur création catégorie: ", error);
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategorie = async (id) => {
  try {
    const res = await api.delete(`${CATEGORIE_URL}/${id}`, getConfig());
    return res.data;
  } catch (error) {
    console.error("Erreur suppression catégorie: ", error);
    throw error;
  }
};
