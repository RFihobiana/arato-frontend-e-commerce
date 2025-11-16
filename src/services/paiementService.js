import api from "./api";

export const createPaiement = async (data) => {
  const response = await api.post("/paiements", data);
  return response.data;
};

export const getAllPaiements = async () => {
  const response = await api.get("/paiements");
  return response.data;
};

export const getPaiementById = async (id) => {
  const response = await api.get(`/paiements/${id}`);
  return response.data;
};
