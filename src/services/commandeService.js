import api from "./api";

const COMMANDE_URL = "/commandes";
const MES_COMMANDES_URL = "/mesCommandes";

const getConfig = (isFormData = false) => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = { Authorization: `Bearer ${token}` };
  if (isFormData) headers["Content-Type"] = "multipart/form-data";

  return { headers, withCredentials: true };
};

// Créer une commande (client)
export const createCommande = async (data) => {
  const res = await api.post(COMMANDE_URL, data, getConfig());
  return res.data;
};

// Récupérer toutes les commandes du client
export const fetchMesCommandes = async () => {
  const res = await api.get(MES_COMMANDES_URL, getConfig());
  return res.data;
};

// Récupérer une seule commande du client
export const fetchCommandeById = async (id) => {
  const res = await api.get(`${MES_COMMANDES_URL}/${id}`, getConfig());
  return res.data;
};

// Modifier une commande du client (adresse, mode paiement…)
export const updateCommande = async (id, data) => {
  const res = await api.post(
    `${MES_COMMANDES_URL}/${id}?_method=PUT`,
    data,
    getConfig()
  );
  return res.data;
};
