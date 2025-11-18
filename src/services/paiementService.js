import api from "./api";

const getConfig = () => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Utilisateur non authentifié");
  return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
};

export const fetchPaiements = async () => {
  const res = await api.get("/paiements", getConfig());
  return res.data;
};

export const fetchPaiementById = async (id) => {
  const res = await api.get(`/paiements/${id}`, getConfig());
  return res.data;
};

export const createPaiement = async (data) => {
  const res = await api.post("/paiements", data, getConfig());
  return res.data;
};

export const updatePaiement = async (id, data) => {
  const res = await api.put(`/paiements/${id}`, data, getConfig());
  return res.data;
};

export const deletePaiement = async (id) => {
  const res = await api.delete(`/paiements/${id}`, getConfig());
  return res.data;
};

export const fetchModes = async () => {
  const res = await api.get("/modes-paiement", getConfig());
  return res.data;
};

export const fetchModeById = async (id) => {
  const res = await api.get(`/modes-paiement/${id}`, getConfig());
  return res.data;
};

export const createMode = async (data) => {
  const res = await api.post("/modes-paiement", data, getConfig());
  return res.data;
};

export const updateMode = async (id, data) => {
  const res = await api.put(`/modes-paiement/${id}`, data, getConfig());
  return res.data;
};

export const deleteMode = async (id) => {
  const res = await api.delete(`/modes-paiement/${id}`, getConfig());
  return res.data;
};
